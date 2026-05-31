import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-8 rounded-3xl bg-zinc-900 p-8 shadow-2xl border border-zinc-800">
      <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        Tic Tac Toe
      </h1>
      
      <div className="flex w-full flex-col space-y-4">
        <button
          onClick={() => navigate("/create")}
          className="rounded-xl bg-indigo-600 p-4 font-bold text-white hover:bg-indigo-500 active:scale-95 transition-all text-lg shadow-lg"
        >
          Create a Room
        </button>
        
        <button
          onClick={() => navigate("/join")}
          className="rounded-xl bg-zinc-800 p-4 font-bold text-zinc-300 hover:bg-zinc-700 active:scale-95 transition-all text-lg border border-zinc-700 hover:border-zinc-500"
        >
          Join a Room
        </button>
      </div>
    </div>
  );
};
