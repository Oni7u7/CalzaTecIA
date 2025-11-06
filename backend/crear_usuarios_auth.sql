-- Script para crear usuarios usando Supabase Auth
-- Este es el método recomendado para crear usuarios en Supabase
-- Ejecuta este script en el SQL Editor de Supabase después de habilitar Auth

-- Crear usuarios en auth.users usando la función auth.uid()
-- Nota: Esto requiere permisos de administrador en Supabase

-- Usuario Admin
DO $$
DECLARE
  admin_user_id UUID;
  admin_rol_id UUID;
BEGIN
  -- Crear usuario en auth.users (requiere extensión auth)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@calzatec.com',
    crypt('1234', gen_salt('bf')), -- Hash bcrypt de la contraseña
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Administrador del Sistema"}',
    false,
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- Obtener rol_id de administrador
  SELECT id INTO admin_rol_id FROM roles WHERE nombre = 'administrador';

  -- Insertar en tabla usuarios
  INSERT INTO usuarios (id, nombre, email, password_hash, rol_id, activo, fecha_ingreso)
  VALUES (
    admin_user_id,
    'Administrador del Sistema',
    'admin@calzatec.com',
    crypt('1234', gen_salt('bf')),
    admin_rol_id,
    true,
    NOW()
  )
  ON CONFLICT (email) DO UPDATE
  SET nombre = EXCLUDED.nombre,
      rol_id = EXCLUDED.rol_id,
      activo = EXCLUDED.activo;
END $$;

-- Repetir para vendedor y cliente de manera similar
-- (Por simplicidad, usa el método directo en insertar_usuarios.sql)


