// =========================================
// PhotoKeeper Analytics Tracker
// =========================================

const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwJxTuFROv8A2dVwf8Qw30naHyGqIGCOEKktAB_dfCJBY7oTACbzd0dNv0HYFiq3yzS7w/exec";


// =========================================
// Visitor ID
// =========================================

let visitorId =
  localStorage.getItem("visitorId");

if (!visitorId) {

  visitorId =
    "VIS-" +
    crypto.randomUUID();

  localStorage.setItem(
    "visitorId",
    visitorId
  );
}


// =========================================
// Session ID
// =========================================

let sessionId =
  sessionStorage.getItem(
    "sessionId"
  );

if (!sessionId) {

  sessionId =
    "SID-" +
    Date.now();

  sessionStorage.setItem(
    "sessionId",
    sessionId
  );
}


// =========================================
// Browser Detection
// =========================================

function getBrowser() {

  const ua =
    navigator.userAgent;

  if (
    ua.includes("Edg")
  ) return "Edge";

  if (
    ua.includes("Chrome")
  ) return "Chrome";

  if (
    ua.includes("Firefox")
  ) return "Firefox";

  if (
    ua.includes("Safari")
  ) return "Safari";

  return "Unknown";
}


// =========================================
// OS Detection
// =========================================

function getOS() {

  const ua =
    navigator.userAgent;

  if (
    ua.includes("Windows")
  ) return "Windows";

  if (
    ua.includes("Android")
  ) return "Android";

  if (
    ua.includes("iPhone")
  ) return "iPhone";

  if (
    ua.includes("Mac")
  ) return "macOS";

  if (
    ua.includes("Linux")
  ) return "Linux";

  return "Unknown";
}


// =========================================
// Device Type
// =========================================

function getDevice() {

  if (
    /tablet|ipad/i.test(
      navigator.userAgent
    )
  ) {
    return "Tablet";
  }

  if (
    /mobile|android|iphone/i.test(
      navigator.userAgent
    )
  ) {
    return "Mobile";
  }

  return "Desktop";
}


// =========================================
// Location Cache
// =========================================

let geoData = {

  country: "",
  region: "",
  city: ""

};

async function loadLocation() {

  try {

    const response =
      await fetch(
        "https://ipapi.co/json/"
      );

    const data =
      await response.json();

    geoData.country =
      data.country_name || "";

    geoData.region =
      data.region || "";

    geoData.city =
      data.city || "";

  }

  catch (err) {

    console.log(
      "Location lookup failed"
    );

  }

}

loadLocation();


// =========================================
// Send Data To Google Sheet
// =========================================

function logEvent(
  action,
  extraData = ""
) {

  fetch(
    WEBAPP_URL,
    {

      method: "POST",

      mode: "no-cors",

      headers: {

        "Content-Type":
          "application/json"

      },

      body: JSON.stringify({

        timestamp:
          new Date()
            .toISOString(),

        visitorId:
          visitorId,

        sessionId:
          sessionId,

        country:
          geoData.country,

        region:
          geoData.region,

        city:
          geoData.city,

        timezone:
          Intl
            .DateTimeFormat()
            .resolvedOptions()
            .timeZone,

        browser:
          getBrowser(),

        os:
          getOS(),

        device:
          getDevice(),

        screenWidth:
          screen.width,

        screenHeight:
          screen.height,

        language:
          navigator.language,

        pageUrl:
          window.location.href,

        referrer:
          document.referrer,

        action:
          action,

        extraData:
          extraData,

        userAgent:
          navigator.userAgent,

        networkType:
          navigator.connection
            ?.effectiveType ||
          "Unknown",

        onlineStatus:
          navigator.onLine
            ? "Online"
            : "Offline",

        pixelRatio:
          window.devicePixelRatio

      })

    }

  );

}


// =========================================
// Page Visit
// =========================================

window.addEventListener(
  "load",

  function () {

    logEvent(
      "Page Visit"
    );

  }
);


// =========================================
// Button / Link Click Tracking
// =========================================

document.addEventListener(
  "click",

  function (e) {

    let clicked =

      e.target.innerText ||

      e.target.id ||

      e.target.name ||

      e.target.tagName;

    clicked =
      String(clicked)
        .trim()
        .substring(0, 100);

    logEvent(
      "Click",
      clicked
    );

  }
);


// =========================================
// Right Click Tracking
// =========================================

document.addEventListener(
  "contextmenu",

  function () {

    logEvent(
      "Right Click"
    );

  }
);


// =========================================
// Copy Tracking
// =========================================

document.addEventListener(
  "copy",

  function () {

    logEvent(
      "Copy"
    );

  }
);


// =========================================
// Paste Tracking
// =========================================

document.addEventListener(
  "paste",

  function () {

    logEvent(
      "Paste"
    );

  }
);


// =========================================
// Form Submission Tracking
// =========================================

document.addEventListener(
  "submit",

  function (e) {

    let formName =

      e.target.id ||

      e.target.name ||

      "Unknown Form";

    logEvent(
      "Form Submit",
      formName
    );

  }
);


// =========================================
// Scroll Tracking
// =========================================

let lastScrollMark = 0;

window.addEventListener(
  "scroll",

  function () {

    const maxScroll =

      document.documentElement
        .scrollHeight -

      window.innerHeight;

    if (
      maxScroll <= 0
    ) return;

    const percent =

      Math.round(

        (
          window.scrollY /
          maxScroll
        ) * 100

      );

    if (
      percent >=
      lastScrollMark + 25
    ) {

      lastScrollMark =
        percent;

      logEvent(
        "Scroll",
        percent + "%"
      );

    }

  }
);


// =========================================
// Page Exit Tracking
// =========================================

window.addEventListener(
  "beforeunload",

  function () {

    logEvent(
      "Page Exit"
    );

  }
);


// =========================================
// Session Duration Tracking
// =========================================

const sessionStart =
  Date.now();

setInterval(

  function () {

    const seconds =

      Math.floor(

        (
          Date.now() -
          sessionStart
        ) / 1000

      );

    logEvent(
      "Session Duration",
      seconds + " seconds"
    );

  },

  60000

);


// =========================================
// Online / Offline Tracking
// =========================================

window.addEventListener(
  "online",

  function () {

    logEvent(
      "Connection",
      "Online"
    );

  }
);

window.addEventListener(
  "offline",

  function () {

    logEvent(
      "Connection",
      "Offline"
    );

  }
);


// =========================================
// Initial Startup Event
// =========================================

logEvent(
  "Tracker Started"
);
