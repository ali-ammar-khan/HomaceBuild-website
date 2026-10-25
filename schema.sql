-- =========================================================================
-- HOMACEBUILD AND REALATORS - POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Version: 1.0.0
-- Compliant with: Supabase PostgreSQL 15+, RLS, Security Definer guards
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'agent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_purpose') THEN
    CREATE TYPE property_purpose AS ENUM ('sale', 'rent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_category') THEN
    CREATE TYPE property_category AS ENUM (
      'residential_plot',
      'house',
      'apartment',
      'commercial_plot',
      'shop',
      'office',
      'plaza'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status') THEN
    CREATE TYPE publication_status AS ENUM ('draft', 'published', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
    CREATE TYPE availability_status AS ENUM ('available', 'under_offer', 'sold', 'rented');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plot_file_status') THEN
    CREATE TYPE plot_file_status AS ENUM (
      'not_applicable',
      'file',
      'allocated',
      'balloted',
      'possession'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
    CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'qualified', 'closed', 'spam');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'area_unit_type') THEN
    CREATE TYPE area_unit_type AS ENUM ('marla', 'kanal', 'sqft', 'sqyd');
  END IF;
END $$;

-- 3. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'agent',
  full_name TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. SECURITY DEFINER HELPER (Prevents RLS Recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id AND is_active = true;
$$;

-- 5. ROLE TAMPER-PROOF TRIGGER
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF public.get_user_role(auth.uid()) <> 'admin' THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_user_roles ON public.profiles;
CREATE TRIGGER trg_protect_user_roles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_escalation();

-- 6. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Staff Member'),
    'agent' -- Default role is always agent; owner is elevated to admin manually or via seed
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT NOT NULL UNIQUE, -- e.g. "HBR-1001"
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Distinct Status Dimensions
  purpose property_purpose NOT NULL,
  category property_category NOT NULL,
  publication_status publication_status NOT NULL DEFAULT 'draft',
  availability_status availability_status NOT NULL DEFAULT 'available',
  plot_file_status plot_file_status NOT NULL DEFAULT 'not_applicable',
  
  -- Price Architecture (Strict zero-price prevention)
  is_price_on_call BOOLEAN NOT NULL DEFAULT false,
  price_pkr BIGINT,
  CONSTRAINT chk_price_integrity CHECK (
    (is_price_on_call = true AND price_pkr IS NULL) OR
    (is_price_on_call = false AND price_pkr IS NOT NULL AND price_pkr > 0)
  ),
  
  -- Area & Measurement Architecture (Database-Calculated & Validated)
  area_value NUMERIC(10, 2) NOT NULL CHECK (area_value > 0),
  area_unit area_unit_type NOT NULL,
  marla_sqft_standard NUMERIC(6, 2) NOT NULL DEFAULT 225.00 CHECK (marla_sqft_standard IN (225.00, 250.00, 272.25)),
  
  -- Immutable Computed Stored Columns
  area_in_marla NUMERIC(12, 4) GENERATED ALWAYS AS (
    CASE area_unit
      WHEN 'marla' THEN area_value
      WHEN 'kanal' THEN area_value * 20.0
      WHEN 'sqft'  THEN area_value / marla_sqft_standard
      WHEN 'sqyd'  THEN (area_value * 9.0) / marla_sqft_standard
    END
  ) STORED,
  
  area_in_sqft NUMERIC(14, 2) GENERATED ALWAYS AS (
    CASE area_unit
      WHEN 'marla' THEN area_value * marla_sqft_standard
      WHEN 'kanal' THEN area_value * 20.0 * marla_sqft_standard
      WHEN 'sqft'  THEN area_value
      WHEN 'sqyd'  THEN area_value * 9.0
    END
  ) STORED,
  
  -- Location Details (Islamabad / Rawalpindi focus)
  city TEXT NOT NULL DEFAULT 'Islamabad',
  area_location TEXT NOT NULL, -- e.g., 'Bahria Town Phase 8', 'DHA Phase 2'
  sector_block TEXT,           -- e.g., 'Sector C', 'Block D'
  
  -- Property Specifications
  bedrooms SMALLINT CHECK (bedrooms >= 0),
  bathrooms SMALLINT CHECK (bathrooms >= 0),
  features TEXT[] DEFAULT '{}',
  
  -- Media
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  
  -- Ownership & Multi-Agent Attribution
  agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'new',
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_properties_public_browse 
  ON public.properties(publication_status, availability_status, purpose, category);
CREATE INDEX IF NOT EXISTS idx_properties_area_marla 
  ON public.properties(area_in_marla);
CREATE INDEX IF NOT EXISTS idx_properties_area_sqft 
  ON public.properties(area_in_sqft);
CREATE INDEX IF NOT EXISTS idx_properties_price 
  ON public.properties(price_pkr) WHERE price_pkr IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_location 
  ON public.properties(city, area_location);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id 
  ON public.inquiries(property_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- === PROFILES POLICIES ===
DROP POLICY IF EXISTS "Public staff profile read" ON public.profiles;
CREATE POLICY "Public staff profile read"
  ON public.profiles FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins manage profiles" ON public.profiles;
CREATE POLICY "Admins manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- === PROPERTIES POLICIES ===
DROP POLICY IF EXISTS "Public read published properties" ON public.properties;
CREATE POLICY "Public read published properties"
  ON public.properties FOR SELECT
  USING (publication_status = 'published');

DROP POLICY IF EXISTS "Admin read all properties" ON public.properties;
CREATE POLICY "Admin read all properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Agents read assigned properties" ON public.properties;
CREATE POLICY "Agents read assigned properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'agent' AND 
    agent_id = auth.uid()
  );

DROP POLICY IF EXISTS "Admin insert properties" ON public.properties;
CREATE POLICY "Admin insert properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Agents insert own properties" ON public.properties;
CREATE POLICY "Agents insert own properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_user_role(auth.uid()) = 'agent' AND 
    agent_id = auth.uid()
  );

DROP POLICY IF EXISTS "Admin update properties" ON public.properties;
CREATE POLICY "Admin update properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin')
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Agents update assigned properties" ON public.properties;
CREATE POLICY "Agents update assigned properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'agent' AND 
    agent_id = auth.uid()
  )
  WITH CHECK (
    public.get_user_role(auth.uid()) = 'agent' AND 
    agent_id = auth.uid()
  );

