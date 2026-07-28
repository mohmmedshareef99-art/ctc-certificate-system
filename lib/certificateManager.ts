import { createClient } from '@/lib/supabase/client';

export interface Candidate {
  id: string;
  full_name: string;
  passport_id: string;
  identity_number?: string;
  rank_position?: string;
  nationality?: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  created_at?: string;
  certificates_count?: number;
}

export interface CourseRecord {
  id: string;
  course_code: string;
  title: string;
  category: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export type CertificateStatus = 'VALID' | 'EXPIRED' | 'REVOKED';

export interface CertificateRecord {
  id: string;
  certificate_number: string;
  candidate_id: string;
  course_id: string;
  issue_date: string;
  expiry_date: string;
  status: CertificateStatus;
  verification_hash: string;
  salutation?: string;
  stcw_regulation?: string;
  resolution_number?: string;
  resolution_date?: string;
  resolution_expiry?: string;
  held_from?: string;
  held_to?: string;
  course_mode?: string;
  conducted_at?: string;
  validity_years_text?: string;
  revision_code?: string;
  numeric_hash?: string;
  created_at?: string;
  // Joined fields for UI convenience
  candidate?: Candidate;
  course?: CourseRecord;
}

// Initial In-Memory Seed Data for fallback
const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    full_name: 'BRIJESH KUMAR KUSHWAHA',
    passport_id: 'AB483436',
    rank_position: 'Able Seafarer Engine',
    nationality: 'Indian',
    date_of_birth: '1992-05-14',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'cand-002',
    full_name: 'MARÍA FERNANDA ROJAS MORALES',
    passport_id: 'PA-92810482',
    rank_position: 'Second Officer',
    nationality: 'Panamanian',
    date_of_birth: '1995-11-20',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'cand-003',
    full_name: 'JOHNATHAN ARTHUR SMITH',
    passport_id: 'US-93821094',
    rank_position: 'Chief Engineer',
    nationality: 'American',
    date_of_birth: '1988-03-08',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  }
];

const INITIAL_COURSES: CourseRecord[] = [
  {
    id: 'course-000',
    course_code: 'STCW III/5',
    title: 'ABLE SEAFARER ENGINE',
    category: 'STCW Engine',
    description: 'Training course fulfilling Regulation III/5, Section A-III/5, Table III/5 of the IMO STCW 1978 as amended.'
  },
  {
    id: 'course-001',
    course_code: 'STCW VI/1-2',
    title: 'Prevención y Lucha Contra Incendios (Basic Firefighting)',
    category: 'STCW Firefighting',
    description: 'Entrenamiento en extinción de incendios a bordo, uso de ERA y mangueras.'
  },
  {
    id: 'course-002',
    course_code: 'STCW VI/5',
    title: 'Oficial de Protección del Buque (Ship Security Officer - SSO)',
    category: 'STCW Security',
    description: 'Evaluación de riesgos de piratería y planes de protección del buque.'
  },
  {
    id: 'course-003',
    course_code: 'STCW VI/2-1',
    title: 'Embarcaciones de Supervivencia y Botes de Rescate (PSCRB)',
    category: 'STCW Survival',
    description: 'Operación y arriado de botes salvavidas y rescate en mar.'
  }
];

const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-000',
    certificate_number: 'UAG-TC-26-ASE-00417',
    candidate_id: 'cand-001',
    course_id: 'course-000',
    salutation: 'Mr.',
    issue_date: '2026-04-11',
    expiry_date: '2031-04-10',
    status: 'VALID',
    verification_hash: '35830462448604a7b8c9d0e1f2345678',
    stcw_regulation: 'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
    resolution_number: 'DGGM-CFM-005-2024',
    resolution_date: '2024-02-06',
    resolution_expiry: '2026-06-12',
    held_from: '2026-03-10',
    held_to: '2026-04-10',
    course_mode: 'Presential',
    conducted_at: 'AZERBAIJAN',
    validity_years_text: '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
    revision_code: 'REV. 2/2024',
    numeric_hash: '35830462448604'
  },
  {
    id: 'cert-001',
    certificate_number: 'CTC-AMP-2025-08492',
    candidate_id: 'cand-002',
    course_id: 'course-001',
    salutation: 'Ms.',
    issue_date: '2024-03-15',
    expiry_date: '2029-03-14',
    status: 'VALID',
    verification_hash: 'a7b8c9d0e1f234567890abcdef123456',
    stcw_regulation: 'Regulation VI/1-2 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
    resolution_number: 'DGGM-CFM-005-2024',
    resolution_date: '2024-02-06',
    resolution_expiry: '2026-06-12',
    held_from: '2024-03-01',
    held_to: '2024-03-14',
    course_mode: 'Presential',
    conducted_at: 'PANAMA',
    validity_years_text: '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
    revision_code: 'REV. 2/2024',
    numeric_hash: '84920194820194'
  }
];

