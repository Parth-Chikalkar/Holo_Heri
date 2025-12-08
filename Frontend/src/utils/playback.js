// src/utils/playback.js

export async function sendPlayCommand(siteId) {
  try {
    await fetch("/api/control/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
  } catch (err) {
    console.error("Failed to send play command:", err);
  }
}
