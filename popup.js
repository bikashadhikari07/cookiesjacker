document.getElementById("showCookies").addEventListener("click", function () {
  updateDisplayedCookies();
});

document.getElementById("sendtoserver").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.cookies.getAll({ url: tabs[0].url }, function (cookies) {
      const formattedCookies = cookies
        .map((cookie) => {
          return `${cookie.name}: ${cookie.value}`;
        })
        .join("\n");

      sendMessageToServer(formattedCookies);
    });
  });
});

function updateDisplayedCookies() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.cookies.getAll({ url: tabs[0].url }, function (cookies) {
      const formattedCookies = cookies
        .map((cookie) => {
          return `${cookie.name}: ${cookie.value}`;
        })
        .join("<br>");

      document.getElementById("cookieDisplay").innerHTML = formattedCookies;
    });
  });
}

function sendMessageToServer(message) {
  fetch("http://localhost:3000/receive-message", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: message,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log("Message sent to server:", data);
      alert("Message sent successfully.");
    })
    .catch((error) => {
      console.error("Error sending message to server:", error);
      alert("Error sending message to server.");
    });
}
