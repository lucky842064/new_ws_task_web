
import VueI18n from 'vue-i18n'
import { Locale } from 'vant'
import zhCN from './zh-CN'
import enLocale from './zh.js'
Vue.use(VueI18n)

const messages = {
	en: {
		...enLocale
	},
	zh: {
		...zhCN,
		...enLocale
	}
}
const i18n = new VueI18n({
	locale: Cookies.get('language') || "zh", // 设置默认语言
	silentTranslationWarn: true,
	messages: messages // 设置资源文件对象
})
// 更新vant组件库本身的语言变化，支持国际化
function vantLocales(lang) {
	if (lang === 'zh') {
		Locale.use(lang, messages.zh)
	} 
}

export {
	i18n,
	messages,
	vantLocales
}