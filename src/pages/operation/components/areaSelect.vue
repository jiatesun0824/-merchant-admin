<template>
    <div class="select-area">
        <el-select v-model="provincesVal" placeholder="请选择省" @change="provincesChange">
            <el-option
                    v-for="item in provinces"
                    :key="item.areaCode"
                    :label="item.areaName"
                    :value="item.areaCode">
            </el-option>
        </el-select>
        <el-select v-model="citysVal" placeholder="请选择市" @change="citysChange">
            <el-option
                    v-for="item in citys"
                    :key="item.areaCode"
                    :label="item.areaName"
                    :value="item.areaCode">
            </el-option>
        </el-select>
        <el-select v-model="areasVal" placeholder="请选择区" @change="areasChange">
            <el-option
                    v-for="item in areas"
                    :key="item.areaCode"
                    :label="item.areaName"
                    :value="item.areaCode">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "areaSelect",
        data(){
            return{
                provinces:[],
                citys:[],
                areas:[],
                provincesVal:'',
                citysVal:'',
                areasVal:'',
            }
        },
        created(){
           this.getAreaList(0,0);
        },
        methods:{
            getAreaList(areaCode,type){
                this.API.areaList({areaCode:areaCode}).then(res=>{
                    switch (type){
                        case 0: if(res.success)this.provinces=res.datalist;break;
                        case 1: if(res.success)this.citys=res.datalist;break;
                        case 2: if(res.success)this.areas=res.datalist;break;
                    }
                })
            },
            provincesChange(val){
                val ? this.getAreaList(val,1): '';
                this.$emit('provinceCode',val);
                this.citysVal='';
                this.areasVal='';
            },
            citysChange(val){
                val ? this.getAreaList(val,2):'';
                this.$emit('cityCode',val);
                this.areasVal='';
            },
            areasChange(val){
                val ? this.getAreaList(val,3) : '';
                this.$emit('areaCode',val);
            },
            echoData(provincesVal,citysVal,areasVal){ //回显方法
                this.getAreaList(provincesVal,1);
                this.getAreaList(citysVal,2);
                this.getAreaList(areasVal,3);
                this.provincesVal=provincesVal;
                this.citysVal=citysVal;
                this.areasVal=areasVal;
            },
            reset(){
                this.provincesVal='';
                this.citysVal='';
                this.areasVal='';
            }
        }
    }
</script>

<style scoped lang="scss">
    .select-area{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
  .el-select{
      margin-right: 25px;
      width: 210px;
  }
</style>