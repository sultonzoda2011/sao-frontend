# SAO Messenger — Frontend

React 19 + Vite + TypeScript. Mobile-first "Liquid Glass" UI (iOS-style translucent panels), talks to the [sao-backend](../sao-backend) API + WebSocket.

## Stack
- React 19, React Router 7, Vite
- Tailwind CSS v4 (custom "Liquid Glass" theme — see `src/index.css`)
- Radix UI primitives (hand-wired shadcn-style components in `src/components/ui`)
- Zustand — auth session (access token only, stored in localStorage)
- TanStack Query — data fetching/caching
- socket.io-client — realtime chat

## Setup

```bash
npm install
cp .env.example .env
# point VITE_API_URL / VITE_WS_URL at your backend

npm run dev
```

Open `http://localhost:5173`. Make sure `sao-backend` is running (default `http://localhost:3000`).

## Structure

```
src/
  components/
    ui/         shadcn-style primitives (button, input, avatar, dialog, dropdown-menu…)
    layout/     app shell, bottom nav, auth layout, protected routes
    chat/       chat list item, message bubble, typing indicator
    profile/    avatar uploader, edit-profile / change-password dialogs
  hooks/
    use-socket-lifecycle.ts   connects socket on login, tracks online/offline presence
    use-chat-room-socket.ts   joins a chat room, wires message/typing events into query cache
  lib/          axios client, per-domain API modules, socket singleton, utils
  pages/        login, register, chats list, chat room, search, profile
  store/        zustand auth store
  types/        shared types mirroring backend DTOs
```

## Screens
- **Login / Register** — glass card over an ambient gradient background.
- **Chats** (bottom tab) — list of 1v1 chats, last message preview, unread dot, read receipts.
- **Search** (bottom tab) — debounced user search, recent search history (view/delete), tap a result to start/open a chat.
- **Chat room** — realtime messages over the socket, typing indicator, edit/delete own messages (tap a message bubble), online/last-seen status in the header.
- **Profile** (bottom tab) — avatar upload (goes straight to the backend's Cloudinary endpoint), edit display name/username/bio, change password, logout.

## Auth
Only an access token is used (no refresh token, matching the backend). It's stored in `localStorage` and attached as `Authorization: Bearer <token>` on every request and on the socket handshake (`auth: { token }`). When it expires, API calls return 401 and the app clears the session, redirecting to `/login`.

## Realtime events consumed
`message:new`, `message:update`, `message:delete`, `chat:read`, `typing:start`, `typing:stop`, `user:online`, `user:offline` — see `src/hooks/use-chat-room-socket.ts` and `use-socket-lifecycle.ts`.
