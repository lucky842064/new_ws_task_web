export default {
	data() {
		return {
			mixinViewModuleOptions: {
				createdIsNeed: true, // 此页面是否在 进入 时，调用查询数据列表接口？
				activatedIsNeed: false, // 此页面是否在 激活 时，调用查询数据列表接口？
				getDataListURL: '', // 数据列表接口，API地址
				getDataListIsPage: false, // 数据列表接口，是否需要分页？
			},
		}
	},
	activated() {
		if (this.mixinViewModuleOptions.activatedIsNeed) {
			this.getDataList()
		}
	},
	created() {
		if (this.mixinViewModuleOptions.createdIsNeed) {
			this.getDataList()
		}
	},
	methods: {
		getDataList(){}
	}
}
