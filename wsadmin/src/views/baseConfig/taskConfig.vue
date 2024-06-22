<!--  -->
<template>
	<div class='container_coat'>
        <div class="condition_warp select_warp">
			<el-form inline>
                <el-form-item>
                    <el-button size="small" icon="el-icon-refresh-left" type="primary" @click="getConfigList(1)">{{ $t('sys_l095') }}</el-button>
				</el-form-item>
                <el-form-item style="float:right;">
                    <el-button size="small" type="primary" @click="addConfigBtn(0,1)">{{ $t('sys_s006') }}</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="switch_bar">
			<div class="consun_list handel_area">
				<el-table :data="configList" border style="width: 100%" height="700" v-loading="loading" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                    <el-table-column prop="key" :label="$t('sys_s003')" minWidth="230" align="center" />
                    <el-table-column prop="value" :label="$t('sys_s004')" minWidth="230" align="center" />
                    <el-table-column prop="remark" :label="$t('sys_s005')" minWidth="230" align="center" />
                    <el-table-column width="160" label="操作" align="center" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" plain @click="addConfigBtn(scope.row,2)">{{ $t('sys_c027') }}</el-button>
                            <el-button type="danger" size="mini" plain @click="delCardBtn(scope.row)">{{ $t('sys_c028') }}</el-button>
                        </template>
					</el-table-column>
				</el-table>
			</div>
		</div>
        <!-- 新增轮播 -->
        <el-dialog :title="configForm.type==0?$t('sys_mat015',{value:$t('sys_s003')}):$t('sys_mat016',{value:$t('sys_s003')})" :visible.sync="configModel" :close-on-click-modal="false" width="450px">
			<el-form size="small" :model="configForm" label-width="100px" :rules="configRules" ref="configForm">
                <el-form-item :label="$t('sys_s003')" prop="task_name">
                    <el-input :placeholder="$t('sys_mat061',{value:$t('sys_s003')})" v-model="configForm.task_name" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('sys_s004')" prop="task_num">
                    <el-input :placeholder="$t('sys_mat061',{value:$t('sys_s004')})" v-model="configForm.task_num" oninput ="value=value.replace(/[^\d]/g,'')" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('sys_s005')" prop="task_desc">
                    <el-input type="textarea" :placeholder="$t('sys_mat061',{value:$t('sys_s005')})" rows="3" v-model="configForm.task_desc"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center;margin-left: -110px;">
                    <el-button @click="configModel=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" @click="submitSendBtn('configForm')" :loading="isLoading">{{ $t('sys_c024') }}</el-button>
                </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { successTips } from '@/utils/index'
import { getsysconfiglist,dosysconfig} from '@/api/config'
export default {
	data() {
		return {
            loading:false,
            configList:[],
            isLoading:false,
            configModel:false,
            configForm:{
				id:"",
                type:null,
                task_name:"",
                task_num:"",
                task_desc:""
            }
		}
	},
    computed: {
        configRules(){
            return{
                task_name: [{ required: true, message:this.$t('sys_mat061',{value:this.$t('sys_s003')}), trigger: 'blur' }],
				task_num: [{ required: true, message:this.$t('sys_mat061',{value:this.$t('sys_s004')}), trigger: 'blur' }],
				task_desc: [{ required: true, message:this.$t('sys_mat061',{value:this.$t('sys_s005')}), trigger: 'blur' }]
            }
        }
    },
	mounted() {
        this.getConfigList();
	},
	methods: {
		//获取配置列表
		getConfigList(){
            this.loading =true;
			getsysconfiglist().then(res =>{
                this.loading = false;
				this.configList = res.data.list || [];
			})
		},
        addConfigBtn(val,type){
            this.configForm.type=type;
            this.configModel=true;
            if(type==1){
                this.$nextTick(()=>{
                    this.$refs.configForm.resetFields();
                    this.configForm.task_name="";
                    this.configForm.task_num="";
                    this.configForm.task_desc="";
                })
            }else{
                this.configForm.id=val.id;
                this.configForm.task_name=val.key;
                this.configForm.task_num=val.value;
                this.configForm.task_desc=val.remark;
            }
        },
        //提交
        submitSendBtn(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
					let data = {
						ptype:this.configForm.type,
                        key:this.configForm.task_name,
                        value:this.configForm.task_num,
                        remark:this.configForm.task_desc
					}
					this.configForm.type==2?data.id=this.configForm.id:'',
                    this.isLoading = true;
					dosysconfig(data).then(res =>{
                        this.isLoading = false;
						this.getConfigList()
						this.configModel = false;
					})
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        //删除
		delCardBtn(val,type){
			let that = this;
			that.$confirm(this.$t('sys_rai046',{value:this.$t('sys_c028')}),this.$t('sys_c028'), {
                type: 'warning',
                confirmButtonText:this.$t('sys_c024'),
                cancelButtonText:this.$t('sys_c023'),
                beforeClose: function (action, instance,done) {
                    if(action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        dosysconfig({ptype:3,del_id:[val.id]}).then(res =>{
                            instance.confirmButtonLoading = false;
                            if (res.code !=0) return;
                            successTips(that)
							that.getConfigList()
							done();
						})
                    }else{
                        done();
                    }
                }}).catch(() => {
                that.$message({type: 'info',message: '已取消'});          
            })
        }
	}
}
</script>
<style lang="scss" scoped>
    .view_img{
        width: 60px;
        height: 60px;
        display: flex;
        cursor: pointer;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .cover_bg{
            opacity: 0;
            width: 100%;
            height: 100%;
            display: flex;
            gap: 8px;
            position: absolute;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, .7);
            transition: all .5s;
            i{
                font-size: 16px;
            }
            .el-icon-view{
                color: #409eff;
            }
            .el-icon-delete{
                color: #f56c6c;
            }
        }
    }
    .view_img:hover .cover_bg{
        opacity: 1;
    }
</style>