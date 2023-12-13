import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from "axios";
import Echo from "laravel-echo";
import VueSplide from '@splidejs/vue-splide';


Vue.use( VueSplide );
require('@splidejs/splide/dist/css/splide.min.css')
window.Pusher = require('pusher-js');


window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_WEBSOCKETS_KEY,
  wsHost: process.env.VUE_APP_WEBSOCKETS_SERVER,
  wsPort:6001,
  forceTLS: false,
  disableStats: true
});

import VueQuagga from 'vue-quaggajs';
// register component 'v-quagga'
Vue.use(VueQuagga);

import Quagga from 'quagga'; // ES6


import VueMeta from 'vue-meta'
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})

import VueTour from 'vue-tour'
require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)





import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)



const moment = require('moment')
require('moment/locale/es')
Vue.use(require('vue-moment'), {
  moment
})

import VueTelInputVuetify from 'vue-tel-input-vuetify/lib';

Vue.use(VueTelInputVuetify, {
  vuetify,
});

Vue.config.productionTip = false

axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");














new Vue({
  VueQuagga,
  Quagga,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
