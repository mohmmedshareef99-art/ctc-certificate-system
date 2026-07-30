-- Migration: Upgrade candidates table to support full Maritime Seafarer profiles
ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS identity_number VARCHAR(100) UNIQUE,
  ADD COLUMN IF NOT EXISTS rank_position VARCHAR(150),
  ADD COLUMN IF NOT EXISTS nationality VARCHAR(100),
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS place_of_birth VARCHAR(150),
  ADD COLUMN IF NOT EXISTS seaman_book_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255);

-- Create index for Seaman's Book Number (CDC) lookups
CREATE INDEX IF NOT EXISTS idx_candidates_seaman_book_number 
  ON public.candidates(seaman_book_number);

-- Create index for Identity Number lookups
CREATE INDEX IF NOT EXISTS idx_candidates_identity_number 
  ON public.candidates(identity_number);

-- Helper trigger for auto-generating identity_number if missing
CREATE OR REPLACE FUNCTION generate_9_digit_identity()
RETURNS TRIGGER AS $$
DECLARE
    new_identity VARCHAR(20);
    exists_count INT;
BEGIN
    IF NEW.identity_number IS NULL OR NEW.identity_number = '' THEN
        LOOP
            new_identity := floor(100000000 + random() * 900000000)::text;
            SELECT COUNT(*) INTO exists_count FROM public.candidates WHERE identity_number = new_identity;
            EXIT WHEN exists_count = 0;
        END LOOP;
        NEW.identity_number := new_identity;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_candidate_identity_number ON public.candidates;
CREATE TRIGGER set_candidate_identity_number
BEFORE INSERT ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION generate_9_digit_identity();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
