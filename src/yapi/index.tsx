import React from "react";
import ReactDOM from "react-dom/client";
import YapiContent from "./content";

document.addEventListener("DOMContentLoaded", function (e) {
  const currentUrl = window.location.href;
  const regex = /^https?:\/\/.*\/project\/[^/]+\/interface\/api\//;
  if (regex.test(currentUrl)) {
    const container = document.createElement("div");
    container.id = "web-effi-chrome-container";
    // 将 div 插入到页面中指定的位置
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <YapiContent />
      </React.StrictMode>
    );
  }
});
