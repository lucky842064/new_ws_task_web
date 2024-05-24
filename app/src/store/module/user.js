import router from '../../router/';
import {newloginGetcurrentprovince} from '@/api/wx.js'
import { login, getUserInfo, logout, register, viplist, heart } from '../../api/user';
import { getAppList } from '../../api/earn';
const bannerImage = require('../../assets/images/home/banner.png');
export default {
	namespaced: true,
	state: {
		httpManager: {},
		token: window.localStorage.getItem('token') || null, //用户token
		config: {
			ex_rate: 3,
			first_point: 0,
			first_type: 1,
			list: [],
			mini_point: 100,
			put_fee: 0,
			return_point: 0,
		},
		footerGet: [false, false, false],
		appList: [],
		userInfo: {
			up_num: ' ',
			vip: 0,
			lunbo: [],
			income_rand_infos: [],
			promote_rand_infos: [],
		},
		userHeadList: [
			require('../../assets/images/head/1.png'),
			require('../../assets/images/head/2.png'),
			require('../../assets/images/head/3.png'),
			require('../../assets/images/head/4.png'),
			require('../../assets/images/head/5.png'),
			require('../../assets/images/head/6.png'),
			require('../../assets/images/head/7.png'),
			require('../../assets/images/head/8.png'),
			require('../../assets/images/head/9.png'),
			require('../../assets/images/head/10.png'),
			require('../../assets/images/head/11.png'),
			require('../../assets/images/head/12.png'),
			require('../../assets/images/head/13.png'),
			require('../../assets/images/head/14.png'),
			require('../../assets/images/head/15.png'),
			require('../../assets/images/head/16.png'),
			require('../../assets/images/head/17.png'),
			require('../../assets/images/head/18.png'),
			require('../../assets/images/head/19.png'),
			require('../../assets/images/head/20.png'),
		],
		interval: null,
		market: false,
		
	},
	mutations: {
		updateAppList(state, value) {
			state.appList = value;
		},
		login: (state, data) => {
			state.token = data.token;
			if (data.autologin) {
				window.localStorage.setItem('prologin', data.autologin);
			}
			window.localStorage.setItem('token', data.token);
			window.localStorage.setItem('uid', data.uid);
		},
		register: (state, data) => {
			state.token = data.token;
			state.uid = data.uid;
			if (data.autologin) {
				window.localStorage.setItem('prologin', data.autologin);
			}
			window.localStorage.setItem('token', data.token);
			window.localStorage.setItem('uid', data.uid);
		},
		clearUserInfo: (state, data) => {
			localStorage.removeItem('token');
			state.token = null;
			state.uid = '';
			state.appKey = null;
			state.IMtoken = null;
			state.userInfo = {};
		},
		userInfo: (state, data) => {
			state.userInfo = {
				...state.userInfo,
				...data,
			};
		},
		userBalance(state, data) {
			state.userInfo = {
				...state.userInfo,
				balance: data.balance,
				usdb: data.usdb,
			};
		},
		updateConfig(state, data) {
			state.config = data;
		},
		// openInterval(state, data) {
		// 	if (!state.interval) {
		// 		heart({});
		// 		state.interval = setInterval(() => {
		// 			heart({});
		// 		}, 60000)
		// 	}
		// },
		closeInterval(state) {
			if (state.interval) {
				clearInterval(state.interval);
				state.interval = null;
			}
		},
	},
	actions: {
		userLogin({ commit }, params) {
			commit('clearUserInfo');
			return new Promise((resolve, reject) => {
				login(params).then(res => {
					if(res.token){
						res.autologin = params.autologin;
						commit('login', res);
						resolve()
					}
				}).catch(error => {
					reject(error);
				});
			});
		},
		userRegister({ commit }, params) {
			commit('clearUserInfo');
			return new Promise((resolve, reject) => {
				register(params).then(res => {
					if(res.token){
						res.autologin = params.autologin;
						commit('register', res);
						resolve();
					}
				}).catch(error => {
					reject(error)
				})
			})
		},
		storageUserInfo({ commit, state, dispatch }, params) {
			commit('login', params);
			dispatch('getUserInfo');
		},
		getUserInfo({ commit, state }, value = false) {
			if (value != state.footerGet[0]) {
				state.footerGet[0] = value;
				if (!value) return;
			}
			newloginGetcurrentprovince().then(res => {
				sessionStorage.setItem('storageIP', JSON.stringify(res));
				resolve();
			}).catch(err => {
			});
			getUserInfo({}).then(data => {
				sessionStorage.setItem('storageInfo', JSON.stringify(data));
				sessionStorage.setItem('newsStatus', JSON.parse(sessionStorage.getItem('storageInfo')).read_msg);
				data.income_rand_infos = data.income_rand_infos || [];
				data.promote_rand_infos = data.promote_rand_infos || [];
				if (!data.lunbo || data.lunbo.length == 0) {
					data.lunbo = [
						{
							url: bannerImage,
							open_url: '',
						},
						{
							url: bannerImage,
							open_url: '',
						},
						{
							url: bannerImage,
							open_url: '',
						},
					];
				} else {
					data.lunbo.sort((a, b) => {
						if (a.sort == b.sort) {
							return a.itime > b.itime ? 1 : -1;
						} else {
							return a.sort > b.sort ? 1 : -1;
						}
					});
				}
				commit('userInfo', data);
			});
		},
		logoutUser({ state }) {
			return new Promise((resolve, reject) => {
				logout().then(result => {
					// localStorage.removeItem('token');
					// localStorage.removeItem('myip');
					// localStorage.removeItem('uid');
					// localStorage.removeItem('mycityname');
					// sessionStorage.removeItem('storageIP');
					// localStorage.removeItem('lastDepositTime');
					// localStorage.removeItem('lastDepositTime');
					// sessionStorage.removeItem('userType');
					// sessionStorage.removeItem('advert');
					// sessionStorage.removeItem('noticeCont');
					// sessionStorage.removeItem('bannerCont');
					// sessionStorage.removeItem('serviceCont');
					// sessionStorage.removeItem('niticState');
					window.clearInterval(clearTime);
					sessionStorage.clear();
					state.userInfo = {};
					state.token = null;
					router.replace({path: '/login' });
					resolve();
				}).catch(err => {
					router.replace({path: '/login' });
					reject();
				});
			});
		},
		getAppList({ commit, state }, value = false) {
			if (value != state.footerGet[1]) {
				state.footerGet[1] = value;
				if (!value) return;
			}
			getAppList({}).then(res => {
				let list = res.list || [];
				list.forEach(item => {
					item.text = item.app_name;
					item.value = item.app_id;
					if (item.game) {
						item.game.forEach(temp => {
							temp.text = temp.game_name;
							temp.value = temp.game_id;
							if (temp.room) {
								temp.room.forEach(ele => {
									ele.text = ele.room_name;
									ele.value = ele.room_id;
								});
							}
						});
					}
				});
				commit('updateAppList', list);
			});
		},
		viplist({ commit, state }, value = false) {
			if (value != state.footerGet[2]) {
				state.footerGet[2] = value;
				if (!value) return;
			}
			viplist({}).then(data => {
				// console.log(data);
				commit('updateConfig', data);
			});
		},
		logoutClearAndJump({ commit }) {
			commit('clearUserInfo');
		},
	},
	modules: {},
};
