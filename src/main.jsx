import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home";
import Project from "./pages/Project";
import NotFound from "./pages/NotFound";
import ProjectIndex from './pages/ProjectIndex';
import "./styles/after-hours/workshop.css";
import "./styles/after-hours/living.css";
import "./styles/after-hours/object-surfaces.css";
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/projects", element: <ProjectIndex /> },
      { path: "/projects/:slug", element: <Project /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
