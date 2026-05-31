import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Board } from "@/components/board";

export const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { role: "X"|"O", roomId: string, player1: string, player2: string } | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-6 sm:flex-initial">
      <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
        Tic Tac Toe
      </h1>
      <Board
        role={state.role}
        roomId={state.roomId}
        player1={state.player1}
        player2={state.player2}
        onReturnToMenu={() => navigate("/")}
      />
    </div>
  );
};
