import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { LocalStorage } from "quasar";
import routes from "./routes";
import store from "../stores"
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    console.log(`Router from ${from.path} to ${to.path}`)
    const auth = to.meta.requiresAuth;
    const loggedinUser = getLoggedinUser()
    console.log(`Auth: ${auth}, loggedinUser: ${loggedinUser}`)
    if (auth && !loggedinUser) {
      store.general.methods.setActiveClass('/home')
      next({ path: "/login", query: { next: to.fullPath } });
    } else {
      store.general.methods.setActiveClass(to.path)
      next()
    }
  });

  return Router;
});


const getLoggedinUser = () => {
  console.log('Getting loggedin User')
  const loggedinUser = LocalStorage.getItem("loggedinUser");
  if (loggedinUser && loggedinUser.expiry > Date.now()) {
    console.log("Got loggedin user", loggedinUser.name);
    store.users.methods.setLoggedinUser(loggedinUser)
    return true;
  }
  return false
}
