import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Authentication from "../views/Authentication.vue";
// import Calendar from '../views/Calendar.vue'
import User from "../views/User.vue";
import NotFound from "../views/NotFound.vue";
import ResetPassword from "../views/ResetPassword.vue";
import ErrorPage from "../views/ErrorPage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Authentication
  },
  {
    path: "/users/:id",
    component: User
    // children: [
    //   {
    //     path: "/calendar",
    //     component: Calendar
    //   }
    // ]
  },
  {
    path: "/password-reset/:uuid",
    component: ResetPassword
  },
  {
    path: "/error/:message",
    component: ErrorPage
  },
  {
    path: "*",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
