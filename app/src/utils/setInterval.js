import router from '../router'
import store from '../store'

var lastTime = new Date().getTime()
var currentTime = new Date().getTime()
var timeOut = 60 * 60 * 1000 // 设置超时时间： 60分钟 随意设置
window.onload = function() {
  window.document.onmousedown = function() {
    localStorage.setItem('lastTime', new Date().getTime())
  }
}
function checkTimeout() {
  currentTime = new Date().getTime() // 更新当前时间
  lastTime = localStorage.getItem('lastTime')
  // console.log(currentTime - lastTime);
  // console.log(timeOut);
  if (currentTime - lastTime > timeOut) { // 判断是否超时 ,在这里面写退出的一些操作
    clear()
    window.clearInterval(clearTime)
    // console.log("超时");
    // var url = window.location.href
    // var newUrl = url.match(/(\S*)#/)[1]
    // window.open(newUrl + '#/login', '_self')
    logout() //本人项目中的退出方法
  }
}
//退出方法
async function logout() {
  // await store.dispatch('user/logout')
  // router.push(`/login?redirect=${this.$route.fullPath}`)
  window.likevm.$router.replace('login')
}
function clear() {
  window.localStorage.clear()
}
/* 定时器 间隔30秒检测是否长时间未操作页面 */
var clearTime = window.setInterval(checkTimeout, 30000)