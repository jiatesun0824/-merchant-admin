<template>
<div id="activity">
    <div class="main">
        <!--<div class="titles">产品替换</div>-->
        <div class="mainTop">
            <div class="selRows">
                <div class="selItems miniName">
                    <span class="label">请选择小程序：</span>
                    <el-select v-model="miniName" placeholder="请选择" @change="miniSelect" filterable>
                        <el-option
                                v-for="item in miniProList"
                                :value="item.miniProName">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-tabs v-model="activeName" style="padding-left: 15px; ">
                <el-tab-pane  v-if="isReplace" label="产品替换" name="first" ></el-tab-pane>
            </el-tabs>
            <div >
                <div class="radio">
                    <span class="label">日期：</span>
                    <el-radio-group v-model="radios">
                        <el-radio-button @click.native.prevent="dataChange('昨天')" label="昨天"></el-radio-button>
                        <el-radio-button @click.native.prevent="dataChange('今天')"label="今天"></el-radio-button>
                        <el-radio-button @click.native.prevent="dataChange('7日')"label="7日"></el-radio-button>
                        <el-radio-button @click.native.prevent="dataChange('30日')"label="30日"></el-radio-button>
                        <el-radio-button @click.native.prevent="dataChange('每月')"label="每月"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>

        </div>


        <div class="mainBody">
                <div class="dataTable">
                    <span class="label">汇总(合计)：</span>
                    <div class="tableDataFrame" style=" width:300px">
                        <el-table
                                :data="summarizeDataList"
                                :header-cell-style="rowStyle"
                                @selection-change="handleSelectionChange"
                                style="padding-top:20px"
                                element-loading-text="拼命加载中"
                                element-loading-spinner="el-icon-loading"
                                element-loading-background="rgba(255, 255, 255, 0.8)"
                                tooltip-effect="dark">
                            <el-table-column prop="feedbackTxt" label="产品替换人数"  width="150px">
                                <template slot-scope="scope">{{ scope.row.allReplaceUserCount }}</template>
                            </el-table-column>
                            <el-table-column prop="states" label="产品替换次数" width="150px">
                                <template slot-scope="scope">{{ scope.row.allReplaceCount }}</template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            <v-chart :options="option"/>

            <div class="dataTable">
                <div class="listTitle" style="color: red;text-align: left; font-size: 12px" >*&nbsp;  产品替换次数：产品替换并进行渲染的次数</div>
                <div class="listTitle">数据明细
                    <div class="right">
                        <el-button @click="handleDownload" size="small" type="primary" :disabled="false">导出Excel</el-button>
                    </div>
                </div>
                <div class="tableDataFrame">
                    <el-table
                            :data="detailDataList"
                            :header-cell-style="rowStyle"
                            @selection-change="handleSelectionChange"
                            style="padding-top:20px"
                            element-loading-text="拼命加载中"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgba(255, 255, 255, 0.8)"
                            tooltip-effect="dark">
                        <!--<el-table-column type="selection">
                        </el-table-column>
                        <el-table-column  type="index" width="50px" label="序号">
                        </el-table-column>-->
                        <el-table-column prop="time" label="时间">
                            <template slot-scope="scope">{{ scope.row.date }}</template>
                        </el-table-column>
                        <el-table-column prop="states" label="产品替换人数">
                            <template slot-scope="scope">{{ scope.row.productReplaceUserCount }}</template>
                        </el-table-column>
                        <el-table-column prop="comment" label="产品替换次数" >
                            <template slot-scope="scope">{{ scope.row.productReplaceCount }}</template>
                        </el-table-column>
                    </el-table>
                    <div class="pageCount">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="listPage"
                                :page-sizes="[10, 20, 30, 40]"
                                :page-size="getList.limit"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import qs from 'qs'
    export default {
        name:'activity',
        data() {
            return {
                //miniName:'诺克照明',//企业小程序名称
                //appId:'wxe24ed743feb9c17f',//诺克照明AppId
                miniName:'',//企业小程序名称
                appId:'',//诺克照明AppId

                activeName: "first",
                isReplace: true,

                radios:'昨天',

                summarizeDataList:[],//数据汇总
                detailDataList:[],//数据明细
                miniProList:[],//企业小程序列表
                multipleSelection:[],

                //列表查询
                queryList: {
                    dateType:'',//时间类型(以小时为单位0，以天为单位1)
                    appId: '', // 企业小程序AppId
                    page: 1, // 页码
                    limit: 10 // 每页条数
                },
                listPage:1,//当前页
                totalCount:0,

                option: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        data:[]
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'产品替换次数',
                            type:'line',
                            data:[]
                        },
                    ]
                },
            }
        },
        mounted(){
            this.miniName=sessionStorage.getItem('miniName') || '诺克照明';
            this.appId=sessionStorage.getItem('appId') || 'wxe24ed743feb9c17f';
            this.getCompanyMiniPro();
            this.getReplaceSum();
            this.getAll();
            this.getList();
        },
        methods: {
            rowStyle({ row, rowIndex}) {
                if (rowIndex === 0) {
                    return{height: '30px!important',background:'#f5f5f5',color: '#666',lineHeight:'80px!important'}
                }
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },

            // 导出excel 表
            handleDownload() {
                require.ensure([], () => {
                    if (!this.multipleSelection.length){
                        this.$alert('无数据供导出！','提示',{
                            confirmButtonText: '确定',
                        });
                    }else{
                        const { export_json_to_excel } = require('@/vendor/Export2Excel');
                        const tHeader = ['时间', '产品替换人数','产品替换次数'];
                        const filterVal = ['date', 'productReplaceUserCount','productReplaceCount'];
                        const list = this.multipleSelection;
                        //alert(JSON.stringify(list));
                        const data = this.formatJson(filterVal, list);
                        //alert(JSON.stringify(data));
                        export_json_to_excel(tHeader, data, '产品替换');
                    }
                });
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },

            // 分页模块f
            handleSizeChange: function (size) {
                //this.query.limit = size
                this.queryList.limit = size;
                this.queryList.start=1;

                //重新请求前将上次数据置零
                this.summarizeDataList=[];
                this.detailDataList=[];//数据明细
                this.getReplaceSum();
                this.getList();
                this.listPage=1;
            },
            handleCurrentChange: function (currentPage) {
                //this.query.page = currentPage;
                this.queryList.start = currentPage;
                this.loading = true;

                //重新请求前将上次数据置零
                this.summarizeDataList=[];
                this.detailDataList=[];//数据明细
                this.getReplaceSum();
                this.getList();
            },

            getExcel(){
                let flag=this.checkAppId(this.appId);
                if (!flag){
                    this.API.getProductReplaceList2({
                            appId:this.appId,
                            dateType:this.radios,
                            start:1,
                            limit:9999
                        }
                    ).then((res)=>{
                        if(res.success){
                            this.multipleSelection=res.datalist;
                        }
                    })
                }
            },

            //数据查询
            getList(){
                let flag=this.checkAppId(this.appId);
                if (!flag){
                    this.API.getProductReplaceList2({
                            appId:this.appId,
                            dateType:this.radios,
                            start:this.queryList.start,
                            limit:this.queryList.limit
                        }
                    ).then((res)=>{
                        if(res.success){
                            this.totalCount=res.totalCount;
                            this.detailDataList = res.datalist;
                        }
                    })
                }
            },

            getAll(){
                let flag=this.checkAppId(this.appId);
                if (!flag){
                    this.API.getProductReplaceAll2({
                            appId:this.appId,
                            dateType:this.radios
                        }
                    ).then((res)=>{
                        if(res.success){
                            this.option.legend.data=['产品替换次数'];
                            for(var i = 0;i<res.datalist.length;i++){
                                this.option.xAxis.data.push(res.datalist[i].date);
                                this.option.series[0].data.push(res.datalist[i].productReplaceCount);
                            }
                        }
                    })
                }
            },

            //时间改变
            dataChange(dataType){
                this.radios=dataType;
                //重新请求前将上次数据置零
                this.option.legend.data=[];
                this.option.xAxis.data=[];
                this.option.series[0].data=[];
                this.summarizeDataList=[];
                this.detailDataList=[];//数据明细
                this.totalCount=0;
                this.multipleSelection=[];
                this.getExcel();
                this.getReplaceSum();
                this.getAll();
                this.getList();
            },

            getReplaceSum(){
                let flag=this.checkAppId(this.appId);
                if (!flag){
                    this.API.getProductReplaceSum2({
                        appId:this.appId,
                        dateType:this.radios
                    }).then((res)=>{
                        if(res.success){
                            this.summarizeDataList=res.datalist;
                        }else{
                            this.$message({
                                type: "info",
                                message: res.message
                            });
                        }
                    })
                }
            },

            miniSelect(val){
                this.miniProList.map(res=>{
                    if(res.miniProName==val){
                        this.appId=res.appId;
                    }
                });
                sessionStorage.setItem('miniName',val);
                sessionStorage.setItem('appId',this.appId);
                //重新请求前将上次数据置零
                this.activeName = "first";
                this.radios="昨天";
                this.option.xAxis.data=[];
                this.option.series[0].data=[];
                this.summarizeDataList=[];
                this.detailDataList=[];//数据明细
                this.totalCount=0;
                this.multipleSelection=[];
                this.getExcel();
                this.getReplaceSum();
                this.getAll();
                this.getList();
            },

            //获取小程序列表
            getCompanyMiniPro(){
                this.API.getMiniList({}).then((res) => {
                    if (res.success) {
                        this.miniProList = res.datalist;
                    }
                })
            },

            checkAppId(appId){
                if(appId ===''){
                    this.$message({
                        type: "warning",
                        message: "请选择小程序!"
                    });
                    return true;
                }
                return appId ==='';
            },

        }
    }
