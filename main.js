import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.globalUser = function (key) {
    var globalUser = uni.getStorageSync(key)
	if (globalUser != null && globalUser != "" && globalUser != undefined) {
		return globalUser
	} else { 
		return null
	}
}


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
