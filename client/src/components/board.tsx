import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { type Player, checkWinner } from "@/lib/game-logic";

interface BoardProps {
  role: "X" | "O";
  roomId: string;
  player1: string;
  player2: string;
  onReturnToMenu: () => void;
}

export const Board = ({ role, roomId, player1, player2, onReturnToMenu }: BoardProps) => {
  const [board, setBoard] = useState<Player[]>(new Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState<boolean>(role === "X");
  const [playerLeft, setPlayerLeft] = useState<boolean>(false);

  useEffect(() => {
    const handleOpponentMoved = (data: { index: number; player: Player }) => {
      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[data.index] = data.player;
        return newBoard;
      });
      setIsMyTurn(true);
    };

    const handlePlayerLeft = () => {
      setPlayerLeft(true);
      setIsMyTurn(false);
    };

    socket.on("opponent_moved", handleOpponentMoved);
    socket.on("player_left", handlePlayerLeft);

    return () => {
      socket.off("opponent_moved", handleOpponentMoved);
      socket.off("player_left", handlePlayerLeft);
    };
  }, []);

  const winData = checkWinner(board);
  const winner = winData?.winner;
  const isDraw = !winner && board.every((cell) => cell !== null);
  const isGameOver = !!winner || isDraw;

  const handleClick = (index: number) => {
    if (board[index] || !isMyTurn || isGameOver || playerLeft) return;

    const newBoard = [...board];
    newBoard[index] = role;
    setBoard(newBoard);
    setIsMyTurn(false);

    socket.emit("make_move", {
      room: roomId,
      index,
      player: role,
    });
  };

  const getDisplayStatus = () => {
    if (playerLeft) return "Game over: Opponent left.";
    if (winner === role) return "Congratulations, You won! 🎉";
    if (winner) return "You lost! 😢";
    if (isDraw) return "It's a draw! 🤝";
    return isMyTurn ? "Your turn!" : "Waiting for opponent's move...";
  };

  const getWinnerClass = () => {
    if (!winner) return "text-zinc-300";
    if (winner === role) return "text-green-400 font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]";
    return "text-red-400 font-bold";
  };

  return (
    <div className="flex w-full max-w-md flex-1 sm:flex-initial flex-col items-center justify-center space-y-6 sm:space-y-8 sm:rounded-3xl bg-zinc-950 sm:bg-zinc-900 p-2 sm:p-8 sm:shadow-2xl sm:border border-zinc-800">
      <div className="w-full flex justify-between items-center bg-zinc-800 rounded-xl p-3 sm:p-4 border border-zinc-700">
        <div className={`flex flex-col items-center ${role === 'X' ? 'text-rose-400 font-bold drop-shadow-[0_0_5px_rgba(251,113,133,0.3)]' : 'text-zinc-500'}`}>
          <span className="text-xs sm:text-sm">Player X</span>
          <span className="text-lg sm:text-xl truncate max-w-20 sm:max-w-24">{player1}</span>
        </div>
        <div className="text-zinc-600 font-black text-xl sm:text-2xl">VS</div>
        <div className={`flex flex-col items-center ${role === 'O' ? 'text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]' : 'text-zinc-500'}`}>
          <span className="text-xs sm:text-sm">Player O</span>
          <span className="text-lg sm:text-xl truncate max-w-20 sm:max-w-24">{player2}</span>
        </div>
      </div>

      <div className="h-8 flex items-center justify-center">
        <p className={`text-lg transition-all duration-300 ${getWinnerClass()}`}>
          {getDisplayStatus()}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 rounded-2xl bg-zinc-800 p-3 sm:p-4 shadow-inner relative w-full">
        {isGameOver && !playerLeft && (
          <div className="absolute inset-0 bg-zinc-900/40 rounded-2xl z-10 backdrop-blur-[1px]" />
        )}

        {board.map((cell, idx) => {
          const isWinningCell = winData?.line.includes(idx);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleClick(idx)}
              disabled={!isMyTurn || cell !== null || isGameOver || playerLeft}
              className={`flex aspect-square w-full relative z-20 items-center justify-center rounded-xl bg-zinc-900 text-5xl sm:text-6xl font-black shadow-md transition-all duration-200 
                ${!isMyTurn || cell || isGameOver || playerLeft
                  ? "cursor-not-allowed opacity-90"
                  : "cursor-pointer hover:bg-zinc-800 hover:shadow-inner active:scale-95"
                } 
                ${isWinningCell ? "animate-pulse scale-105 shadow-xl ring-2 ring-zinc-500" : ""}
                ${cell === "X" ? "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" : cell === "O" ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}
              `}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {(isGameOver || playerLeft) && (
        <button
          onClick={onReturnToMenu}
          className="w-full rounded-xl bg-indigo-600 p-3 font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg"
        >
          Return to Main Menu
        </button>
      )}
    </div>
  );
};
