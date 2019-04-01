// Vue Design System: The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import store from "@/store";
import router from "@/router";
import Vue from "vue";
import App from "@/App";
import WebFontLoader from "@/utils/webFontLoader"; // eslint-disable-line no-unused-vars
import Meta from "vue-meta";

// Vue Design System: Auto importing components globally
import DesignSystem from "@/system";

Vue.use(DesignSystem);
Vue.use(Meta);

Vue.config.productionTip = false;

  new Vue({
    el: "#app",
    router,
    store,
    template: "<App/>",
    components: { App }
  });

/* eslint-disable no-new */

