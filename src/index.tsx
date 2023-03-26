import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

document.addEventListener("DOMContentLoaded", function (e) {
  const container = document.createElement("div");
  container.id = "web-effi-chrome-container";
  // 将 div 插入到页面中指定的位置
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter> */}
      <App />
    </React.StrictMode>
  );
});
