# Real-Time Multiplayer Tic Tac Toe 🎮

A modern, highly-responsive, real-time multiplayer Tic Tac Toe game built with React, Node.js, and Socket.IO. Play with your friends instantly by creating private rooms and sharing invite links!

## ✨ Features

- **Real-Time Gameplay**: Instant, lag-free moves synchronized across clients powered by Socket.IO.
- **Private Rooms**: Create custom private rooms with 6-character unique invite codes. Maximum 2 players per room.
- **Invite Links**: Easily invite friends using auto-generated URL links. Clicking the link auto-fills the room code.
- **Robust Connection Handling**: "Ghost State" protection handles unexpected disconnections, tab closures, and browser navigation (Back/Forward) flawlessly without breaking the server state.
- **Responsive Design**: Beautiful, mobile-first native-like UI utilizing Tailwind CSS v4. Fits perfectly on phones, tablets, and desktops.
- **Modern Stack**: Fully typed with TypeScript on both the Client and Server.

## 🚀 Tech Stack

**Frontend:**
- [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Socket.IO Client](https://socket.io/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/) (Ultra-fast Linter & Formatter)

## 📦 Installation & Setup

1. **Install Dependencies**
   Run the following command in the root directory. It will install the dependencies for both the frontend and the backend automatically.
   ```bash
   npm install
   ```

2. **Start the Development Server**
   Start both the backend server and the frontend client simultaneously using concurrently:
   ```bash
   npm run dev
   ```
   - The React client will be available at: `http://localhost:5173`
   - The Socket.IO server will run silently on: `http://localhost:7070`

## 🎮 How to Play

1. Open `http://localhost:5173` in your browser.
2. Click **"Create a Room"**, enter your desired username, and click Create.
3. Copy the **Invite Link** or the **Room Code** and share it with a friend.
4. Your friend opens the link (or clicks **"Join a Room"** and pastes the code), enters their username, and joins.
5. The game starts immediately!

## 🛠 Project Structure

```text
.
├── backend/                # Node.js + Socket.IO Server
│   ├── src/
│   │   ├── index.ts        # Express server initialization
│   │   └── socket.ts       # Core Socket.IO events and memory management
│   ├── package.json
│   └── biome.json          # Biome Linter configuration
│
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── pages/          # React Router Pages (Home, Create, Join, Game)
│   │   ├── components/     # UI components (e.g., Board)
│   │   ├── lib/            # Game logic and Socket.IO singleton instance
│   │   └── app.tsx         # Main entry and Router configuration
│   └── package.json
│
└── package.json            # Root configuration for concurrent execution
```

## 🧹 Code Quality

To format and lint the backend code using Biome:
```bash
cd backend
npm run lint    # Check for linting errors
npm run format  # Auto-format code
```
