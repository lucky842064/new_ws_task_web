import router from '../../router/';
import { getincome } from'@/api/home'
import { login,register,logout,getcarousellist } from '@/api/login';
export default {
	namespaced: true,
	state: {
		allIncome:"",
		httpManager: {},
		bannerList:window.localStorage.getItem('carousel_list')||null,
		inviteCode:window.localStorage.getItem('inviteCode')||null,
		token: window.localStorage.getItem('token') || null,
		account: window.localStorage.getItem('account') || null,
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
		store_info: (state, data) => {
			const {token,user_info:{uid,account,invite_code}} = data;
			state.uid = uid;
			state.token = token;
			state.account = account;
			state.inviteCode = invite_code;
			window.localStorage.setItem('uid',uid);
			window.localStorage.setItem('token',token);
			window.localStorage.setItem('account',account);
			window.localStorage.setItem('inviteCode',invite_code);
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
		closeInterval(state) {
			if (state.interval) {
				clearInterval(state.interval);
				state.interval = null;
			}
		},
		store_income(state, data) {
			state.allIncome = data;
		},
		store_carousel(state, data) {
			state.bannerList = data.list;
			window.localStorage.setItem('carousel_list',data);
		},
	},
	actions: {
		userLogin({ commit }, params ,callback) {
			commit('clearUserInfo');
			return new Promise((resolve, reject) => {
				login(params).then (res => {
					if(res.token){
						commit('store_info', res);
						resolve(res)
					}
					resolve(res)
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
						commit('store_info', res);
					}
					resolve(res);
				}).catch(error => {
					reject(error)
				})
			})
		},
		userIncome({ commit }) {
			return new Promise((resolve, reject) => {
				getincome().then(res => {
					commit('store_income', res);
					resolve();
				}).catch(error => {
					reject(error)
				})
			})
		},
		plantCarousel({ commit }) {
			return new Promise((resolve, reject) => {
				getcarousellist().then(res => {
					commit('store_carousel', res);
					resolve();
				}).catch(error => {
					reject(error)
				})
			})
		},
		logoutUser({ state }) {
			return new Promise((resolve, reject) => {
				logout().then(result => {
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
		logoutClearAndJump({ commit }) {
			commit('clearUserInfo');
		}
	},
	modules: {},
};
