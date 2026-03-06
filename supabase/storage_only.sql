-- Solo las políticas para el Storage (Ejecuta esto si ya creaste la tabla)
-- Asegúrate de haber creado el bucket 'documentos_dni' como "Public" manualmente.

-- 1. Permitir que cualquiera pueda ver las fotos (Lectura pública)
CREATE POLICY "Acceso Publico Lectura" ON storage.objects
  FOR SELECT USING (bucket_id = 'documentos_dni');

-- 2. Permitir que usuarios autenticados suban fotos (Escritura)
CREATE POLICY "Usuarios Autenticados Suben Fotos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documentos_dni' AND 
    auth.role() = 'authenticated'
  );
