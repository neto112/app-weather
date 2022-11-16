<template>
  <div class="main">
    <Modal v-if="modalOpen" @close-modal="toggleModal" :APIkey="APIkey" />
    <NavigationView @add-city="toggleModal" @edit-city="toggleEdit" />
    <AddCity :cities="cities" :edit="edit" />
    <!-- <router-view v-bind:cities="cities" /> -->
  </div>
</template>

<script>
import axios from "axios";
import db from "./firebase/firebase";
import AddCity from "./views/AddCity.vue";
import NavigationView from "./components/NavigationView.vue";
import Modal from "./components/Modal.vue";
export default {
  name: "App",
  components: {
    AddCity,
    Modal,
    NavigationView,
  },
  data() {
    return {
      APIkey: "b33558d4f7c88ec48792d8f1e0f09c62",
      cities: [],
      modalOpen: null,
      edit: null,
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
          if (doc.type === "added" && !doc.doc.Nd) {
            try {
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${
                  doc.doc.data().city
                }&units=imperial&APPID=${this.APIkey}`
              );
              const data = response.data;
              firebaseDB
                .doc(doc.doc.id)
                .update({
                  currentWeather: data,
                })
                .then(() => {
                  this.cities.push(doc.doc.data());
                });
            } catch (err) {
              console.log(err);
            }
          } else if (doc.type === "added" && doc.doc.Nd) {
            this.cities.push(doc.doc.data());
          } else if (doc.type === "removed") {
            this.cities = this.cities.filter((city) => {
              city.city !== doc.doc.data().city;
            });
          }
        });
      });
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleEdit() {
      this.edit = !this.edit;
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
  max-width: 1024px;
  margin: 0 auto;
  height: 100vh;
  
  .container {
    padding: 0 20px;
  }
}
</style>