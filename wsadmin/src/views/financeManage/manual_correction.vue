<!--  -->
<template>
	<div class='container_coat'>
		<div class="condition_warp select_warp">
			<el-form inline>
                <el-form-item>
                    <el-input size="small" v-model="factorModel.card_no" clearable placeholder="请输入提现账号" style="width:180px;"></el-input>
				</el-form-item>
				<!-- <el-form-item class="change_new_time">
					<el-date-picker size="small" v-model="factorModel.dateArry" type="daterange" value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style='width:240px'>
					</el-date-picker>
                </el-form-item> -->
                <el-form-item>
					<el-button size="small" icon="el-icon-search" type="primary" @click="getUpdateRecord(1)">{{ $t('sys_c002') }}</el-button>
                    <el-button size="small" icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button size="small" type="primary" @click="delCardBtn(0,1)">{{ $t('sys_m078') }}</el-button>
                </el-form-item>
			</el-form>
		</div>
		<div class="switch_bar">
			<div class="consun_list handel_area">
				<el-table :data="bannerList" border style="width: 100%" height="700" ref="serveTable" v-loading="loading" element-loading-spinner="el-icon-loading" :header-cell-style="{ color: '#909399', textAlign: 'center' }" @selection-change="selectAllChange"  @row-click="rowSelectChange">
					<!-- <el-table-column type="selection" width="55"> </el-table-column> -->
					<!-- <el-table-column prop="wx_id" label="序号" width="60" align="center">
                        <template slot-scope="scope">
							<span>{{(factorModel.offset-1)*factorModel.limit+scope.$index+1}}</span>
						</template>
                    </el-table-column> -->
					<el-table-column prop="id" :label="$t('sys_m080')" minWidth="120" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.id||"-" }}
						</template>
                    </el-table-column>
                    <el-table-column prop="app_account" :label="$t('sys_c009')" minWidth="100" align="center" />
                    <el-table-column prop="front_balance" :label="$t('sys_m081')" minWidth="100" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.front_balance||0 }}
						</template>
                    </el-table-column>
                    <el-table-column prop="before_balance" :label="$t('sys_m082')" minWidth="100" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.before_balance||0 }}
						</template>
                    </el-table-column>
                    <el-table-column prop="itime" :label="$t('sys_m083')" minWidth="160" align="center">
                        <template slot-scope="scope">
                            {{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"~" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" :label="$t('sys_m084')" minWidth="100" align="center" />
                    <!-- <el-table-column prop="amount" :label="$t('sys_m085')" minWidth="100" align="center" /> -->
                    <!-- <el-table-column width="120" label="操作" align="center" fixed="right">
						<template slot-scope="scope">
							<el-button :type="scope.row.status==2?'info':'warning'" :disabled="scope.row.status==2||pay_id.length>0" size="mini" plain @click="delCardBtn(scope.row,2)">
                                {{ scope.row.status==2?$t('sys_p008'):$t('sys_p010') }}
                            </el-button>
						</template>
					</el-table-column> -->
				</el-table>
                <div class="layui_page">
                    <el-pagination background @size-change="limitChange" @current-change="offestChange" :page-sizes="pageOption"
                        :current-page.sync="factorModel.page" :page-size="factorModel.limit" layout="total, sizes, prev, pager, next, jumper" :total="factorModel.total">
                    </el-pagination>
                </div>
			</div>
		</div>
        <!-- 变更金额 -->
        <el-dialog :title="sendForm.type==1?$t('sys_m078'):'编辑轮播'" :visible.sync="createModel" :close-on-click-modal="false" width="500px">
			<el-form size="small" :model="sendForm" label-width="100px" :rules="sendRules" ref="sendForm">
                <el-form-item :label="$t('sys_c009')" prop="account">
                    <el-input :placeholder="$t('sys_mat061',{value:$t('sys_c009')})" v-model="sendForm.account" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item :label="$t('sys_m079')" prop="amount">
                    <el-input :placeholder="$t('sys_mat061',{value:$t('sys_m079')})" v-model="sendForm.amount" oninput ="value=value.replace(/[^\d+-]/g,'')" ></el-input>
                    <span style="color:#ff4949;">变更金额：请输入正数；减少金额：请输入负数</span>
                </el-form-item>
                <el-form-item :label="$t('sys_l062')" prop="remark">
                    <el-input :placeholder="$t('sys_mat061',{value:$t('sys_l062')})" type="textarea" rows="3" v-model="sendForm.remark"></el-input>
                </el-form-item>
                <el-form-item style="text-align:center;margin-left: -110px;">
                    <el-button @click="createModel=false">取消</el-button>
                    <el-button type="primary" @click="submitSendBtn('sendForm')" :loading="isLoading">确定</el-button>
                </el-form-item>
			</el-form>
		</el-dialog>
        <el-image-viewer v-if="imgModel" :on-close="closeViewer" style="z-index:9999" @click.native="cloneImgpreview" :url-list="[viewImg]" />
	</div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import { getwithdrawreviselist,dowithdrawrevise } from '@/api/pay'
export default {
    components: {'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
	data() {
		return {
			statusList:["待启动","初始化","进行中","失败","完成","关闭"],
			factorModel:{
                status:0,
                card_no:"",
                task_name:"",
                total:0,
                offset:1,
                limit:100
            },
            type:0,
            pay_id:[],
            viewImg:"",
            loading:false,
            bannerList:[],
            isLoading:false,
            isUpload:false,
            imgModel:false,
            createModel:false,
            sendForm:{
				id:"",
                account:"",
                amount:"",
                remark:"",
                status:1
            },
            pageOption: resetPage(),
            sendRules:{
                account: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_c009')}), trigger: 'blur' }
                ],
				amount: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_m079')}), trigger: 'blur' }
                ],
				remark: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_l062')}), trigger: 'blur' }
                ]
            }
		}
	},
    computed: {
        lopOption() {
            return ["",this.$t('sys_c026'),this.$t('sys_c025')]
        },
        payOptions(){
            return [this.$t('sys_l053'),this.$t('sys_p007'),this.$t('sys_p008')]
        },
        drawOption(){
            return ["",this.$t('sys_p013'),this.$t('sys_p014')]
        }
    },
	mounted() {
        this.getUpdateRecord();
	},
	methods: {
        restQueryBtn(){
            this.factorModel.card_no="";
            this.getUpdateRecord(1)
            this.$refs.serveTable.clearSelection();
        },
		//获取人工修正列表
		getUpdateRecord(num){
            this.loading =true;
            this.factorModel.page=num?num:this.factorModel.page;
            let params = { 
                page: this.factorModel.page,
                limit: this.factorModel.limit,
                app_account:this.factorModel.card_no
            }
			getwithdrawreviselist(params).then(res =>{
                this.loading = false;
                this.factorModel.total=res.data.total;
				this.bannerList = res.data.list || [];
			})
		},
        selectAllChange(row){
			this.pay_id = row.map(item=>{return item.id})
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = this.pay_id.find(item => item == row.id);
            if (findRow) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.toggleRowSelection(row,true);
        },
        handleNewwork(val){
            this.factorModel.status=val;
            this.getUpdateRecord();
        },
        limitChange(val){
			this.factorModel.limit = val;
			this.getUpdateRecord()
        },
        offestChange(val){
			this.factorModel.offset = val;
			this.getUpdateRecord()
		},
         //添加
        addGroupBtn(val,idx){
            this.type = idx;
			if(idx == 2){
				this.sendForm.id=val.id;
				this.sendForm.task_name=val.name;
                this.sendForm.file_url=val.file_url;
                this.sendForm.link=val.link;
                this.sendForm.remark=val.remark;
                this.sendForm.status=val.status;
			}
            this.createModel = true;
        },
        //提交
        submitSendBtn(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
					let data = {
                        app_account:this.sendForm.account,
                        amount:Number(this.sendForm.amount),
                        remark:this.sendForm.remark
					}
                    this.isLoading = true;
					dowithdrawrevise(data).then(res =>{
                        this.isLoading = false;
                        if(res.code !=0) return;
						this.getUpdateRecord()
                        successTips(this)
						this.createModel = false;
					})
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        //删除
		delCardBtn(val,type){
            this.sendForm.type=type;
            this.createModel=true;
        }
	},
	watch:{
		createModel(val){
			if(val == false){
				this.$refs.sendForm.resetFields();
                this.sendForm.id="";
				this.sendForm.task_name="";
                this.sendForm.file_url="";
                this.sendForm.link="";
                this.sendForm.remark="";
                this.sendForm.status=1;
			}
		}
	},
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