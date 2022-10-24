<template>
  <div
    id="app"
    :class="
      typeof weather.main != 'undefined' && weather.main.temp > 16 ? 'warm' : ''
    "
  >
    <main>
      <div class="header">
        <div>{{ currentTime.hour }}</div>
        <div>
          <img src="./assets/signal.png" />
          <img src="./assets/signal-wifi.png" />
          <img src="./assets/battery.png" />
        </div>
      </div>
      <div class="search-box">
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          v-model="query"
          @keypress="fetchWeather"
        />
      </div>
      <div class="weather-wrap" v-if="weather.main">
        <div class="location-box">
          <div class="location">
            {{ weather.name }}, {{ weather.sys.country }}
          </div>
          <div class="weather">{{ weather.weather[0].description }}</div>
          <div class="temp">{{ Math.round(weather.main.temp) }}°c</div>
        </div>
        <div class="date-temp">
          <div class="date">{{ currentTime.day }}</div>
          <div class="temp-max-min">
            <div class="temp-max">{{ weather.main.temp_max.toFixed(0) }}°c</div>
            <div class="temp-min">{{ weather.main.temp_min.toFixed(0) }}°c</div>
          </div>
        </div>
        <div class="five-days">
          <pre>{{ weatherForecast(coord) }}</pre>
        </div>
        <div class="information">
          <ul>
            <li style="border-top: 1px solid salmon">
              <div>
                <span>SUNRISE</span>
                <strong>{{ timesStamp.sunrise }}</strong>
              </div>
              <div>
                <span>SUNSET</span>
                <strong>{{ timesStamp.sunset }}</strong>
              </div>
            </li>
            <li>
              <div>
                <span>WIND</span>
                <strong>{{ weather.wind.speed }}m/s</strong>
              </div>
              <div>
                <span>FEELS LIKE</span>
                <strong>{{ weather.main.feels_like.toFixed(0) }}°c</strong>
              </div>
              <div>
                <span>HUMIDITY</span>
                <strong>{{ weather.main.humidity }}%</strong>
              </div>
              <div>
                <span>PRESSURE</span>
                <strong>{{ weather.main.pressure }}hPa</strong>
              </div>
              <div>
                <span>VISIBILITY</span>
                <strong>{{ visibilityKm }}</strong>
              </div>
              <div>
                <span>UV INDEX</span>
                <strong>{{ weather.weather[0].icon }}</strong>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { format, fromUnixTime } from "date-fns";

export default {
  name: "app",
  data() {
    return {
      api_key: "b33558d4f7c88ec48792d8f1e0f09c62",
      url_base: "https://api.openweathermap.org/data/2.5/",
      query: "",
      weather: {},
      coord: {},
    };
  },
  computed: {
    currentTime() {
      const date = new Date();
      const hour = format(date, "p").split(" ")[0];
      const day = format(date, "eeee");
      return { hour: hour, day: day };
    },
    visibilityKm() {
      return this.weather.visibility / 1000 + "Km";
    },
    timesStamp() {
      if (typeof this.weather.main != "undefined") {
        const sunrise = fromUnixTime(this.weather.sys.sunrise);
        const sunriseHour = sunrise.toTimeString().slice(0, 5);
        const sunset = fromUnixTime(this.weather.sys.sunset);
        const sunsetHour = sunset.toTimeString().slice(0, 5);
        return { sunrise: sunriseHour, sunset: sunsetHour };
      }
      return null;
    },
    coordLatLon() {
      if (typeof this.weather.main != "undefined") {
        const lon = this.weather.coord.lon;
        const lat = this.weather.coord.lat;
        return { lon: lon, lat: lat };
      }
      return null;
    },
  },
  methods: {
    async fetchWeather(e) {
      if (e.key == "Enter") {
        let response = await fetch(
          `${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}`
        );
        let json = await response.json();
        this.weather = await json;
        this.fiveWeatherForecast();
      }
    },
    async fiveWeatherForecast() {
      if (typeof this.weather.main != "undefined") {
        let response = await fetch(
          `${this.url_base}forecast?lat=${this.coordLatLon.lat}&lon=${this.coordLatLon.lon}&exclude=hourly,daily&units=metric&APPID=${this.api_key}`
        );
        let json = await response.json();
        this.coord = await json;
      }
    },
    weatherForecast(date) {
      if (typeof this.weather.main != "undefined") {
        const items = date.list.map((i) => i.dt_txt);
        for (let item in items) {
          const hourInitial = items[item].split(" ")[1];
          if (hourInitial === "00:00:00") {
            const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const formatDay = new Date(items[item])
            return weekday[formatDay.getDay()];
          }
          return items
        }
        // const dates = date.list.map((i) => i.dt_txt.split(" ")[0]);
        // const removeRepeated = [...new Set(dates)];
        // return removeRepeated;
      }
      return "";
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
}

#app {
  background-image: url("./assets/cold-bg.jpg");
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
  padding: 1rem;
}

#app.warm {
  background-image: url("./assets/warm-bg.jpg");
}

.header {
  display: flex;
  justify-content: space-between;
  color: #fff;
}

.header img {
  padding: 0 0.2rem;
}

main {
  min-height: 100vh;
}

.search-box {
  padding: 1.25rem;
}

.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 1rem;
  color: #313131;
  font-size: 20px;
  border: none;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  transition: 0.4s;
}

.weather-wrap {
  color: #fff;
}

.location-box {
  text-align: center;
}

.location {
  font-size: 2rem;
}

.weather {
  font-size: 1rem;
  text-transform: capitalize;
}

.temp {
  font-size: 6rem;
  font-weight: 100;
  margin-top: 1rem;
}

.date-temp {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  padding: 0.5rem;
}

.temp-max-min {
  display: flex;
}

.temp-max {
  margin-right: 1rem;
}

.information {
  padding: 0.5rem;
  margin-top: 1rem;
}

li {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0.5rem 0;
}

li > div {
  border-bottom: 1px solid salmon;
  display: grid;
  padding: 0.5rem 0;
}

li > div > strong {
  font-size: 1.5rem;
}
</style>