-- =======================================================
-- Script de Limpieza y Corrección de folioType
-- =======================================================

-- 1. Ver qué valores extraños existen actualmente
SELECT folioType, COUNT(*) as cantidad
FROM folios
GROUP BY folioType;

-- 2. Corregir valores 'null' o vacíos a 'Normal'
UPDATE folios 
SET folioType = 'Normal' 
WHERE folioType IS NULL OR folioType = '';

-- 3. Corregir valores en minúscula o variantes
UPDATE folios SET folioType = 'Normal' WHERE folioType = 'normal';
UPDATE folios SET folioType = 'Base/Especial' WHERE folioType = 'base/especial' OR folioType = 'Especial';

-- 4. Verificar que solo queden 'Normal' y 'Base/Especial'
SELECT folioType, COUNT(*) 
FROM folios 
GROUP BY folioType;

-- 5. (OPCIONAL) SOLO DESPUÉS DE LIMPIAR TODO:
-- Puedes volver a activar el ENUM en el código y en la base de datos:
-- ALTER TABLE folios MODIFY COLUMN folioType ENUM('Normal', 'Base/Especial') NOT NULL;
