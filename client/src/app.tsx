import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Create } from "./pages/Create";
import { Join } from "./pages/Join";
import { Game } from "./pages/Game";

export const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-950 p-2 sm:p-4 font-sans text-zinc-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/join" element={<Join />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
