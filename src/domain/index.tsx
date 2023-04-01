import React from 'react';
import ReactDOM from "react-dom/client";
import Domain from "./domain";

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <Domain />
  </React.StrictMode>
);
