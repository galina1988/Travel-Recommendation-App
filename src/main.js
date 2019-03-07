import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBn96efi2cuvsNiE0DxFqWetigb0hti4bM",
    libraries: "places"
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
