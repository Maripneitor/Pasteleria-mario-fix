# How to Test

## Overview
We use **Vitest** + **React Testing Library** for unit and smoke testing.
The focus is on verifying that critical views render without crashing (Smoke Tests).

## Running Tests

To run the full suite once:
```bash
npm test
```

To run in watch mode (interactive):
```bash
npx vitest
```

## Structure
- `src/test/setup.js`: Global setup (mocks for DOM, global objects).
- `src/test/utils.jsx`: Custom render function (`renderWithProviders`) that wraps components with all necessary providers (Auth, Query, Theme, etc.).
- `src/pages/__tests__/Smoke.test.jsx`: Critical path smoke tests (Dashboard, Folios, Login).

## Adding New Tests
Use `renderWithProviders` instead of `render` to ensure the component has access to context.

```jsx
import { renderWithProviders } from '../../test/utils';
import MyComponent from '../MyComponent';

test('renders correctly', () => {
  renderWithProviders(<MyComponent />);
  // assertions...
});
```

Mock services using `vi.mock` if they make API calls.
