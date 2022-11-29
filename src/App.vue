<template>
  <div v-if="isLoading" class="loading"></div>
  <div v-else class="app">
    <Modal
      v-if="modalOpen"
      @close-modal="toggleModal"
      :APIkey="APIkey"
      :cities="cities"
    />
    <NavigationView
      @add-city="toggleModal"
      @edit-city="toggleEdit"
      :addCityActive="addCityActive"
      :isDay="isDay"
      :isNight="isNight"
    />
    <router-view
      :isDay="isDay"
      :isNight="isNight"
      :cities="cities"
      :edit="edit"
      :APIkey="APIkey"
      @is-day="dayTime"
      @is-night="nightTime"
      @resetDays="resetDays"
      @add-city="toggleModal"
    />
  </div>
</template>

<script>
import axios from "axios";
import db from "./firebase/firebase";
import NavigationView from "./components/NavigationView.vue";
import Modal from "./components/Modal.vue";
export default {
  name: "App",
  components: {
    Modal,
    NavigationView,
  },
  data() {
    return {
      isDay: null,
      isNight: null,
      APIkey: "339d698f17ac0be62378718a872f23c1",
      cities: [],
      modalOpen: null,
      edit: null,
      addCityActive: null,
      isLoading: true,
    };
  },
  created() {
    this.getCityWeather();
    this.checkRoute();
  },
methods: {
    getCityWeather() {
      let firebaseDB = db.collection("cities");
      firebaseDB.onSnapshot((snap) => {
        if (snap.docs.length === 0) {
          this.isLoading = false;
        }
        snap.docChanges().forEach(async (doc) => {
          if (doc.type === "added" && !doc.doc.Nd) {
            try {
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${doc.doc.data().city}&units=imperial&APPID=${
                  this.APIkey
                }`
              );
              const data = response.data;
              firebaseDB
                .doc(doc.doc.id)
                .update({
                  currentWeather: data,
                })
                .then(() => {
                  this.cities.push(doc.doc.data());
                  this.isLoading = false;
                });
            } catch (err) {
              console.log(err);
            }
          } else if (doc.type === "added" && doc.doc.Nd) {
            this.cities.push(doc.doc.data());
          } else if (doc.type === "removed") {
            this.cities = this.cities.filter((city) => city.city !== doc.doc.data().city);
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
    checkRoute() {
      if (this.$route.name === "AddCity") {
        this.addCityActive = true;
      } else {
        this.addCityActive = false;
      }
    },
    dayTime() {
      this.isDay = !this.isDay;
    },
    nightTime() {
      this.isNight = !this.isNight;
    },
    resetDays() {
      this.isDay = false;
      this.isNight = false;
    },
  },
  watch: {
    $route() {
      this.checkRoute();
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

.day {
  transition: 500ms ease all;
  background-color: rgb(59, 150, 249);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.night {
  transition: 500ms ease all;
  background-color: rgb(20, 42, 95);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.main {
  max-width: 1024px;
  margin: 0 auto;
  height: 100vh;

  .container {
    padding: 0 20px;
  }
}

.loading {
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 2px solid transparent;
    border-top-color: #142a5f;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>