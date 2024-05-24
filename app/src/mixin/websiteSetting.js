//当前文件只存放 全局设置功能其他功能请勿在这里实现
export default {
	activated() {
		this.getDataList();
	},
	created() {
		this.getDataList();
	},
	methods: {
		getDataList() {
			let t = "{}"
			try {
				t = JSON.stringify(this.$store.getters["Setting/setting"]);
			} catch (e) { }
			if (t.length&&t.length==4) {
				this.$store.dispatch("Setting/getGlobalConfig");
			}
		},
		contactService() {
			//location.href = '/chatlink.html';
			location.href = this.$store.getters["Setting/setting"].liveChatLink;
		}
	}
}
