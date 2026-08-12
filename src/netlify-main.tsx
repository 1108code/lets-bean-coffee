import React from "react";
import { createRoot } from "react-dom/client";
import CmsPage from "../app/cms/page";
import Home from "../app/page";
import "../app/globals.css";

function NetlifyApp() {
  if (window.location.pathname === "/cms") {
    return <CmsPage />;
  }

  return <Home />;
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NetlifyApp />
  </React.StrictMode>,
);
