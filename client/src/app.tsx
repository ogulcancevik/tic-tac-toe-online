import { useState } from "react";
import { Board } from "@/components/board";
import { Lobby } from "@/components/lobby";

export const App = () => {
  const [gameState, setGameState] = useState<{
    role: "X" | "O";
    roomId: string;
    player1: string;
    player2: string;
  } | null>(null);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-950 p-2 sm:p-4 font-sans text-zinc-100">
      {gameState ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center space-y-6 sm:flex-initial">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Tic Tac Toe
          </h1>
          <Board
            role={gameState.role}
            roomId={gameState.roomId}
            player1={gameState.player1}
            player2={gameState.player2}
          />
        </div>
      ) : (
        <Lobby
          onGameStart={(role, roomId, p1, p2) =>
            setGameState({ role, roomId, player1: p1, player2: p2 })
          }
        />
      )}
    </div>
  );
};
