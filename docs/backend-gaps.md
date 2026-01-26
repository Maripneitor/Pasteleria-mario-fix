# Backend Gaps & Mocked Endpoints

This document lists the API endpoints that are currently handled via frontend mocks or require implementation on the backend.

## Status Overview
- **VITE_USE_MOCKS**: If set to `true`, the frontend uses local fixtures (mock data) for ALL below operations.
- **Offline Fallback**: If the backend is unreachable (Network Error), the frontend automatically serves the mock data (Read-only predominantly, writes are simulated in memory/returns success).

## Mocked Endpoints

### Folios (Management)
| Method | Endpoint | Status | Mock Source |
|--------|----------|--------|-------------|
| GET | `/folios` | **Mocked** | `mocks/folios.fixtures.js` |
| GET | `/folios/:id` | **Mocked** | `mocks/folios.fixtures.js` |
| POST | `/folios` | **Simulated** | Returns success + echo data |
| PUT | `/folios/:id` | **Simulated** | Returns success + echo data |
| PATCH | `/folios/:id/status` | **Simulated** | Returns updated status |
| PATCH | `/folios/:id/cancel` | **Simulated** | Returns status 'Cancelado' |
| GET | `/folios/cash-close` | **Mocked** | `mocks/dashboard.fixtures.js` (`mockCashClose`) |

### Dashboard (Analytics)
| Method | Endpoint | Status | Mock Source |
|--------|----------|--------|-------------|
| GET | `/dashboard/owner` | **Mocked** | `mocks/dashboard.fixtures.js` (`mockOwnerMetrics`) |
| GET | `/dashboard/developer` | **Mocked** | `mocks/dashboard.fixtures.js` (`mockDeveloperMetrics`) |

### AI Sessions (Assistant)
| Method | Endpoint | Status | Mock Source |
|--------|----------|--------|-------------|
| GET | `/ai-sessions` | **Mocked** | `mocks/ai-sessions.fixtures.js` (`mockSessionsList`) |
| GET | `/ai-sessions/:id` | **Mocked** | `mocks/ai-sessions.fixtures.js` (`mockSession`) |

## Required Backend Implementation (Gaps)
To fully enable the application without mocks, the backend must implement:
1.  **Dashboard Aggregation**: Endpoints for daily sales summary and owner widgets.
2.  **Cash Closing**: Logic to calculate daily cash cut based on payments received.
3.  **AI History**: Persistence for chat sessions.
