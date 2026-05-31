import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Join = () => {
  const [searchParams] = useSearchParams();
  const initialRoomId = searchParams.get("room") || "";
  
  const [roomId, setRoomId] = useState(initialRoomId);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("game_started", (data) => {
      navigate("/game", {
        state: {
          role: socket.id === data.playerX_id ? "X" : "O",
          roomId: data.room,
          player1: data.playerX,
          player2: data.playerO,
        },
      });
    });
    return () => {
      socket.off("game_started");
    };
  }, [navigate]);

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) return setError("Please enter username and room code.");
    setLoading(true);
    socket.emit("join_room", { roomId: roomId.toUpperCase(), username }, (response: any) => {
      setLoading(false);
      if (!response.success) {
        setError(response.message);
      }
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-3xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800 relative">
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-zinc-500 hover:text-zinc-300 transition-colors font-medium text-sm"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-zinc-100 mt-4">Join Room</h1>
      {error && <p className="text-rose-500 font-medium">{error}</p>}

      <div className="flex w-full flex-col space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Room Code</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono font-bold tracking-widest uppercase"
            placeholder="e.g., A1B2C3"
            maxLength={6}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Your Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g., Player2"
          />
        </div>

        <button
          onClick={handleJoinRoom}
          disabled={loading}
          className="rounded-xl bg-indigo-600 p-3 font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all mt-2"
        >
          {loading ? "Connecting..." : "Join Room"}
        </button>
      </div>
    </div>
  );
};
