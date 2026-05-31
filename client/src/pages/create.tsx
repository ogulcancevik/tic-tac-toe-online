import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { useNavigate } from "react-router-dom";

export const Create = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
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

  const handleCreateRoom = () => {
    if (!username.trim()) return setError("Please enter a username.");
    setLoading(true);
    socket.emit("create_room", { username }, (response: any) => {
      setLoading(false);
      if (response.success) {
        setCreatedRoomId(response.roomId);
      }
    });
  };

  const inviteLink = createdRoomId ? `${window.location.origin}/join?room=${createdRoomId}` : "";

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-3xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-zinc-500 hover:text-zinc-300 transition-colors font-medium text-sm"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-zinc-100 mt-4">Create Room</h1>
      {error && <p className="text-rose-500 font-medium">{error}</p>}

      {createdRoomId ? (
        <div className="flex w-full flex-col items-center space-y-4 text-center mt-4">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-2" />
          <p className="text-lg font-medium text-zinc-300">Room created!</p>
          <p className="text-sm text-zinc-400">Waiting for your friend to join...</p>

          <div className="w-full rounded-xl bg-zinc-800 p-4 border border-zinc-700 mt-4">
            <p className="text-xs text-zinc-500 mb-2">Invite Link</p>
            <div className="flex items-center space-x-2">
              <input readOnly value={inviteLink} className="w-full bg-transparent text-sm text-zinc-300 outline-none" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  alert("Copied!");
                }}
                className="rounded bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-500 whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 mb-1">Or share this code:</p>
              <p className="font-mono text-xl font-bold tracking-widest text-indigo-400">{createdRoomId}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Your Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g., Player1"
            />
          </div>
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="rounded-xl bg-indigo-600 p-3 font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </div>
      )}
    </div>
  );
};
