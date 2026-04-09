import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerAllMenPerfumeImages } from "./lib/men-perfume-images";
import { registerAllWomenPerfumeImages } from "./lib/women-perfume-images";

registerAllMenPerfumeImages();
registerAllWomenPerfumeImages();

createRoot(document.getElementById("root")!).render(<App />);
