#!/bin/bash
# migrate-to-ts.sh

echo "🚀 Iniciando migración a TypeScript..."

# 1. Renombrar archivos .jsx a .tsx en orden de importancia
echo "1. Migrando componentes críticos..."

# Archivos de contexto primero
[ -f "src/contexts/AuthContext.jsx" ] && mv src/contexts/AuthContext.jsx src/contexts/AuthContext.tsx
[ -f "src/contexts/ThemeContext.jsx" ] && mv src/contexts/ThemeContext.jsx src/contexts/ThemeContext.tsx

# Archivos de servicios
[ -f "src/services/api/client.js" ] && mv src/services/api/client.js src/services/api/client.ts
[ -f "src/services/api/folios.js" ] && mv src/services/api/folios.js src/services/api/folios.ts

# Componentes UI básicos
# Check if files exist before moving to avoid errors if already moved or path is slightly different
[ -f "src/components/ui/Button.jsx" ] && mv src/components/ui/Button.jsx src/components/ui/Button.tsx
[ -f "src/components/ui/Input.jsx" ] && mv src/components/ui/Input.jsx src/components/ui/Input.tsx
[ -f "src/components/ui/Card.jsx" ] && mv src/components/ui/Card.jsx src/components/ui/Card.tsx

# 2. Actualizar vite.config.js a .ts (Already done manually by agent, but included for completeness check)
[ -f "vite.config.js" ] && mv vite.config.js vite.config.ts

echo "✅ Migración de nombres completada!"
