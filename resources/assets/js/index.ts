require('./bootstrap');
import Vue from 'vue';
import { BootstrapVue, IconsPlugin, LayoutPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './../sass/app.scss'
import * as _ from 'lodash';
import axios from 'axios';

const moment = require('moment')

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(LayoutPlugin)
Vue.use(require('vue-moment'), {
    moment
})
new Vue({
    render: h => h(require('./components/App.vue').default)
}).$mount('#app');