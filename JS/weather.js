(() => {
  const blocks = Array.from(document.querySelectorAll("[data-weather]"));
  if (!blocks.length) return;

  function codeToText(code) {
    const map = {
      0: "clear",
      1: "mostly clear",
      2: "partly cloudy",
      3: "overcast",
      45: "fog",
      48: "rime fog",
      51: "light drizzle",
      53: "drizzle",
      55: "heavy drizzle",
      61: "light rain",
      63: "rain",
      65: "heavy rain",
      66: "freezing rain",
      67: "heavy freezing rain",
      71: "light snow",
      73: "snow",
      75: "heavy snow",
      77: "snow grains",
      80: "rain showers",
      81: "heavy showers",
      82: "violent showers",
      85: "snow showers",
      86: "heavy snow showers",
      95: "thunderstorm",
      96: "thunder + hail",
      99: "heavy thunder + hail",
    };
    return map[code] || "unknown";
  }

  async function fetchWeather(lat, lon) {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      "&current=temperature_2m,weather_code" +
      "&temperature_unit=fahrenheit" +
      "&timezone=auto";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`weather fetch failed (${res.status})`);
    return res.json();
  }

  function setBlock(block, { tempF, cond, label }) {
    const elTemp = block.querySelector("[data-weather-temp]");
    const elCond = block.querySelector("[data-weather-cond]");
    const elMeta = block.querySelector("[data-weather-meta]");

    if (elTemp)
      elTemp.textContent =
        typeof tempF === "number" ? `${Math.round(tempF)}°` : "--°";
    if (elCond) elCond.textContent = cond || "—";
    if (elMeta) elMeta.textContent = label || "—";
  }

  async function runBlock(block) {
    const lat = block.getAttribute("data-lat");
    const lon = block.getAttribute("data-lon");
    const label = (block.getAttribute("data-label") || "").toLowerCase();

    // basic validation (avoids silent failure)
    if (!lat || !lon) {
      setBlock(block, { tempF: null, cond: "missing coords", label });
      return;
    }

    setBlock(block, { tempF: null, cond: "loading", label });

    try {
      const data = await fetchWeather(lat, lon);
      const tempF = data?.current?.temperature_2m;
      const code = data?.current?.weather_code;

      setBlock(block, {
        tempF,
        cond: codeToText(code),
        label,
      });
    } catch (e) {
      setBlock(block, { tempF: null, cond: "offline", label });
      // If you want to see the actual error:
      // console.error("Weather error:", label, e);
    }
  }

  // Fetch all locations in parallel
  blocks.forEach(runBlock);
})();
