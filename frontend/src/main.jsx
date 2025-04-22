import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Add this line
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
