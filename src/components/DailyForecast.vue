<template>
  <div class="daily-forecast">
    <div>
      <span> {{new Date(this.day.dt *1000).toLocaleString("en-us", {weekday: "long"})}}</span>
    </div>
    <div class="condition">
      <img :src="require(`../../public/conditions/${this.day.weather[0].icon}.svg`)" alt="" />
    </div>
    <div class="weather">
      <span class="high">{{Math.round(this.day.temp.max)}}</span>
      <span class="low">{{Math.round(this.day.temp.min)}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DailyForecast",
  props: ["day"],
}
</script>

<style lang="scss" scoped>
.daily-forecast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  div {
    flex: 1;
  }
  .condition {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 20px;
    }
  }
  .weather {
    display: flex;
    justify-content: flex-end;
    span {
      min-width: 20px;
    }
    .high {
      font-weight: 500;
      margin-right: 12px;
    }
  }
}
</style>