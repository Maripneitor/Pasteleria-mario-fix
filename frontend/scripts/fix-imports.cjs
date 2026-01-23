const fs = require('fs');
const path = require('path');
// glob removed


// The user listed specific files to fix, but also said "Use imports update script".
// I'll stick to the user's script structure but make it robust.
// Replicating user's provided script EXACTLY as requested mainly, but adding recursion if needed?
// User said: "Ejecutar en archivos clave".

const importMappings = {
    // Componentes UI
    './ui/ActionCard': '../components/ui/ActionCard',
    './ui/ConfirmationCard': '../components/ui/ConfirmationCard',
    './ui/DesktopSidebar': '../components/layout/DesktopSidebar',
    './ui/Loader': '../components/ui/Loader',
    './ui/LoginForm': '../components/forms/LoginForm',
    './ui/MobileNav': '../components/layout/MobileNav',
    './ui/NotificationCard': '../components/ui/NotificationCard',
    './ui/ProductionStepper': '../components/features/production/ProductionStepper',
    './ui/RadioMenu': '../components/ui/RadioMenu',
    './ui/Switch': '../components/ui/Switch',
    './ui/ThemeToggle': '../components/ui/ThemeToggle',
    './ui/TorchToggle': '../components/ui/TorchToggle',

    // Componentes de layout
    './layout/DashboardLayout': '../components/layout/DashboardLayout',
    './layout/PageTransition': '../components/layout/PageTransition',

    // Componentes de features
    './FolioCard': '../components/features/folios/FolioCard',
    './FolioManager': '../components/features/folios/FolioManager',
    './KanbanBoard': '../components/features/production/KanbanBoard',
    './BakerRanking': '../components/features/dashboard/BakerRanking',

    // Contextos
    './context/AuthContext': '../contexts/AuthContext',
    './context/ThemeContext': '../contexts/ThemeContext',

    // Servicios
    './services/api': '../services/api/client',
    './services/folioService': '../services/api/folios',

    // Utils
    './utils/constants': '../utils/constants',
    './utils/folioSanitizer': '../utils/formatters',
};

function fixImports(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping missing file: ${filePath}`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    Object.entries(importMappings).forEach(([oldPath, newPath]) => {
        // Escape dots in oldPath for regex
        const escapedOldPath = oldPath.replace(/\./g, '\\.');
        // Match "from '...'" or 'from "..."'
        const regex = new RegExp(`from ['"]${escapedOldPath}['"]`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `from '${newPath}'`);
            changed = true;
        }

        // Also handle dynamic imports import(...)
        const regexDynamic = new RegExp(`import\\(['"]${escapedOldPath}['"]\\)`, 'g');
        if (regexDynamic.test(content)) {
            content = content.replace(regexDynamic, `import('${newPath}')`);
            changed = true;
        }
    });

    // Additional fix for .jsx extensions if needed, but user script didn't mention it.

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Fixed imports in: ${filePath}`);
    }
}

// Recursively find all jsx/js files in src
// Native node fs.readdir recursive is available in Node 20+, but I should be safe.
function getFiles(dir) {
    const subdirs = fs.readdirSync(dir);
    const files = subdirs.map((subdir) => {
        const res = path.resolve(dir, subdir);
        return (fs.statSync(res).isDirectory()) ? getFiles(res) : res;
    });
    return files.reduce((a, f) => a.concat(f), []);
}

const allFiles = getFiles('src').filter(f => f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.tsx') || f.endsWith('.ts'));

allFiles.forEach(fixImports);
