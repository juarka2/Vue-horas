import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import cargaHoras from "../views/cargaHoras.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/cargar",
    name: "cargaHoras",
    component: cargaHoras,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
