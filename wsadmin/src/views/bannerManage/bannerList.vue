<!--  -->
<template>
	<div class='container_coat'>
		<div class="condition_warp select_warp">
			<el-form inline>
                <el-form-item>
                    <el-input size="small" v-model="factorModel.task_name" clearable placeholder="请输入任务名称" style="width:180px;"></el-input>
				</el-form-item>
				<!-- <el-form-item class="change_new_time">
					<el-date-picker size="small" v-model="factorModel.dateArry" type="daterange" value-format="yyyy-MM-dd" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style='width:240px'>
					</el-date-picker>
                </el-form-item> -->
                <el-form-item>
					<el-button size="small" type="primary" @click="getBannerList(1)">查询</el-button>
				</el-form-item>
                <el-form-item style="float:right;">
                    <!-- <el-button size="small" type="danger" :disabled="factorModel.regestId==0" @click="delCardBtn(1,1)">批量删除</el-button> -->
                    <el-button size="small" type="primary" @click="addGroupBtn(0,1)">创建任务</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="switch_bar">
			<div class="consun_list handel_area">
				<el-table :data="bannerList" border style="width: 100%" v-loading="loading" ref="serveTable" element-loading-spinner="el-icon-loading" :header-cell-style="{background:'#eef1f6',color:'#606266'}" @selection-change="selectAllChange" @row-click="rowSelectChange">
					<!-- <el-table-column type="selection" width="55"> </el-table-column> -->
					<el-table-column prop="wx_id" label="序号" width="60" align="center">
                        <template slot-scope="scope">
							<span>{{(factorModel.offset-1)*factorModel.limit+scope.$index+1}}</span>
						</template>
                    </el-table-column>
					<el-table-column prop="name" label="名称" minWidth="100" align="center"></el-table-column>
					<el-table-column prop="file_url" label="图片" minWidth="80" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.file_url" style="width: 40px;height: 40px;cursor: pointer;" @click="previewImg(scope.row.file_url)">
						</template>
                    </el-table-column>
					<el-table-column prop="link" label="跳转链接" minWidth="140" align="center"></el-table-column>
					<el-table-column prop="remark" label="备注" minWidth="140" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" width="80" align="center">
						<template slot-scope="scope">
                            <span :style="'color:'+(scope.row.status==2?'#67c23a':'#f56c6c')" v-text="lopOption[scope.row.status]"></span>
						</template>
					</el-table-column>
					<el-table-column prop="itime" label="创建时间" width="160" align="center">
                        <template slot-scope="scope">
                            {{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"~" }}
                        </template>
                    </el-table-column>
                    <el-table-column width="160" label="操作" align="center" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" size="mini" plain @click="addGroupBtn(scope.row,2)">编辑</el-button>
							<el-button type="danger" size="mini" plain @click="delCardBtn(scope.row,2)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
        <!-- 新增轮播 -->
        <el-dialog :title="sendForm.type==0?'添加轮播':'编辑轮播'" :visible.sync="createModel" :close-on-click-modal="false" width="550px">
			<el-form size="small" :model="sendForm" label-width="140px" :rules="sendRules" ref="sendForm">
                <el-form-item label="轮播名称：" prop="task_name">
                    <el-input placeholder="请输入任务名称" v-model="sendForm.task_name" style="width:100%;"></el-input>
                </el-form-item>
                <el-form-item label="上传图片：" prop="file_url" style="line-height: 1;">
                    <template v-if="!sendForm.file_url">
                        <el-button class="custom_file1" style="margin-top: 0;" :loading="isUpload">{{!isUpload?$t('sys_c059'):$t('sys_q015') }}
                            <input type="file" accept=".jpg,.jpeg,.png" ref='uploadclear' @change="checkIpIsUse" id="uploadFile" title=" " />
                        </el-button>
                    </template>
                    <div class="view_img" v-else>
                        <img :src="sendForm.file_url">
                        <span class="cover_bg">
                            <i class="el-icon-view" @click.stop="previewImg(sendForm.file_url)"></i>
                            <i class="el-icon-delete" @click.stop="sendForm.file_url=''"></i>
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="跳转链接：">
                    <el-input placeholder="请输入跳转链接" v-model="sendForm.link"  oninput ="value=value.replace(/[^\d]/g,'')" ></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                    <el-radio-group v-model="sendForm.status">
                        <el-radio :label="idx" v-for="(item,idx) in lopOption" :key="idx" v-show="idx!=0">{{ item }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input placeholder="请输入备注" v-model="sendForm.remark"></el-input>
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
import { successTips } from '@/utils/index'
import { materialFile } from '@/api/article'
import { getcarousellist,docarousel } from '@/api/banner'
export default {
    components: {'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer') },
	data() {
		return {
			statusList:["待启动","初始化","进行中","失败","完成","关闭"],
			factorModel:{
                task_name:"",
                total:0,
                offset:1,
                limit:100
            },
            type:0,
            viewImg:"",
            loading:false,
            bannerList:[],
            isLoading:false,
            isUpload:false,
            imgModel:false,
            createModel:false,
            sendForm:{
				id:"",
                task_name:"",
                file_url:"",
                link:"",
                remark:"",
                status:1
            },
            sendRules:{
                task_name: [
                    { required: true, message:this.$t('sys_mat061',{value:this.$t('sys_g070')}), trigger: 'blur' }
                ],
				file_url: [
                    { required: true, message:this.$t('sys_c052'), trigger: 'change' }
                ],
				status: [
                    { required: true, message:this.$t('sys_c052'), trigger: 'change' }
                ]
            }
		}
	},
    computed: {
        lopOption() {
            return ["",this.$t('sys_c026'),this.$t('sys_c025')]
        }
    },
	mounted() {
        this.getBannerList();
	},
	//方法集合
	methods: {
		//初始化消息列表
		getBannerList(){
            this.loading =true;
			getcarousellist({name:this.factorModel.task_name}).then(res =>{
                this.loading = false;
				this.bannerList = res.data.list || [];
			})
		},
        limitChange(val){
			this.factorModel.limit = val;
			this.getBannerList()
        },
        offestChange(val){
			this.factorModel.offset = val;
			this.getBannerList()
		},
        async checkIpIsUse(){
            let imgFormat = ["jpg", "jpeg", "png"];
            let files = this.$refs.uploadclear.files[0];
            let fileType = files.name.split(".").pop();
            if (imgFormat.indexOf(fileType) == -1) {
                this.$refs.uploadclear.value = null;
                return successTips(this, "error","请选择"+imgFormat+"格式图片");
            }
            let formData = new FormData();
            formData.append('file', files);
            this.$refs.uploadclear.value = null;
            this.isUpload = true;
            const res = await materialFile(formData);
            setTimeout(() => {this.isUpload = false },1000);
            if (res.code !=0) return;
            this.sendForm.file_url = res.data.url;
        },
        closeViewer(e) {
            this.imgModel = false;
        },
        previewImg(url){
            this.viewImg = url;
            this.imgModel = true;
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
						ptype:this.type,
                        name:this.sendForm.task_name,
                        file_url:this.sendForm.file_url,
                        link:this.sendForm.link,
                        remark:this.sendForm.remark,
                        status:this.sendForm.status
					}
					this.type==2?data.id=this.sendForm.id:'',
                    this.isLoading = true;
					docarousel(data).then(res =>{
                        this.isLoading = false;
						this.getBannerList()
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
			let that = this;
			let tipsText = type==1||type==2?'此操作将删除该轮播, 是否继续?':type == 3?'此操作将启动该注册任务, 是否继续?':type == 4?'此操作将关闭该注册任务, 是否继续?':'';
			that.$confirm(tipsText, '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: function (action, instance,done) {
                    if(action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        docarousel({ptype:3,del_id:[val.id]}).then(res =>{
                            instance.confirmButtonLoading = false;
                            if (res.code !=0) return;
                            successTips(this)
							that.getBannerList()
							done();
						})
                    }else{
                        done();
                    }
                }}).catch(() => {
                that.$message({type: 'info',message: '已取消'});          
            });
        },
		selectAllChange(row){
			this.factorModel.regestId = row.map(item=>{return item.id})
        },
        cloneImgpreview(e) {
            if (e.target.getAttribute('class') === 'el-image-viewer__mask') {
            this.imgModel = false;
            }
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = factorModel.regestId.find(item => item == row.id);
            if (findRow) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.toggleRowSelection(row,true);
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