// Local Storage Keys for offline / dev fallback
const LOCAL_STORAGE_CANDIDATES_KEY = 'ctc_candidates';
const LOCAL_STORAGE_COURSES_KEY = 'ctc_courses';
const LOCAL_STORAGE_CERTS_KEY = 'ctc_certificates';

function getLocalStorageData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setLocalStorageData<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

/**
 * Fetch candidate list from Supabase API route with LocalStorage fallback.
 */
export async function getCandidates(search?: string): Promise<Candidate[]> {
  const deduplicate = (list: Candidate[]): Candidate[] => {
    const seen = new Set<string>();
    return list.filter((cand) => {
      if (!cand) return false;
      const key = cand.id || `${cand.full_name}-${cand.passport_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  try {
    const url = search ? `/api/candidates?search=${encodeURIComponent(search)}` : '/api/candidates';
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.candidates)) {
        return deduplicate(json.candidates);
      }
    }
  } catch (e) {
    console.warn('API /api/candidates fetch failed, trying direct Supabase query', e);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('candidates').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      let filtered = data;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((c: any) =>
          c.full_name?.toLowerCase().includes(q) ||
          c.passport_id?.toLowerCase().includes(q) ||
          c.rank_position?.toLowerCase().includes(q) ||
          c.nationality?.toLowerCase().includes(q)
        );
      }
      return deduplicate(filtered);
    }
  } catch (e) {
    console.warn('Supabase candidates fetch failed, using local storage fallback', e);
  }

  const local = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
  if (search) {
    const q = search.toLowerCase();
    return deduplicate(local.filter((c) =>
      c.full_name?.toLowerCase().includes(q) ||
      c.passport_id?.toLowerCase().includes(q) ||
      c.rank_position?.toLowerCase().includes(q) ||
      c.nationality?.toLowerCase().includes(q)
    ));
  }
  return deduplicate(local);
}

/**
 * Add a new candidate via API route.
 */
export async function createCandidate(newCandidate: Omit<Candidate, 'id' | 'created_at' | 'certificates_count'>): Promise<Candidate> {
  const res = await fetch('/api/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCandidate)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to create candidate');
  }

  const created = json.candidate;
  if (typeof window !== 'undefined') {
    try {
      const local = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
      setLocalStorageData(LOCAL_STORAGE_CANDIDATES_KEY, [created, ...local]);
    } catch (e) {
      console.warn('LocalStorage sync error on candidate creation:', e);
    }
  }

  return created;
}

/**
 * Update an existing candidate via API route.
 */
export async function updateCandidate(
  id: string,
  updates: Partial<Omit<Candidate, 'id' | 'created_at' | 'certificates_count'>>
): Promise<Candidate> {
  const res = await fetch(`/api/candidates/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update candidate');
  }

  const updated = json.candidate;
  if (typeof window !== 'undefined') {
    try {
      const local = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
      const newLocal = local.map((c) => (c.id === id ? { ...c, ...updated } : c));
      setLocalStorageData(LOCAL_STORAGE_CANDIDATES_KEY, newLocal);
    } catch (e) {
      console.warn('LocalStorage sync error on candidate update:', e);
    }
  }

  return updated;
}

/**
 * Delete candidate from Supabase DB via API route.
 */
export async function deleteCandidate(id: string): Promise<void> {
  const res = await fetch(`/api/candidates/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to delete candidate');
  }

  if (typeof window !== 'undefined') {
    try {
      const local = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
      const newLocal = local.filter((c) => c.id !== id);
      setLocalStorageData(LOCAL_STORAGE_CANDIDATES_KEY, newLocal);
    } catch (e) {
      console.warn('LocalStorage delete cleanup error:', e);
    }
  }
}


/**
 * Fetch course list from Supabase API handler with local fallback.
 */
export async function getCourses(): Promise<CourseRecord[]> {
  try {
    const res = await fetch('/api/courses');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.courses)) {
        return json.courses;
      }
    }
  } catch (e) {
    console.warn('API /api/courses fetch failed, trying direct Supabase query', e);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((c) => ({ ...c, is_active: c.is_active ?? true }));
    }
  } catch (e) {
    console.warn('Supabase courses fetch failed, using local fallback', e);
  }

  return getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES.map(c => ({ ...c, is_active: c.is_active ?? true })));
}

/**
 * Add a new course.
 */
export async function createCourse(newCourse: Omit<CourseRecord, 'id' | 'created_at'>): Promise<CourseRecord> {
  try {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.course) {
        return json.course;
      }
    }
  } catch (e) {
    console.warn('API /api/courses POST failed, trying direct Supabase client', e);
  }

  const generatedId = `course-${Date.now().toString(36)}`;
  const course: CourseRecord = {
    ...newCourse,
    id: generatedId,
    is_active: true,
    created_at: new Date().toISOString()
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        course_code: course.course_code,
        title: course.title,
        category: course.category,
        description: course.description,
        is_active: true
      }])
      .select()
      .single();

    if (!error && data) {
      const local = getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES);
      setLocalStorageData(LOCAL_STORAGE_COURSES_KEY, [data, ...local]);
      return data;
    }
  } catch (e) {
    console.warn('Supabase course creation failed, using local storage', e);
  }

  const local = getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES);
  const updated = [course, ...local];
  setLocalStorageData(LOCAL_STORAGE_COURSES_KEY, updated);
  return course;
}

/**
 * Update existing course details in Supabase.
 */
export async function updateCourse(id: string, updates: Partial<Omit<CourseRecord, 'id' | 'created_at'>>): Promise<CourseRecord> {
  const res = await fetch('/api/courses/' + encodeURIComponent(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update course');
  }

  return json.course;
}

/**
 * Toggle course active state (Enable / Disable) in Supabase.
 */
export async function toggleCourseStatus(id: string, is_active?: boolean): Promise<CourseRecord> {
  const res = await fetch('/api/courses/' + encodeURIComponent(id) + '/toggle', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active })
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to toggle course status');
  }

  return json.course;
}

/**
 * Delete course from Supabase DB.
 */
export async function deleteCourse(id: string): Promise<void> {
  const res = await fetch('/api/courses/' + encodeURIComponent(id), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to delete course');
  }

  if (typeof window !== 'undefined') {
    try {
      const local = getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES);
      const updated = local.filter((c) => c.id !== id);
      setLocalStorageData(LOCAL_STORAGE_COURSES_KEY, updated);
    } catch (e) {
      console.warn('LocalStorage delete cleanup error:', e);
    }
  }
}

/**
 * Fetch certificate by verification_hash or certificate_number.
 */
export async function getCertificateByHash(hash: string): Promise<CertificateRecord | null> {
  const cleanHash = hash.trim().toLowerCase();

  try {
    const res = await fetch(`/api/certificates?search=${encodeURIComponent(cleanHash)}`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.certificates) && json.certificates.length > 0) {
        const match = json.certificates.find(
          (c: any) =>
            c.verification_hash?.toLowerCase() === cleanHash ||
            c.certificate_number?.toLowerCase() === cleanHash
        );
        if (match) return match as CertificateRecord;
      }
    }
  } catch (e) {
    console.warn('API lookup failed for hash, trying client Supabase query', e);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .or(`verification_hash.eq.${cleanHash},certificate_number.ilike.${cleanHash}`)
      .single();

    if (!error && data) {
      return data as CertificateRecord;
    }
  } catch (e) {
    console.warn('Supabase lookup failed for hash, checking local storage', e);
  }

  const localCerts = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
  const localCandidates = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
  const localCourses = getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES);

  const match = localCerts.find(
    (c) => c.verification_hash.toLowerCase() === cleanHash || c.certificate_number.toLowerCase() === cleanHash
  );

  if (match) {
    const cand = localCandidates.find((c) => c.id === match.candidate_id) || INITIAL_CANDIDATES[0];
    const crs = localCourses.find((c) => c.id === match.course_id) || INITIAL_COURSES[0];
    return {
      ...match,
      candidate: cand,
      course: crs
    };
  }

  return null;
}

/**
 * Fetch all certificates with candidate & course relations.
 */
/**
 * Fetch all certificates with candidate & course relations from API route or direct Supabase.
 */
export async function getCertificates(search?: string): Promise<CertificateRecord[]> {
  try {
    const url = search ? `/api/certificates?search=${encodeURIComponent(search)}` : '/api/certificates';
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.certificates)) {
        return json.certificates;
      }
    }
  } catch (e) {
    console.warn('API /api/certificates fetch failed, trying direct Supabase query', e);
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from('certificates')
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let result = data as CertificateRecord[];
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(c => 
          c.certificate_number?.toLowerCase().includes(q) ||
          c.candidate?.full_name?.toLowerCase().includes(q) ||
          c.candidate?.passport_id?.toLowerCase().includes(q)
        );
      }
      return result;
    }
  } catch (e) {
    console.warn('Supabase fetch certificates failed, using local storage fallback', e);
  }

  const localCerts = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
  const localCandidates = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
  const localCourses = getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES);

  let mapped = localCerts.map((cert) => ({
    ...cert,
    candidate: localCandidates.find((c) => c.id === cert.candidate_id) || INITIAL_CANDIDATES[0],
    course: localCourses.find((c) => c.id === cert.course_id) || INITIAL_COURSES[0]
  }));

  if (search) {
    const q = search.toLowerCase();
    mapped = mapped.filter(c =>
      c.certificate_number?.toLowerCase().includes(q) ||
      c.candidate?.full_name?.toLowerCase().includes(q) ||
      c.candidate?.passport_id?.toLowerCase().includes(q)
    );
  }

  return mapped;
}

/**
 * Update certificate details and candidate information in Supabase DB via API route.
 */
export async function updateCertificate(
  id: string,
  updates: Partial<CertificateRecord> & {
    candidate_name?: string;
    candidate_passport?: string;
    candidate_photo?: string;
  }
): Promise<CertificateRecord> {
  const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update certificate');
  }

  // Update local storage fallback cache if present
  if (typeof window !== 'undefined') {
    try {
      const local = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
      const updatedLocal = local.map((c) => (c.id === id ? { ...c, ...json.certificate } : c));
      setLocalStorageData(LOCAL_STORAGE_CERTS_KEY, updatedLocal);
    } catch (e) {
      console.warn('LocalStorage sync warning on certificate update:', e);
    }
  }

  return json.certificate;
}

/**
 * Delete certificate from Supabase DB via API route.
 */
export async function deleteCertificate(id: string): Promise<void> {
  const res = await fetch(`/api/certificates/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to delete certificate');
  }

  if (typeof window !== 'undefined') {
    try {
      const local = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
      const updatedLocal = local.filter((c) => c.id !== id);
      setLocalStorageData(LOCAL_STORAGE_CERTS_KEY, updatedLocal);
    } catch (e) {
      console.warn('LocalStorage sync warning on certificate delete:', e);
    }
  }
}

/**
 * Issue a new certificate with comprehensive custom details.
 */
export async function createCertificate(
  candidateId: string,
  courseId: string,
  issueDate: string,
  expiryDate: string,
  details?: Partial<CertificateRecord>
): Promise<CertificateRecord> {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const certNumber = details?.certificate_number?.trim() || `UAG-TC-26-ASE-${randomNum}`;
  
  // Generate high-entropy hex verification hash
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) array[i] = Math.floor(Math.random() * 256);
  }
  const hash = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');

  // 14 digit numeric hash representation for bottom barcode
  const numHash = details?.numeric_hash?.trim() || Math.floor(10000000000000 + Math.random() * 90000000000000).toString();

  const newCert: Omit<CertificateRecord, 'id' | 'created_at'> = {
    certificate_number: certNumber,
    candidate_id: candidateId,
    course_id: courseId,
    issue_date: issueDate,
    expiry_date: expiryDate,
    status: details?.status || 'VALID',
    verification_hash: hash,
    salutation: details?.salutation || 'Mr.',
    stcw_regulation: details?.stcw_regulation || 'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
    resolution_number: details?.resolution_number || 'DGGM-CFM-005-2024',
    resolution_date: details?.resolution_date || '2024-02-06',
    resolution_expiry: details?.resolution_expiry || '2026-06-12',
    held_from: details?.held_from || '2026-03-10',
    held_to: details?.held_to || '2026-04-10',
    course_mode: details?.course_mode || 'Presential',
    conducted_at: details?.conducted_at || 'AZERBAIJAN',
    validity_years_text: details?.validity_years_text || '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
    revision_code: details?.revision_code || 'REV. 2/2024',
    numeric_hash: numHash
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('certificates')
      .insert([newCert])
      .select(`
        *,
        candidate:candidates(*),
        course:courses(*)
      `)
      .single();

    if (!error && data) {
      const local = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
      setLocalStorageData(LOCAL_STORAGE_CERTS_KEY, [data, ...local]);
      return data as CertificateRecord;
    }
  } catch (e) {
    console.warn('Supabase certificate creation failed, fallback to local storage', e);
  }

  const generatedId = `cert-${Date.now().toString(36)}`;
  const localCandidates = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
  const localCourses = getLocalStorageData<CourseRecord>(LOCAL_STORAGE_COURSES_KEY, INITIAL_COURSES);

  const localCert: CertificateRecord = {
    ...newCert,
    id: generatedId,
    created_at: new Date().toISOString(),
    candidate: localCandidates.find((c) => c.id === candidateId) || INITIAL_CANDIDATES[0],
    course: localCourses.find((c) => c.id === courseId) || INITIAL_COURSES[0]
  };

  const local = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
  setLocalStorageData(LOCAL_STORAGE_CERTS_KEY, [localCert, ...local]);
  return localCert;
}

