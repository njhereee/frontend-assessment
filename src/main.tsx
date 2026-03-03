import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import FilterPage, { loader as filterLoader } from "./FilterPage";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const router = createBrowserRouter([
  { path: "/", element: <FilterPage />, loader: filterLoader },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);