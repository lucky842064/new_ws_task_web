import {websiteConfig} from "../../api/sys";
export default {
	namespaced: true,
	state: {
		zodiacData: {},
		numberData: {},
		fiveElement: {},
		waveColor: {},
		zodiac: {},
		banner: [],
		websiteConfigData: {
			onlineServiceUrl: '',
			betUrl: ''
		},
		locale:''
	},
	mutations: {
		banner: (state, data) => {
			state.banner = data;
		},
		setNoticeAlter:()=>{ //在登录时设定
			sessionStorage.setItem("settingHadShowAlertNotice",'1');
		},
		afterNoticeAlter:()=>{ //点击后去除
			sessionStorage.removeItem("settingHadShowAlertNotice");
		},
	},
	getters: {
		setting: state => {
			let t="{}";
			let result={};
			try{
				result=JSON.stringify(state.websiteConfigData);
			}catch(e){}

			if(t!="{}"){
				return state.websiteConfigData
			}
			else{
				let s=sessionStorage.getItem("globalConfig");
				if(s){
					try{
						result=JSON.parse(s);
					}catch(e){}
				}
			}
			return result;
		},
	},
	// actions: {
	// 	getGlobalConfig({commit,state}){
	// 		return new Promise((resolve, reject) => {
	// 			websiteConfig().then(data => {
	// 				if (data) {
	// 					state.globalConfig = data;
	// 					sessionStorage.setItem('globalConfig',JSON.stringify(data))
	// 				}
	// 				resolve()
	// 			}).catch(()=>{reject()});
	// 		})
	// 	},
	// },
	modules: {}
};
