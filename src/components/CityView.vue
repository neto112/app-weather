<template>
  <div class="city">
    <span>{{ this.city.city }}</span>
    <div class="weather">
      <span>{{ temperature }}&deg;</span>
      <img
        :src="
          require(`../../public/conditions/${this.city.currentWeather.weather[0].icon}.svg`)
        "
        alt=""
      />
    </div>
    <div class="video">
      <video
        autoplay
        loop
        muted
        :src="
          require(`../../public/videos/${this.city.currentWeather.weather[0].icon}.mp4`)
        "
      />
    </div>
    <div class="bg-overlay"></div>
  </div>
</template>

<script>
export default {
  name: "CityView",
  props: ["city"],
  computed: {
    temperature() {
      const fahrenheit = this.city.currentWeather.main.temp
      const celsius = (fahrenheit-32)/1.8
      return Math.round(celsius)
    }
  }
};
</script>

<style lang="scss" scoped>
.city {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 20px;
  flex-basis: 50%;
  min-height: 250px;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  span {
    z-index: 1;
    text-transform: capitalize;
    display: block;
    font-size: 25px;
    font-weight: 600;
  }

  .weather {
    display: flex;
    z-index: 1;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 1;

    span {
      font-size: 35px;
      margin-right: 8px;
    }

    img {
      height: 20px;
      width: auto;
    }
  }

  .video {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    video {
      height: 100%;;
      @media (min-width: 900px) {
        height: auto;
        width: 100%;
      }
    }
    .bg-overlay {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>