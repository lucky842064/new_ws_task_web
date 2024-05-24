
import Dialog from './Dialog.vue'
const DialogBox = Vue.extend(Dialog)
Dialog.install = function (data) {
    let instance = new DialogBox().$mount()
    instance.type = data.type
    instance.title = data.title
    instance.content = data.content
    document.getElementById("app").appendChild(instance.$el);
    Vue.nextTick(() => {instance.visible = true})
}
export default Dialog