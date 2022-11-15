<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import AddCity from "./views/AddCity.vue"
import axios from "axios";
import db from "./firebase/firebase";
export default {
  name: "App",
  data() {
    return {
      APIkey: "b33558d4f7c88ec48792d8f1e0f09c62",
      city: "Detroit",
      cities: [],
    };
  },
  created() {
    this.getCityWeather();
  },
  methods: {
    getCityWeather() {
      let firebaseDB = db.collection("cities");
      firebaseDB.onSnapshot((snap) => {
        snap.docChanges().forEach(async (doc) => {
          if(doc.type === 'added') {
            try {
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${doc.doc.data().city}&units=imperial&APPID=${this.APIkey}`
              );
              const data = response.data;
              firebaseDB.doc(doc.doc.id).update({
                currentWeather: data,
              }).then(() => {
                this.cities.push(doc.doc.data());
              }).then(() => {
                console.log("1", this.cities);
              })
            } catch (err) {
              console.log(err);
            }
          }
        });
      });
    },
    getCurrentWeather() {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=imperial&APPID=${this.APIkey}`
        )
        .then((res) => {
          console.log(res.data);
        });
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}
</style>