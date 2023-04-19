chrome.storage.onChanged.addListener(function (changes) {
  // 需要同步的domain发生变化
  if (changes?.domain) {
    chrome.storage.local.get("domain", function (data) {
      const domains = data.domain; // 获取字符串数组
      const domainString = domains.join(";"); // 将字符串数组连接成一个以分号分隔的字符串
      getAllCookiesForDomain(domainString || "codemao.cn");
    });
  }
});

function getAllCookiesForDomain(domain) {
  chrome.cookies.getAll({ domain }, function (cookies) {
    if (cookies) {
      // 同步到localhost
      for (let i = 0; i < cookies.length; i++) {
        chrome.cookies.set({
          url: "http://localhost",
          domain: "localhost",
          name: "Cookie",
          path: "/",
          value: cookies[i].name + "=" + cookies[i].value,
        });
      }
    }
  });
}

chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("domain.html") });
});