DROP POLICY IF EXISTS "Admin delete properties" ON public.properties;
CREATE POLICY "Admin delete properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- === INQUIRIES POLICIES ===
DROP POLICY IF EXISTS "Public submit inquiry" ON public.inquiries;
CREATE POLICY "Public submit inquiry"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage inquiries" ON public.inquiries;
CREATE POLICY "Admin manage inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Agents view assigned property inquiries" ON public.inquiries;
CREATE POLICY "Agents view assigned property inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'agent' AND
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = inquiries.property_id
        AND p.agent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Agents update assigned property inquiries" ON public.inquiries;
CREATE POLICY "Agents update assigned property inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'agent' AND
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = inquiries.property_id
        AND p.agent_id = auth.uid()
    )
  )
  WITH CHECK (
    public.get_user_role(auth.uid()) = 'agent' AND
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = inquiries.property_id
        AND p.agent_id = auth.uid()
    )
  );


-- =========================================================================
-- 9. SUPABASE STORAGE BUCKET & OBJECT RLS POLICIES
-- =========================================================================

-- Create the public property-media storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-media',
  'property-media',
  true,
  5242880, -- 5 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[];

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Allow anyone (anon + authenticated) to view property photos
DROP POLICY IF EXISTS "Public can view property media" ON storage.objects;
CREATE POLICY "Public can view property media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-media');

-- 2. Admin Upload Policy: Only authenticated users with admin role can upload
DROP POLICY IF EXISTS "Admins can upload property media" ON storage.objects;
CREATE POLICY "Admins can upload property media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-media' AND
    public.get_user_role(auth.uid()) = 'admin'
  );

-- 3. Admin Update/Replace Policy
DROP POLICY IF EXISTS "Admins can update property media" ON storage.objects;
CREATE POLICY "Admins can update property media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-media' AND
    public.get_user_role(auth.uid()) = 'admin'
  )
  WITH CHECK (
    bucket_id = 'property-media' AND
    public.get_user_role(auth.uid()) = 'admin'
  );

-- 4. Admin Delete Policy: Only authenticated users with admin role can delete
DROP POLICY IF EXISTS "Admins can delete property media" ON storage.objects;
CREATE POLICY "Admins can delete property media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-media' AND
    public.get_user_role(auth.uid()) = 'admin'
  );
