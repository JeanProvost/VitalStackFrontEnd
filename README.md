# VitalStack (mobile)

AI-powered supplement optimizer. Expo + React Native frontend for the VitalStack .NET API
(AWS Cognito / JWT auth, PostgreSQL). iOS + Android only.

## Stack

- **Expo SDK 57** (New Architecture) + **TypeScript** (strict)
- **Expo Router** — file-based routing (`src/app`)
- **NativeWind v4** — Tailwind for React Native
- **TanStack Query v5** — server state
- **Zustand** — client/session state
- **react-native-vision-camera** — barcode scanning via the built-in code scanner
- **amazon-cognito-identity-js** + **expo-secure-store** — auth & token storage
- **EAS** — development / preview / production build profiles

## Prerequisites

- Node 20+, **pnpm** (`corepack enable` or `npm i -g pnpm`)
- A **development build** (not Expo Go): vision-camera ships native code.
  Build one with `pnpm dlx eas-cli build --profile development`.

## Setup

```bash
pnpm install
cp .env.example .env   # then fill in the values
```

`.env` (all `EXPO_PUBLIC_*`, inlined at build time):

| Var                                | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| `EXPO_PUBLIC_API_URL`              | Base URL of the .NET API, no trailing slash |
| `EXPO_PUBLIC_COGNITO_USER_POOL_ID` | Cognito user pool id                        |
| `EXPO_PUBLIC_COGNITO_CLIENT_ID`    | Cognito app client id                       |

For local backend development, use `http://localhost:port` from the web or iOS
simulator. A physical device must use the development PC's LAN IPv4 address instead,
for example `http://192.168.1.73:55567`, and must be on the same network. Restart Metro
after changing `.env`.

## Run

```bash
pnpm start          # Metro bundler (open in your dev build)
pnpm ios            # dev build on iOS simulator
pnpm android        # dev build on Android emulator
```

> The **Scan** tab requires the camera and only works in a development build or on a
> physical device — not in Expo Go or the web preview.

## Checks

```bash
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint (eslint-config-expo)
pnpm test           # jest-expo
pnpm format         # prettier --write .
```

## Project structure

```
src/
  app/                 Expo Router routes
    (auth)/            login, signup, forgot-password
    (tabs)/            home, scan, stack, profile
    supplement/[id]    stack-item detail/edit (modal)
    _layout.tsx        providers (QueryClient, theme) + auth route guard
  api/                 typed client (JWT attach + Cognito refresh), endpoint modules, queryClient
  auth/                Cognito wrapper + SecureStore token persistence
  components/          shared UI (Button, Card, Input, Screen, ToastHost)
  features/
    scan/              camera scanner, barcode hook, result sheet, queries
    supplements/       list, card, detail, queries
    dashboard/         home summary
  stores/              Zustand stores (auth session, UI/toasts)
  lib/                 constants (env), utils (cn, GTIN-14 normalizer)
  types/               shared DTOs
  constants/           design tokens
```

## Conventions

- **All API calls go through `src/api/client.ts`** — no raw `fetch` in components.
- Screens compose feature components; components stay small.
- Design tokens live in `tailwind.config.js` (colors/spacing/fontSize), mirrored by
  `src/constants/theme.ts`. Dark mode follows the system preference (`darkMode: 'media'`).
- EAS env per profile in `eas.json`.

## Build (EAS)

```bash
pnpm dlx eas-cli build --profile development    # internal dev client
pnpm dlx eas-cli build --profile preview        # internal QA
pnpm dlx eas-cli build --profile production      # store build
```
