<template>
    <div>
        <v-nav :nav="nav"></v-nav>
        <div class="activeUserData">
            <header class="headerT">
                <h1>统计数据</h1>
            </header>
            <div class="dataShow">
                时间区间:<el-date-picker
                        v-model="beginTime"
                        type="datetime"
                        @change="getData"
                        placeholder="选择开始日期时间">
                </el-date-picker>
                <el-date-picker
                        v-model="endTime"
                        type="datetime"
                        @change="getData"
                        placeholder="选择结束日期时间">
                </el-date-picker>

                <line-chart :labels="labels"
                            :reglist="regList"
                            :regsuccesslist="regSuccessList"
                            :cutlist="cutList"
                            ref="vueChart"
                >
                </line-chart>

            </div>

        </div>
    </div>
</template>

<script>
    import {formatDate} from "../../../filters/data";
    import lineChart from './component/statisticalData'

    export default {
        name: 'userdata',
        data() {
            return {
                value4: '',
                selectTime: '',
                regList: [],// 砍价人数
                regSuccessList: [],// 砍价成功人数
                cutList: [],// 砍价人数
                labels: [], // 时间段
                beginTime: '',//  开始时间
                endTime: '',//  结束时间
                getDataShow: {},
                regid: '',
                nav: [
                    {nav: "砍价活动列表", url: "/activelist"},
                    {nav: "统计数据", url: ""}
                ],
            }
        },
        components: {
            lineChart
        },
        mounted() {
            this.$nextTick(() => {
                this.regid = this.$route.params.id;
                this.getData()
            })

        },

        methods: {

            TimeStyle(time) {
                time.valueOf();
                time = formatDate(new Date(time), "yyyy-MM-dd hh:mm:ss");
                return time;
            },
            handlerData(lables,obj){
                let set = new Set(this.labels);
                //处理数据
                let jiaoji = [...new Set([...lables].filter(x => set.has(x)))];
                let array = [];
                this.labels.map((item,index) =>{
                    let flag = jiaoji.some((it, index) =>{return it == item});
                    if (flag){
                        array.push(index);
                    }
                })
                let result = [];
                let count = 0;
                for (let i = 0; i <this.labels.length ; i++) {
                    if (array.some((s,it) =>{return s == i})){
                        result.push(obj[count]);
                        count++;
                    } else{
                        result.push(0);
                    }
                }
                return result;
            },
            getData() {
                this.regList = [];
                this.cutList = [];
                this.regSuccessList = [];
                this.API.statisticalDataShow({
                    actId: this.regid,
                    beginTime: formatDate(new Date(this.beginTime), "yyyy-MM-dd hh:mm:ss"),
                    endTime: formatDate(new Date(this.endTime), "yyyy-MM-dd hh:mm:ss")
                }).then((res) => {
                    let unixDb = new Date(this.beginTime).getTime();
                    let unixDe = new Date(this.endTime).getTime();
                    let str = "";
                    for (let k = unixDb; k <= unixDe;) {
                        str += (new Date(parseInt(k))).format() + ",";
                        k = k + 1 * 60 * 60 * 1000;
                    }
                    this.labels = [...new Set(str.split(','))]
                    if (res.success) {
                        let labels = [];
                        res.obj.regList.map((item, index) => {
                            this.regList.push(Number(item.num))
                            labels.push(item.time)
                        });
                        this.regList = this.handlerData(labels,this.regList);
                        labels = [];
                        res.obj.regSuccessList.map((item, index) => {
                            this.regSuccessList.push(Number(item.num))
                            labels.push(item.time)
                        });
                        this.regSuccessList = this.handlerData(labels,this.regSuccessList);
                        labels = [];
                        res.obj.cutList.map((item, index) => {
                            this.cutList.push(Number(item.num))
                            labels.push(item.time)
                        })
                        this.cutList = this.handlerData(labels,this.cutList);
                        /*this.labels = [...new Set(str.split(','))]*/
                        this.$refs.vueChart.componentsInit(this.regList, this.cutList, this.regSuccessList);
                    }
                })
            }
        },
        created() {
            let actId = this.$route.params.id;
            //获取活动详情
            let form = new FormData();
            form.append('actId', actId);
            this.API.activeInfo(form).then(res => {
                this.beginTime = res.obj.begainTime;
                this.endTime = res.obj.endTime;
                this.getData();
            })
        }
    }

    Date.prototype.format = function () {
        let s = '';
        s += this.getFullYear() + '-'; // 获取年份。
        if ((this.getMonth() + 1) >= 10) {// 获取月份。
            s += (this.getMonth() + 1) + "-";
        } else {
            s += "0" + (this.getMonth() + 1) + "-";
        }
        if (this.getDate() >= 10) {// 获取日。
            s += this.getDate() + " ";
        } else {
            s += "0" + this.getDate() + " ";
        }
        if (this.getHours() >= 10) {// 获取时。
            s += this.getHours();
        } else {
            s += "0" + this.getHours();
        }
        console.log(s, 'sss')
        return (s); // 返回日期。
    };

    function getAllDate(begin, end) {
        let unixDb = begin.getTime();
        let unixDe = end.getTime();
        let str = "";
        for (let k = unixDb; k <= unixDe;) {
            str += (new Date(parseInt(k))).format() + ",";
            k = k + 1 * 60 * 60 * 1000;
            console.log(k, 'kkkkkkkkkkkk')
        }

        return str;
    }

</script>

<style lang="scss" scoped>
    .headerT {
        padding: 20px;
        border-bottom: solid 1px #e8e8e8;
        color: #666;
        h1 {
            font-size: 20px;
        }
    }

    .activeUserData {
        background: #fff;
    }

    .dataShow {
        padding: 20px 40px
    }

</style>