</script>

<style scoped lang="scss">
    ::-webkit-scrollbar{
        display: none;
    }
    .radio{
        padding-left: 20px;
        box-sizing: border-box;
        padding-bottom: 20px;
    }
    .main {
        width: 100%;
        height: 100%;
        font-size: 16px;
        color: #333333;
        background: #fff;
        .dataTable{
            padding: 0 20px;
            background: #fff;
        }
        .chart{
            padding: 20px;
            background: #fff;
        }
        .mainTop {
            width: 100%;
            background-color: #ffffff;
            border-radius: 2px;
            margin: 0 !important;
            .titles {
                height: 55px;
                border-bottom: 1px solid #eaeaea;
                padding: 0 30px;
                line-height: 55px;
                text-align: left;
            }
            .selRows {
                padding: 24px 30px;
                height: 80px;
                .submitBtn {
                    height: 32px;
                    line-height: 32px;
                    box-sizing: border-box;
                    background-color: #3399ff;
                    border-radius: 4px;
                    width: 64px;
                    float: left;
                    color: #fff;
                    font-size: 14px;
                    cursor: pointer;
                    margin-left: 20px;
                }
                .selItems {
                    height: 32px;
                    line-height: 32px;
                    box-sizing: border-box;
                    margin-right: 48px;
                    position: relative;
                    float: left;
                    .label {
                        text-align: right;
                        font-size: 14px;
                        height: 32px;
                        position: absolute;
                        left: -10Px;
                        top: 0;
                    }
                    .inputs {
                        display: block;
                        width: 200px;
                        height: 32px;
                        line-height: 32px;
                        box-sizing: border-box;
                    }
                    .el-select {
                        height: 32px;
                        line-height: 32px;
                    }
                }
                .miniName {
                    width: 262px;
                    padding-left: 150px;
                    label {
                        width: 150px;
                    }
                    .inputs {
                        background-color: #ffffff;
                        padding-left: 30px;
                        border-radius: 4px;
                        input {
                            padding-right: 40px;
                            display: block;
                            width: 100%;
                            height: 100%;
                            font-size: 14px;
                        }
                    }

                }
                .miniName {
                    width: 276px;
                    padding-left: 100px;
                    label {
                        width: 100px;
                    }
                }
            }
            margin-bottom: 20px;
        }
    }
