import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import AboutView from "../views/AboutView.vue";
import CustomerView from "../views/CustomerView.vue";
import TeacherView from "../views/TeacherView.vue";

const routes = [
  { path: "/", name: "Login", component: LoginView },
  {
    path: "/home",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/about", name: "About", component: AboutView },
  {
    path: "/CustomerView",
    name: "Customer",
    component: CustomerView,
    meta: { requiresAuth: true },
  },
  {
    path: "/TeacherView",
    name: "Teacher",
    component: TeacherView,
    meta: { requiresAuth: true },

  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
