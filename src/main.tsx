import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerAllMenPerfumeImages } from "./lib/men-perfume-images";

registerAllMenPerfumeImages();

createRoot(document.getElementById("root")!).render(<App />);
