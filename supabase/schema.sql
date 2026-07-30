-- ====================================================================
-- Continental Training Center S.A. (CTC Panama - Maritime Training Center)
-- PostgreSQL Database Schema Migration for Supabase
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Certificate Status Enum Type (Idempotent creation)
DO $$ BEGIN
    CREATE TYPE certificate_status AS ENUM ('VALID', 'EXPIRED', 'REVOKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------------------
-- Table 1: CANDIDATES (Seafarers / Trainees)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    passport_id VARCHAR(100) NOT NULL UNIQUE,
    identity_number VARCHAR(100) UNIQUE,
    rank_position VARCHAR(150),
    nationality VARCHAR(100),
    date_of_birth DATE,
    place_of_birth VARCHAR(150),
    seaman_book_number VARCHAR(100),
    gender VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    emergency_contact VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- Table 2: COURSES (STCW Maritime Courses)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'STCW',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- Table 3: CERTIFICATES (Issued Maritime Certification & Verification)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status certificate_status NOT NULL DEFAULT 'VALID',
    verification_hash VARCHAR(255) NOT NULL UNIQUE,
    salutation VARCHAR(20) DEFAULT 'Mr.',
    stcw_regulation TEXT DEFAULT 'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
    resolution_number VARCHAR(100) DEFAULT 'DGGM-CFM-005-2024',
    resolution_date DATE DEFAULT '2024-02-06',
    resolution_expiry DATE DEFAULT '2026-06-12',
    held_from DATE DEFAULT '2026-03-10',
    held_to DATE DEFAULT '2026-04-10',
    course_mode VARCHAR(50) DEFAULT 'Presential',
    conducted_at VARCHAR(150) DEFAULT 'AZERBAIJAN',
    validity_years_text VARCHAR(100) DEFAULT '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
    revision_code VARCHAR(50) DEFAULT 'REV. 2/2024',
    numeric_hash VARCHAR(50) DEFAULT '35830462448604',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- Indexes for Fast Verification & Lookups
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_certificates_verification_hash 
    ON public.certificates(verification_hash);

CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number 
    ON public.certificates(certificate_number);

CREATE INDEX IF NOT EXISTS idx_candidates_passport_id 
    ON public.candidates(passport_id);

-- --------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- --------------------------------------------------------------------
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Public read policies for certificate verification portal
CREATE POLICY "Public Read Access for Certificate Verification" 
    ON public.certificates FOR SELECT 
    USING (true);

CREATE POLICY "Public Read Access for Candidates" 
    ON public.candidates FOR SELECT 
    USING (true);

CREATE POLICY "Public Read Access for Courses" 
    ON public.courses FOR SELECT 
    USING (true);

-- Comments for documentation
COMMENT ON TABLE public.candidates IS 'Stores seafarer personal details and passport numbers';
COMMENT ON TABLE public.courses IS 'Stores STCW maritime course definitions and codes';
COMMENT ON TABLE public.certificates IS 'Stores issued certificates with verification hashes, resolution details, dates, and status';
