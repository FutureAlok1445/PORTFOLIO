/**
 * Indian Standard Time (IST) utility
 * Calculates live time in Asia/Kolkata timezone with day/night phases.
 */

export function getISTSnapshot() {
  const now = new Date();
  
  // Format options for Asia/Kolkata time
  const istFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const hourFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hourCycle: "h23",
  });

  const shortClock = istFormatter.format(now) + " IST";
  const hour = parseInt(hourFormatter.format(now), 10);

  let phase = "Daylight";
  if (hour >= 23 || hour < 5) {
    phase = "Deep Night";
  } else if (hour >= 5 && hour < 7) {
    phase = "Dawn Twilight";
  } else if (hour >= 7 && hour < 12) {
    phase = "Morning Focus";
  } else if (hour >= 12 && hour < 17) {
    phase = "Afternoon Studio";
  } else if (hour >= 17 && hour < 20) {
    phase = "Golden Hour";
  } else {
    phase = "After Hours";
  }

  const isDay = hour >= 6 && hour < 18;

  return {
    shortClock,
    phase,
    hour,
    isDay,
    timestamp: now.getTime(),
  };
}
