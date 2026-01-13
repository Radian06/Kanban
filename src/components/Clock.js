export function createClock({ locale = "ko-KR", mode = "datetime" } = {}) {
  const el = document.createElement("div");
  el.className = "layout-time";

  let timerId = null;

  function format(now) {
    if (mode === "time") {
      return now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    if (mode === "date") {
      return now.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
    }

    // datetime
    const date = now.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
    const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `${date} ${time}`;
  }

  function tick() {
    el.textContent = format(new Date());
  }

  function start() {
    if (timerId !== null) return;
    tick();
    timerId = setInterval(tick, 1000);
  }

  function stop() {
    if (timerId === null) return;
    clearInterval(timerId);
    timerId = null;
  }

  return { el, start, stop };
}
