import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim();
});

const supabaseService = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testCertFields() {
  const courses = await supabaseService.from('courses').select('*');
  const courseId = courses.data[0].id;

  const testCoreCand = {
    full_name: 'FIELD TEST SEAFARER',
    passport_id: 'FIELD-PASS-' + Date.now()
  };
  const candInsert = await supabaseService.from('candidates').insert([testCoreCand]).select().single();

  const fieldsToTest = [
    'salutation',
    'stcw_regulation',
    'resolution_number',
    'resolution_date',
    'resolution_expiry',
    'held_from',
    'held_to',
    'course_mode',
    'conducted_at',
    'validity_years_text',
    'revision_code',
    'numeric_hash'
  ];

  console.log('Testing baseline cert insert (no optional fields):');
  const basePayload = {
    certificate_number: 'TEST-BASE-' + Date.now(),
    candidate_id: candInsert.data.id,
    course_id: courseId,
    issue_date: '2026-07-28',
    expiry_date: '2031-07-28',
    status: 'VALID',
    verification_hash: 'basehash' + Date.now()
  };
  const baseRes = await supabaseService.from('certificates').insert([basePayload]).select().single();
  console.log('Baseline Insert Error:', baseRes.error ? baseRes.error.message : 'SUCCESS');
  if (baseRes.data) await supabaseService.from('certificates').delete().eq('id', baseRes.data.id);

  console.log('\nTesting individual fields:');
  const validFields = [];
  const invalidFields = [];

  for (const field of fieldsToTest) {
    const payload = {
      ...basePayload,
      certificate_number: 'TEST-' + field + '-' + Date.now(),
      verification_hash: 'hash-' + field + '-' + Date.now(),
      [field]: 'test'
    };
    const res = await supabaseService.from('certificates').insert([payload]).select().single();
    if (res.error) {
      invalidFields.push({ field, error: res.error.message });
    } else {
      validFields.push(field);
      await supabaseService.from('certificates').delete().eq('id', res.data.id);
    }
  }

  console.log('\nValid columns in DB:', validFields);
  console.log('Invalid/Missing columns in DB:', invalidFields);

  await supabaseService.from('candidates').delete().eq('id', candInsert.data.id);
}

testCertFields().catch(console.error);
