<template>
    <page class="pageStatistics">
        <div class="pageStatistics-header">
            <div class="pageStatistics-item" style="width: 520px">
                <span>时间区间：</span>
                <el-date-picker
                        v-model="pickTime"
                        type="daterange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        @change="timeChange"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="pageStatistics-item">
                <span>用户来源渠道：</span>
                <el-select v-model="userSource" clearable placeholder="请选择" @change="channelChange">
                    <el-option
                            v-for="item in userOrigin"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type">
                    </el-option>
                </el-select>
            </div>
            <!--<div class="pageStatistics-item" style="line-height: 40px;margin-left: 30px">-->
                <!--<el-radio v-model="radio" label="1">当前页面数据合并</el-radio>-->
            <!--</div>-->
            <div class="excelBtn">
                <el-button type="primary" @click="exportExcel">导出 Excel</el-button>
            </div>
        </div>
        <div class="pageStatistics-list">
            <el-table
                    :data="tableData"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.8)"
                    style="width: 100%"
                    align="center"
            >
                <!--<el-table-column-->
                        <!--type="selection"-->
                        <!--width="55">-->
                <!--</el-table-column>-->
                <el-table-column prop="number" label="编号" align="center"></el-table-column>

                <el-table-column prop="currentPageProperty" label="前置页面" header-align="center" align="center"></el-table-column>
                <el-table-column prop="currentPagePropertyName" label="前置页面名称" header-align="center" align="center"></el-table-column>

                <!--<el-table-column label="当前页面" header-align="center" align="center">-->

                <!--</el-table-column>-->

                <!--<el-table-column label="当前页面名称" header-align="center" align="center">-->

                <!--</el-table-column>-->
                <el-table-column prop="buttonProperty" label="元素" header-align="center" align="center"></el-table-column>

                <el-table-column prop="buttonPropertyName" label="元素名称" header-align="center" align="center"></el-table-column>

                <el-table-column  prop="pv" label="点击次数" header-align="center" align="center"></el-table-column>

                <el-table-column prop="uv" label="点击人数" header-align="center" align="center"></el-table-column>

                <el-table-column
                        label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="$router.push({path:'/dataAnalysis/elementStatistics/detail',query:{buttonProperty:scope.row.buttonProperty,currentPageProperty:scope.row.currentPageProperty} })">详细分析</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="limit"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </page>
</template>

<script>
    import moment from 'moment'
    export default {
        name: "elementStatistics",
        data(){
            return{
                currentPage:1,
                limit:10,
                radio:'1',
                pickTime:[],
                tableData:[],
                userSource:'',
                loading:false,
                userOrigin:[
                    { name:'全部',type:'' },
                    { name:'淘新闻',type:'taoxinwen' },
                    { name:'朋友圈',type:'wenxin' },
                    { name:'三度空间',type:'sandu' },
                    { name:'其他',type:'other' }
                ],
                total:0
            }
        },
        created(){
            this.pickTime[0]=moment(new Date()).subtract(30, 'days').format("YYYY-MM-DD"); //之前一个月的时间
            this.pickTime[1]=moment(new Date()).format("YYYY-MM-DD"); //获取当前的时间
            this.pageList();
        },
        methods:{
            pageList(){
                this.API.elementViewList({
                    startTime:moment(this.pickTime[0]).format("YYYY-MM-DD"),
                    endTime:moment(this.pickTime[1]).format("YYYY-MM-DD"),
                    appId:'wx42e6b214e6cdaed3',
                    channel:this.userSource,
                    page:this.currentPage,
                    limit:this.limit
                }).then(res=>{
                    if(res.success){
                        this.tableData=res.datalist;
                        this.total=res.totalCount;
                    }else {
                        this.$message(res.message);
                    }
                })
            },
            exportExcel(){
                this.API.elementExportDtailListExcel({
                    startTime:moment(this.pickTime[0]).format("YYYY-MM-DD"),
                    endTime:moment(this.pickTime[1]).format("YYYY-MM-DD"),
                    appId:'wx42e6b214e6cdaed3',
                    channel:this.userSource,
                    page:this.currentPage,
                    limit:this.limit
                }).then(res=>{
                    let url=window.URL.createObjectURL(res);
                    let link=document.createElement('a');
                    link.style.display="none";
                    link.href=url;
                    link.setAttribute('download','元素统计详情信息导出.xls');
                    document.body.appendChild(link);
                    link.click();
                })
            },
            channelChange(){
                this.pageList();
            },
            handleSizeChange(val){
                this.limit=val;
                this.pageList();
            },
            handleCurrentChange(val){
                this.currentPage=val;
                this.pageList();
            },
            timeChange(){
                this.currentPage=1;
                this.pageList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .pageStatistics{
        .pageStatistics-header{
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 30px;
            position: relative;
            .excelBtn{
                position: absolute;
                right: 0;
            }
        }
        .pagination{
            text-align: right;
            margin-top: 20px;
        }
    }
</style>