div{
    box-sizing: border-box;
}
.ttspan{
    display: inline-block;
    padding: 0 15px;
}

    .listTitle{
        font-size: 16px;
        color: #333;
        height: 56px;
        text-align: left;
        line-height: 56px;
        background: #fff;
        margin-top: 20px;
        border-bottom: solid 1px #e8e8e8;
        padding-left: 32px;
        position: relative;
        .right{
            @extend .exportExcel
        }
    }
    .exportExcel{
        position: absolute;
        right: 32px;
        top: 0;
        span{
            display: inline-block;
            text-align: center;
            font-size: 14px;
            width: 82px;
            height: 32px;
            line-height: 32px;
            background-color: $theme-color;
            color: #fff;
            border-radius: 4px;
        }
    }

#activity{
    width: 100%;
    height: 100%;
    padding: 20px;
    font-size: 16px;
    color: #333;
    text-align: left;
    overflow-y: scroll;
    .mains{
        width: 100%;
        min-height: 100%;
        background: #fff;
        padding:0 20px;
        .titles{
            width: 100%;
            height: 55px;
            line-height: 55px;
            border-bottom: 1px solid #eaeaea;
        }
        .mainBody{
            padding-top: 30px;
            .rowTOp{
                margin-bottom: 30px;
                .el-form-item{
                    margin: 0;
                    float: right;
                    margin-left: 30px;
                }
            }
        }
    }
    .zzcs{
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2000;
        background: rgba(0,0,0,.7);
        .rows{
            width: 25%;
            padding-top: 50px;
            position: absolute;
            text-align: center;
            background: #fff;
            left: 35%;
            top: 50%;
            height: 205px;
            margin-top: -102.5px;
            border-radius: 5px;
            .titles{
                height: 50px;
                width: 100%;
                border-bottom: 1px solid #eaeaea;
                position: absolute;
                left: 0;
                top: 0;
                font-size: 18px;
                line-height: 50px;
                i{
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    line-height: 50px;
                    cursor: pointer;
                }
            }
            .bodys{
                width: 100%;
                border-bottom: 1px solid #eaeaea;
                padding: 40px 0;
            }
            .btns{
                padding: 15px 20px;
                text-align: right;
                font-size: 17px;
            }
        }
        .formRows{
            min-width: 610px;
            width: 50%;
            position: absolute;
            left: 25%;
            top: 40%;
            padding: 0 20px;
            border-radius: 5px;
            background: #fff;
            height: 318px;
            margin-top: -159px;
            .titles{
                height: 50px;
                width: 100%;
                border-bottom: 1px solid #eaeaea;
                font-size: 18px;
                line-height: 50px;
                margin-bottom: 20px;
                position: relative;
                i{
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    right: -20px;
                    top: 0;
                    line-height: 50px;
                    cursor: pointer;
                    text-align: center;
                }
            }
        }
    }
}

</style>
