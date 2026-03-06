-- Create the affiliates table
CREATE TABLE IF NOT EXISTS afiliados (
    dni TEXT PRIMARY KEY,
    nombre_apellido TEXT NOT NULL,
    nombre_padre TEXT,
    nombre_mother TEXT, -- Fixed later to nombre_madre as per request
    domicilio TEXT,
    localidad TEXT,
    dni_frente_url TEXT,
    dni_dorso_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Note: The user requested 'nombre_madre', so I'll use that.
ALTER TABLE afiliados RENAME COLUMN nombre_mother TO nombre_madre;

-- Enable RLS
ALTER TABLE afiliados ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to insert their own data
CREATE POLICY "Users can insert their own data" ON afiliados
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read all data (as they are admins/officer workers)
CREATE POLICY "Users can read all data" ON afiliados
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update all data
CREATE POLICY "Users can update all data" ON afiliados
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Storage Bucket Policies (Run this in the SQL Editor)
-- Note: You must first create the bucket 'documentos_dni' in the Storage UI as "Public"

-- Allow public access to read the files (since the bucket is public)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'documentos_dni');

-- Allow authenticated users to upload files
CREATE POLICY "Auth Users Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documentos_dni' AND 
    auth.role() = 'authenticated'
  );
