const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzAmZ2T4fgnKtuNRvs8u2e4IKCkx2534qwDo-gXRh9vrOxKCAx-muhyNX0kNcb7exvc_Q/exec";

let visitorId = localStorage.getItem("visitorId");

if (!visitorId) {
    visitorId = "VIS-" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("visitorId", visitorId);
}

let sessionId = sessionStorage.getItem("sessionId");

if (!sessionId) {
    sessionId = "SID-" + Date.now();
    sessionStorage.setItem("sessionId", sessionId);
}

async function sendAction(data) {

    fetch(WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            visitorId,
            sessionId,
            ...data
        })
    });
}
