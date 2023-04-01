chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    chrome.storage.local.get("domain", function (data) {
      const domains = data.domain; // 获取字符串数组
      const domainString = domains.join(";"); // 将字符串数组连接成一个以分号分隔的字符串
      getAllCookiesForDomain(details, domainString || "codemao.cn");
    });
  },
  { urls: ["http://localhost/*"], types: ["xmlhttprequest"] },
  ["blocking", "requestHeaders"]
);
function getAllCookiesForDomain(details, domain) {
  chrome.cookies.getAll({ domain }, function (cookies) {
    if (cookies) {
      var headers = details.requestHeaders;
      for (var i = 0; i < cookies.length; i++) {
        headers.push({
          name: "Cookie",
          value: cookies[i].name + "=" + cookies[i].value,
        });
      }
      return { requestHeaders: headers };
    }
  });
}

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("domain.html") });
});
