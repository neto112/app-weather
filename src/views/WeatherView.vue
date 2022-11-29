<template>
  <div class="main">
    <div v-if="loading" class="loading">
      <span></span>
    </div>
    <div v-else class="weather" :class="{ day: isDay, night: isNight }">
      <div class="weather-wrap">
        <CurrentWeather :isDay="isDay" :isNight="isNight" :currentWeather="currentWeather" />
        <HourlyWeather :forecast="forecast" />
        <WeeklyForecast :forecast="forecast" />
        <AdditionalInfo />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import db from "../firebase/firebase";
import AdditionalInfo from "../components/AdditionalInfo.vue"
import CurrentWeather from "../components/CurrentWeather.vue"
import HourlyWeather from "../components/HourlyWeather.vue"
import WeeklyForecast from '../components/WeeklyForecast.vue';
export default {
  name: "WeatherView",
  props: ["APIkey", "isDay", "isNight"],
  components: {
    AdditionalInfo,
    CurrentWeather,
    HourlyWeather,
    WeeklyForecast,
  },
  data() {
    return {
      forecast: null,
      currentWeather: null,
      loading: true,
      currentTime: null,
    };
  },
  created() {
    this.getWeather();
  },
  beforeDetroy() {
    this.$emit("reset")
  },
  methods: {
    getWeather() {
      db.collection("cities")
        .where("city", "==", `${this.$route.params.city}`)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            this.currentWeather = doc.data().currentWeather;
            axios
              .get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${doc.data().currentWeather.coord.lat}&lon=${
                  doc.data().currentWeather.coord.lon
                }&exclude=current,minutley,alerts&units=imperial&appid=${this.APIkey}`
              )
              .then((res) => {
                this.forecast = res.data;
              })
              .then(() => {
                this.loading = false;
                this.getCurrentTime();
              });
          });
        });
    },
    getCurrentTime() {
      const dateObject = new Date();
      this.currentTime = dateObject.getHours();
      const sunrise = new Date(this.currentWeather.sys.sunrise * 1000).getHours();
      const sunset = new Date(this.currentWeather.sys.sunset * 1000).getHours();
      if (this.currentTime > sunrise && this.currentTime < sunset) {
        this.$emit("is-day");
      } else {
        this.$emit("is-night");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.weather {
  transition: 500ms ease;
  overflow: scroll;
  width: 100%;
  height: 100%;
  .weather-wrap {
    overflow: hidden;
    max-width: 1024px;
    margin: 0 auto;
  }
}
</style>