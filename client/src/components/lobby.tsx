import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";

interface LobbyProps {
  onGameStart: (role: "X" | "O", roomId: string, p1: string, p2: string) => void;
}

export const Lobby = ({ onGameStart }: LobbyProps) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const inviteRoomId = urlParams.get("room");

  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  useEffect(() => {
    socket.on("game_started", (data) => {
      onGameStart(
        socket.id === data.playerX_id ? "X" : "O",
        data.room,
        data.playerX,
        data.playerO
      );
    });

    return () => {
      socket.off("game_started");
    };
  }, [onGameStart]);

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

  const handleJoinRoom = () => {
    if (!username.trim()) return setError("Please enter a username.");
    if (!inviteRoomId) return setError("Invalid invite link.");

    setLoading(true);
    socket.emit("join_room", { roomId: inviteRoomId, username }, (response: any) => {
      setLoading(false);
      if (!response.success) {
        setError(response.message);
      }
    });
  };

  const inviteLink = createdRoomId ? `${window.location.origin}?room=${createdRoomId}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-6 rounded-3xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
      <h1 className="text-3xl font-bold text-zinc-100">Tic Tac Toe</h1>

      {error && <p className="text-rose-500 font-medium">{error}</p>}

      {createdRoomId ? (
        <div className="flex w-full flex-col items-center space-y-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-2" />
          <p className="text-lg font-medium text-zinc-300">Room created!</p>
          <p className="text-sm text-zinc-400">Waiting for your friend to join...</p>

          <div className="w-full rounded-xl bg-zinc-800 p-4 border border-zinc-700 mt-4">
            <p className="text-xs text-zinc-500 mb-2">Invite Link (Send to your friend)</p>
            <div className="flex items-center space-x-2">
              <input
                readOnly
                value={inviteLink}
                className="w-full bg-transparent text-sm text-zinc-300 outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="rounded bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-500"
              >
                Copy
              </button>
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

          {inviteRoomId ? (
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className="rounded-xl bg-indigo-600 p-3 font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all"
            >
              {loading ? "Connecting..." : "Join Invited Room"}
            </button>
          ) : (
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="rounded-xl bg-indigo-600 p-3 font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all"
            >
              {loading ? "Creating..." : "Create New Room"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
