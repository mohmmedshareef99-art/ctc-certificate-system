import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) env[parts[0].trim()] = parts.slice(1).join('=').trim();
});

const supabaseService = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const INITIAL_COURSES = [
  {
    course_code: 'STCW III/5',
    title: 'ABLE SEAFARER ENGINE',
    category: 'STCW Engine',
    description: 'Training course fulfilling Regulation III/5, Section A-III/5, Table III/5 of the IMO STCW 1978 as amended.'
  },
  {
    course_code: 'STCW VI/1-2',
    title: 'Prevención y Lucha Contra Incendios (Basic Firefighting)',
    category: 'STCW Firefighting',
    description: 'Entrenamiento en extinción de incendios a bordo, uso de ERA y mangueras.'
  },
  {
    course_code: 'STCW VI/5',
    title: 'Oficial de Protección del Buque (Ship Security Officer - SSO)',
    category: 'STCW Security',
    description: 'Evaluación de riesgos de piratería y planes de protección del buque.'
  },
  {
    course_code: 'STCW VI/2-1',
    title: 'Embarcaciones de Supervivencia y Botes de Rescate (PSCRB)',
    category: 'STCW Survival',
    description: 'Operación y arriado de botes salvavidas y rescate en mar.'
  }
];

async function seedCoursesCore() {
  console.log('Seeding standard courses into Supabase DB (core payload)...');
  for (const crs of INITIAL_COURSES) {
    const existing = await supabaseService.from('courses').select('id').eq('course_code', crs.course_code).maybeSingle();
    if (!existing.data) {
      const inserted = await supabaseService.from('courses').insert([crs]).select().single();
      console.log(`Created course ${crs.course_code}:`, inserted.data?.id, inserted.error?.message);
    } else {
      console.log(`Course ${crs.course_code} already exists:`, existing.data.id);
    }
  }

  const allCourses = await supabaseService.from('courses').select('*');
  console.log('\nAll courses in DB:', allCourses.data);
}

seedCoursesCore().catch(console.error);
