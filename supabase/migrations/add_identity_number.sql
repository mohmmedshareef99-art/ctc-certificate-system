-- Migration: Add identity_number column to candidates table and create auto-generation trigger
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS identity_number VARCHAR(20) UNIQUE;

-- Create helper function to generate a unique 9-digit identity number for new candidates
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

-- Trigger to execute before insert on candidates
DROP TRIGGER IF EXISTS set_candidate_identity_number ON public.candidates;
CREATE TRIGGER set_candidate_identity_number
BEFORE INSERT ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION generate_9_digit_identity();

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
