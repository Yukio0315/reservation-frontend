import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
// import Calendar from '../views/Calendar.vue'
// import User from '../views/User.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Home
  }
  // {
  //   path: "/users/:id",
  //   component: User
  //   children: [
  //     {
  //       path: "/calendar",
  //       component: Calendar
  //     }
  //   ]
  // }
  // {
  //   path: "*",
  //   component: NotFound
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
