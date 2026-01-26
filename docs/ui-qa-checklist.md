# QA Checklist (v1.0)
> **Goal**: Validate UI Foundation (PR1) & Form UX (PR3).

## 📱 1. Responsive & Layout (Mobile/Desktop)
| Check | Device | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **menu-mobile** | 📱 Mobile | 1. Open app on <640px.<br>2. Tap hamburger menu. | Menu slides in. Overlay distinct. |
| **drawer-close** | 📱 Mobile | 1. Open menu.<br>2. Click any link (e.g., Pedidos). | Navigation occurs + Menu closes automatically. |
| **sidebar-desktop** | 💻 Desktop | 1. Resize window > 1024px. | Sidebar becomes sticky/fixed. Hamburger hidden. |
| **fab-mobile** | 📱 Mobile | 1. Go to Form (New Folio).<br>2. Scroll down. | AI Button (FAB) visible bottom-right. Does not cover "Guardar". |
| **input-zoom** | 📱 Mobile | 1. Tap an input.<br>2. Type text. | Page does not zoom in (Font size >= 16px). |

## 🌙 2. Dark Mode
| Check | Context | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **theme-toggle** | Global | 1. Click Theme Toggle (sun/moon). | Instant switch. No "flash" of white. Persists on reload. |
| **card-contrast** | Kanban | 1. Switch to Dark Mode.<br>2. View Kanban Columns. | Background is slate-900. Cards distinct (Glass/slate-800). |
| **inputs-dark** | Forms | 1. Dark Mode.<br>2. Focus on an input. | Text is white/gray-200. Border is visible but not blinding white. |
| **toast-dark** | System | 1. Trigger an error (e.g. login fail). | Toast background matches dark theme. Text readable. |

## 🔐 3. Authentication & Security
| Check | Scenario | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **login-401** | Login | 1. Enter `test@test.com` / `wrongpass`.<br>2. Click "Entrar". | **Toast Error** (Red). No system `alert()`. Button resets. |
| **login-fields** | Login | 1. Leave fields empty.<br>2. Click "Entrar". | Browser/HTML validation or visual error state. |
| **redirect-auth** | Routing | 1. Logout.<br>2. Try accessing `/dashboard`. | Redirects immediately to `/login`. |

## ⚠️ 4. Error Handling & Network
| Check | Scenario | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **network-offline**| Global | 1. Open DevTools > Network > **Offline**.<br>2. Try "Guardar" form. | **Toast Warning/Error** ("Sin conexión"). App does not crash. |
| **403-limit** | FolioForm | 1. Use user with Plan Limit reached.<br>2. Save Folio. | **Toast Error**: "Plan Limitado". Action blocked. |
| **image-limit** | FolioForm | 1. Select 6 images in file picker. | **Toast Warning**: "Máximo 5 imágenes". Only 5 added or none. |

## 📝 5. Forms (FolioForm)
| Check | feature | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **double-submit** | UX | 1. Fill form.<br>2. Click "Guardar" TWICE fast. | Second click ignored. Button shows spinner 🔄. |
| **cancel-nav** | UX | 1. Click "Cancelar". | Returns to Folio List/Dashboard immediately. |
| **input-textarea** | UI | 1. Check "Descripción". | Rendered as `textarea` (tall). Type multiple lines. |
| **required-val** | Logic | 1. Clear "Nombre Cliente".<br>2. Save. | Focus jumps to input. Error msg (Toast or inline) appears. |

## 🚫 6. Code Integrity
| Check | Feature | Steps to Reproduce | Expected Result |
| :--- | :--- | :--- | :--- |
| **no-alerts** | Repos | 1. `grep "alert(" src -r` | **0 results** in critical flows (Login/FolioForm). |
