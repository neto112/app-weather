import { createRouter, createWebHistory } from 'vue-router'
import AddCity from "../views/AddCity.vue";
import WeatherView from "../views/WeatherView.vue"

const routes = [
  {
    path: "/",
    name: "AddCity",
    component: AddCity,
  },
  {
    path: "/weather/:city",
    name: "WeatherView",
    component: WeatherView,
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router