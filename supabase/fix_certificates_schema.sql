-- ====================================================================
-- Continental Training Center S.A. (CTC Panama)
-- Migration Script: Fix Certificates Schema & Reload Schema Cache
-- ====================================================================

-- 1. Idempotently add all extended certificate columns
ALTER TABLE public.certificates 
  ADD COLUMN IF NOT EXISTS salutation VARCHAR(20) DEFAULT 'Mr.',
  ADD COLUMN IF NOT EXISTS stcw_regulation TEXT DEFAULT 'Regulation III/5, Section A-III/5, Table III/5 of the IMO International Convention on Standards of Training, Certification and Watchkeeping for Seafarers STCW 1978, as amended',
  ADD COLUMN IF NOT EXISTS resolution_number VARCHAR(100) DEFAULT 'DGGM-CFM-005-2025',
  ADD COLUMN IF NOT EXISTS resolution_date DATE DEFAULT '2024-02-06',
  ADD COLUMN IF NOT EXISTS resolution_expiry DATE DEFAULT '2026-06-12',
  ADD COLUMN IF NOT EXISTS held_from DATE DEFAULT '2026-03-10',
  ADD COLUMN IF NOT EXISTS held_to DATE DEFAULT '2026-04-10',
  ADD COLUMN IF NOT EXISTS course_mode VARCHAR(50) DEFAULT 'Presential',
  ADD COLUMN IF NOT EXISTS validity_years_text VARCHAR(100) DEFAULT '(THIS CERTIFICATE IS VALID FOR FIVE (5) YEARS)',
  ADD COLUMN IF NOT EXISTS revision_code VARCHAR(50) DEFAULT 'REV. 2/2025',
  ADD COLUMN IF NOT EXISTS numeric_hash VARCHAR(50) DEFAULT '35830462448604';

-- 2. Ensure conducted_at is of type VARCHAR(150) so string locations like 'AZERBAIJAN' or 'PANAMA' work
DO $$ 
BEGIN 
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'certificates' 
      AND column_name = 'conducted_at' 
      AND data_type = 'date'
  ) THEN
    ALTER TABLE public.certificates ALTER COLUMN conducted_at TYPE VARCHAR(150) USING conducted_at::varchar;
  END IF;
END $$;

ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS conducted_at VARCHAR(150) DEFAULT 'AZERBAIJAN';
ALTER TABLE public.certificates ALTER COLUMN conducted_at SET DEFAULT 'AZERBAIJAN';

-- 3. Trigger PostgREST schema cache reload immediately
NOTIFY pgrst, 'reload schema';
