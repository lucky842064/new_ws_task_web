<template>
    <div>
        <el-form size="small" :inline="true" style="margin-top: 10px;">
          <el-form-item>
            <el-button type="primary" @click="jumpCreatTask(0,0)">{{ $t('sys_m038') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(1)">{{ $t('sys_rai081') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" :disabled="checkIdArry.length==0" @click="handleGroupBtn(3)">{{ $t('sys_rai097') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="checkIdArry.length==0" @click="handleGroupBtn(4)">{{ $t('sys_q111') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :disabled="checkIdArry.length==0" @click="handleGroupBtn(2)">{{ $t('sys_rai082') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-input clearable v-model="model1.task_name" :placeholder="$t('sys_mat024')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getPullTaskList(1)">{{ $t('sys_c002') }}</el-button>
            <el-button icon="el-icon-refresh-right" @click="resetQuery">{{ $t('sys_c049') }}</el-button>
          </el-form-item>

          <el-form-item class="fr">
            自动炸群: <el-switch v-model="auto_scamper" active-text="开启" inactive-text="关闭" @change="handleScamper" />
          </el-form-item>
        </el-form>
        <!-- 分组管理 -->
        <div class="continer_main">
          <div class="tab_check_warp">
              <i slot="reference" class="el-icon-info"></i>
              <div v-html="$t('sys_mat007',{value:checkIdArry.length})"></div>
          </div>
          <!-- <el-table @sort-change="sorthandle" :summary-method="getSummaries" show-summary :data="taskDataList" row-key="id" use-virtual border height="750" v-loading="loading" ref="serveTable"
            element-loading-spinner="el-icon-loading" style="width: 100%;" showBodyOverflow="title" :total="model1.total" :page-sizes="pageOption" 
            :page-size="model1.limit" :current-page="model1.page" :pagination-show="true" @selection-change="handleSelectionChange" @row-click="rowSelectChange" @handlePageSize="pageHandle">    -->
          
            <el-table :summary-method="getSummaries" show-summary :data="taskDataList" row-key="id" use-virtual
              border height="700" v-loading="loading" ref="serveTable" element-loading-spinner="el-icon-loading" style="width: 100%;"
              @selection-change="handleSelectionChange" @row-click="rowSelectChange">  
              <el-table-column type="selection" width="55" />
              <el-table-column prop="name" :label="$t('sys_g070')" width="120" />
              <el-table-column prop="pull_group_name" :label="$t('sys_rai088')" minWidth="120" />
              <el-table-column prop="ad_group_name" :label="$t('sys_rai089')" minWidth="120" />
              <el-table-column prop="data_pack_name" :label="$t('sys_rai090')" width="120" />
              <el-table-column prop="ad" show-overflow-tooltip :label="$t('sys_rai091')" minWidth="120" />
              <el-table-column prop="zq_num" :label="$t('sys_rai095')" minWidth="100" />
              <el-table-column prop="qnum" :label="$t('sys_rai092')" width="120" />
              <el-table-column prop="pull_num" :label="$t('sys_rai093')" width="120" />
              <el-table-column prop="avg_num" :label="$t('sys_rai099')" width="120" />
              <el-table-column prop="success_num" :label="$t('sys_rai094')" width="120" />
              <el-table-column prop="status" :label="$t('sys_rai001')" width="100">
                <template slot="header">
                  <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command)">
                    <span style="color:#909399" :class="[model1.status?'dropdown_title':'']"> {{ $t('sys_l059') }}
                        <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :class="{'dropdown_selected':idx==model1.status}" v-for="(item,idx) in statusOptions" :key="idx" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template slot-scope="scope">
                  <el-tag size="small" :type="scope.row.status==1?'info':scope.row.status==2?'warning':scope.row.status==5?'success':'danger'"> {{ statusOptions[scope.row.status]||"-" }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="itime" :label="$t('sys_c008')" minWidth="160">
                  <template slot-scope="scope">
                    <div>{{scope.row.itime>0?$baseFun.resetTime(scope.row.itime*1000):"-" }}</div>
                  </template>
              </el-table-column>
              <el-table-column fixed="right" :label="$t('sys_c010')" width="180">
                  <template slot-scope="scope">
                    <!-- <el-button :disabled="checkIdArry.length>0" type="primary" size="mini" @click.stop="exportText(scope.row)">{{ $t('sys_rai079') }}</el-button> -->
                    <el-button :disabled="checkIdArry.length>0" type="primary" plain size="mini" @click.stop="scamperBtn(scope.row)">{{ $t('sys_rai098') }}</el-button>
                    <el-button :disabled="checkIdArry.length>0" type="success" plain size="mini" @click.stop="goTaskDetail(scope.row)">{{ $t('sys_rai080') }}</el-button>
                  </template>
              </el-table-column>
          </el-table>
          <div class="layui_page">
              <el-pagination background :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :current-page.sync="model1.page" 
              :page-size="model1.limit" layout="total, sizes, prev, pager, next, jumper" :total="model1.total"  
              @size-change="handleSize" @current-change="handlePage" />
          </div>
          <!-- <el-pagination :total="model1.total" style="display: none;" /> -->
        </div>
    </div>
  </template>
  <script>
  import { successTips } from '@/utils/index'
  import { groupsendmsg,getpullgrouptasklist,dobatchdelpullgrouptask,dobatchstoppullgrouptask,dobatchclosepullgrouptask,getsysconfig,upsysconfig} from '@/api/task'
  export default {
    data() {
      return {
        model1: {
          page: 1,
          limit: 100,
          total: 0,
          status:"",
          task_name: "",
        },
        loading:false,
        auto_scamper:false,
        checkIdArry:[],
        taskDataList:[],
        showNum:[10]
      }
    },
    computed: {
      groupRules() {
        return {
          group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
          plant_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'blure' }],
          set_account: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat063')}), trigger: 'blure' }],
          set_name: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_mat062')}), trigger: 'blure' }],
          set_pwd: [{ required: true, message: this.$t('sys_mat061',{value:this.$t('sys_g031')}), trigger: 'blure' }]
        }
      },
      raisOptions(){
        return ["",this.$t('sys_rai002'),this.$t('sys_rai003'),this.$t('sys_rai004')]
      },
      statusOptions(){
        return ["",this.$t('sys_l071'),this.$t('sys_l072'),this.$t('sys_g068'),this.$t('sys_rai078'),this.$t('sys_mat047')]
      }
    },
    created() {
      this.initGroupConfig();
      this.getPullTaskList();
    },
    methods: {
        resetQuery(){
          this.model1.status="";
          this.model1.task_name="";
          this.getPullTaskList(1);
          this.$refs.serveTable.clearSelection();
        },
        handleNewwork(status) {
          this.model1.status = status;
          this.getPullTaskList(1);
        },
        getPullTaskList(num){
          this.loading=true;
          this.taskDataList=[];
          this.model1.page=num?num:this.model1.page;
          let params = {
            page:this.model1.page,
            limit:this.model1.limit,
            name:this.model1.task_name,
            status:this.model1.status||-1
          }
          getpullgrouptasklist(params).then(res=>{
            this.loading=false;
            this.model1.total = res.data.total;
            this.taskDataList = res.data.list||[];
            this.$nextTick(()=>{
              if (this.$refs.serveTable) {
                this.$refs.serveTable.doLayout(); 
              }
            })
          })
        },
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            const values = data.map(item => Number(item[column.property]));
            if (index === 0) {
              sums[index] = this.$t('sys_c125');
              return;
            }else if(this.showNum.indexOf(index) > -1){
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev+curr;
                } else {
                  return prev;
                }
              },0);
            }else{
              sums[index] = '--';	
            }
          });
          return sums;
        },
        async initGroupConfig(){
          const {data:{auto_pull_group}} = await getsysconfig();
          this.auto_scamper = auto_pull_group==1?true:false;
        },
        async handleScamper(e){
          const {code} = await upsysconfig({auto_pull_group:this.auto_scamper?1:0});
          if (code !=0 ) return;
          this.auto_scamper = e;
          successTips(this)
        },
        goTaskDetail(row){
          this.$router.push({path:'/wa-group-detail',query:{params:row,task_id:row.id}});
        },
        scamperBtn(row){
          let that = this;
          that.$confirm(that.$t('sys_rai046',{value:that.$t('sys_rai098')}), that.$t('sys_l013'), {
              type: 'warning',
              confirmButtonText: that.$t('sys_c024'),
              cancelButtonText: that.$t('sys_c023'),
              beforeClose: function (action, instance, done) {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    groupsendmsg({ids:[row.id]}).then(res=>{
                      instance.confirmButtonLoading = false;
                      if (res.code != 0) return;
                        that.getPullTaskList(1);
                        successTips(that)
                        done();
                      })
                  } else {
                    done();
                  }
              }
          }).catch(() => {
            that.$message({ type: 'info', message: that.$t('sys_c048') });
          })
        },
        handleSelectionChange(row) {
          this.checkIdArry = row.map(item => { return item.id })
        },
        rowSelectChange(row, column, event) {
            let refsElTable = this.$refs.serveTable;
            let findRow = this.checkIdArry.find(item => item == row.id);
            if (findRow) {
              refsElTable.toggleRowSelection(row, false);
              return;
            }
            refsElTable.toggleRowSelection(row,true);
        },
        // rowSelectChange(row) {
        //   let tableCell = this.$refs.serveTable;
        //   if (this.checkIdArry.includes(row.id)) {
        //     tableCell.toggleRowSelection([{row:row,selected:false}]);
        //     return;
        //   }
        //   tableCell.toggleRowSelection([{row:row,selected:true}]);
        // },
        sorthandle({ column, prop, order }) {
          console.log(column);
        },
        sizeHandle(val){
          this.model1.limit=val;
          this.getPullTaskList();
        },
        handleSize(size){
          this.model1.limit = size;
          this.getPullTaskList(1);
        },
        handlePage(page){
          this.model1.page = page;
          this.getPullTaskList();
        },
        // pageHandle({page, size}){
        //   this.loading = true;
        //   if (this.model1.limit != size) {
        //     this.model1.page = 1;
        //   }else{
        //     this.model1.page = page;
        //   }
        //   this.model1.limit = size;
        //   this.getPullTaskList();
        // },
        jumpCreatTask(row,idx){
          this.$router.push({path:"/wa-add-group",query:{id:5555}})
        },
        handleGroupBtn(type) {
            let that = this;
            let tipsText = type==1?that.$t('sys_rai081'):type==2?that.$t('sys_rai082'):type==2?that.$t('sys_rai097'):that.$t('sys_q111')
            that.$confirm(that.$t('sys_rai046',{value:tipsText}), that.$t('sys_l013'), {
              type: 'warning',
              confirmButtonText: that.$t('sys_c024'),
              cancelButtonText: that.$t('sys_c023'),
              beforeClose: function (action, instance, done) {
                  if (action === 'confirm') {
                    let reqApi = type==1?dobatchclosepullgrouptask:type==2?dobatchdelpullgrouptask:type==3?dobatchstoppullgrouptask:groupsendmsg;
                    instance.confirmButtonLoading = true;
                    reqApi({ids:that.checkIdArry}).then(res=>{
                      instance.confirmButtonLoading = false;
                      if (res.code != 0) return;
                      that.getPullTaskList(1);
                      successTips(that)
                      done();
                    })
                  } else {
                    done();
                  }
              }
          }).catch(() => {
              that.$message({ type: 'info', message: that.$t('sys_c048') });
          })
        },
        exportText(row){
          doouttaskexcel({id:row.id}).then(res=>{
            if (res.code != 0) return;
              this.getPullTaskList(1);
              window.location.href = res.data.url
          })
        }
    }
  }
  </script>
  <style scoped lang="scss">
  .continer_main {
    width: 100%;
  }
  </style>
    