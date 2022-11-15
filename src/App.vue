<template>
  <div class="main">
    <NavigationView class="navigation" />
    <router-view />
  </div>
</template>

<script>
// import AddCity from "./views/AddCity.vue"
import axios from "axios";
import db from "./firebase/firebase";
import NavigationView from "./components/NavigationView.vue"
export default {
  name: "App",
  components: {
    NavigationView
  },
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

.main {
  height: 100vh;
  .navigation {
    z-index: 99;
    position: fixed;
    max-width: 1024px;
    width: 100%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}

.container {
  padding: 0 20px;
}
</style>