/**
 * Update certificate status (VALID, EXPIRED, REVOKED).
 */
export async function updateCertificateStatus(id: string, status: CertificateStatus): Promise<boolean> {
  try {
    await updateCertificate(id, { status });
    return true;
  } catch (e) {
    console.warn('Status update failed via API route:', e);
    return false;
  }
}

/**
 * Register candidate and generate certificate in one single step with all detailed fields.
 */
export async function createCandidateAndCertificate(
  candidateData: Omit<Candidate, 'id' | 'created_at'>,
  courseId: string,
  issueDate: string,
  expiryDate: string,
  customCertDetails?: Partial<CertificateRecord>
): Promise<{ candidate: Candidate; certificate: CertificateRecord }> {
  try {
    const res = await fetch('/api/certificates/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate: candidateData,
        course_id: courseId,
        issue_date: issueDate,
        expiry_date: expiryDate,
        details: customCertDetails
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.certificate && data.candidate) {
        const localCerts = getLocalStorageData<CertificateRecord>(LOCAL_STORAGE_CERTS_KEY, INITIAL_CERTIFICATES);
        const localCandidates = getLocalStorageData<Candidate>(LOCAL_STORAGE_CANDIDATES_KEY, INITIAL_CANDIDATES);
        setLocalStorageData(LOCAL_STORAGE_CERTS_KEY, [data.certificate, ...localCerts]);
        setLocalStorageData(LOCAL_STORAGE_CANDIDATES_KEY, [data.candidate, ...localCandidates]);
        return { candidate: data.candidate, certificate: data.certificate };
      }
    }
  } catch (e) {
    console.warn('API route call /api/certificates/generate failed, executing client fallback:', e);
  }

  // 1. Create candidate
  const newCandidate = await createCandidate(candidateData);

  // 2. Generate certificate with detailed fields
  const cert = await createCertificate(newCandidate.id, courseId, issueDate, expiryDate, customCertDetails);

  return { candidate: newCandidate, certificate: cert };
}
