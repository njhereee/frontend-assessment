import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import FilterPage, { loader as filterLoader } from "./FilterPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
const router = createBrowserRouter(
  [{ path: "/", element: <FilterPage />, loader: filterLoader }],
  { basename }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);