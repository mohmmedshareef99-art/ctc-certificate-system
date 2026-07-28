-- ====================================================================
-- Table 4: ADMIN USERS (Admin Portal Authentication)
-- Continental Training Center S.A.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup on login
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow read policy for auth validation
CREATE POLICY "Public Read Access for Admin Login" 
    ON public.admin_users FOR SELECT 
    USING (true);

-- Insert Default Admin User if not already existing
INSERT INTO public.admin_users (email, password_hash, full_name, role)
VALUES ('admin@ctc.com.pa', 'admin123', 'Administrador General CTC', 'superadmin')
ON CONFLICT (email) DO NOTHING;
