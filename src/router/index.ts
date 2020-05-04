import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Authentication from "@/views/Authentication.vue";
import Header from "@/components/Navigation/Header.vue";
import Footer from "@/components/Navigation/Footer.vue";
import User from "@/views/User.vue";
import NotFound from "@/views/NotFound.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import moment from "moment";

Vue.use(VueRouter);

const defaultLayout = {
  header: Header,
  footer: Footer
};

const routes: Array<RouteConfig> = [
  {
    path: "/auth",
    component: Authentication
  },
  {
    path: "/users/:id",
    component: User,
    children: [
      {
        path: "",
        components: defaultLayout
      }
    ]
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

router.beforeEach((to, from, next) => {
  const publicPages = ["/auth", "/password-reset", "/error"];
  const authRequired = !publicPages.includes(to.path);

  const loggedIn = JSON.parse(localStorage.getItem("user") || "{}");
  const isNoToken = Object.keys(loggedIn).length === 0;
  const isTokenExpired =
    Object.keys(loggedIn).length !== 0 && moment().diff(loggedIn.expire) > 0;

  if (authRequired && (isNoToken || isTokenExpired)) {
    next("/auth");
  } else {
    next();
  }
});

export default router;
