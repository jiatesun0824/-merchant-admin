<template>
    <page>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/userManage/mfrsManage' }">厂商管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="mfrs-content">
            <el-form :label-position="labelPosition" label-width="160px" :model="formParam" ref="ruleForm" :rules="rules">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="企业名称:" prop="companyName">
                            <el-input v-model="formParam.companyName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属行业:">
                            <belongIndustry :linkType="true" @change="industryChange" ref="belongIndustry"></belongIndustry>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="企业可见产品范围:" prop="selectTitle">
                        <produceRange :title="formParam.selectTitle" @change="produceRangeChange" ref="produceRange"></produceRange>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="区域:">
                        <areaSelect @provinceCode="provinceChange" @cityCode="cityChange" @areaCode="areaChange" @streetCode="streetChange" ref="areaSelect"></areaSelect>
                    </el-form-item>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="客服QQ:">
                            <el-input v-model="formParam.companyCustomerQq"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同号:">
                            <el-input v-model="formParam.contractNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="企业网站:">
                            <el-input v-model="formParam.companyUrl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="企业LOGO:">
                            <upload @success="successUpload">
                                <img v-if="uploadData.url" :src="uploadData.url" class="avatar logoImg">
                                <i v-else class="el-icon-plus"></i>
                            </upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="联系人姓名:">
                            <el-input v-model="formParam.contactName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人电话:">
                            <el-input v-model="formParam.phone" maxlength="13"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="经营范围:">
                            <el-input v-model="formParam.businessScope"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="企业标识:">
                            <el-input v-model="formParam.companyIdentify"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="企业详细地址:">
                            <el-input v-model="formParam.companyAddress"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="品牌网站:">
                            <el-input v-model="formParam.companyDomainName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="方案公开提成率:">
                            <el-input v-model="formParam.withdrawRate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="方案是否审核:">
                            <el-select v-model="formParam.isExamine" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="开通小程序客户管理:">
                    <el-radio v-model="formParam.isManage" label="0">是</el-radio>
                    <el-radio v-model="formParam.isManage" label="1">否</el-radio>
                </el-form-item>
                <el-form-item label="企业介绍:">
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="formParam.companyDesc">
                    </el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="formParam.remark">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="btn">
            <el-button type="primary" size="medium" round @click="save">保存</el-button>
            <el-button size="medium" round>重置</el-button>
        </div>
    </page>
</template>

<script>
import {validateAlphone,validateURL,validateUnmber} from '@s/utils/validate'
    export default {
        name: "mfrsAdd",
        data(){
            return{
                labelPosition: 'right',
                uploadData:{},
                radio:'1',
                options:[{
                    name:'是',
                    value:0
                },{
                    name:'否',
                    value:1
                }],
                rules: {
                    companyName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' },
                    ],
                    selectTitle: [
                        { required: true, message: '请选择企业可见范围', trigger: 'blur' },
                    ]
                },
                formParam: {
                    id:this.$route.query.id,
                    selectTitle:'',
                    companyIndustrys:'',// 所属行业
                    productVisibilityRange:'',//企业可见产品范围
                    companyName: '',//企业名称
                    companyCustomerQq: '',//客服QQ
                    provinceCode:'',
                    cityCode:'',
                    areaCode:'',
                    streetCode:'',
                    contactName:'',//联系人姓名
                    contractNumber:'',//合同号
                    contractEffectiveTime:'',//合同生效时间
                    companyUrl:'',//企业网站
                    phone:'',//联系电话
                    businessScope:'',//经营范围
                    companyIdentify:'',//企业标识
                    companyAddress:'',//企业地址
                    companyDomainName:'',//公司品牌网站域名
                    isManage:'0',// 是否开通小程序管理
                    withdrawRate:'',//  方案提成率:0-1之间的小数，小数位后最多5位
                    isExamine:'',//方案是否审核
                    companyDesc:'',//企业介绍
                    remark:'', //备注
                    companyLogo:'', //logo
                    businessType:1
                },
            }
        },
        created(){
            this.API.editComapnyInner({id:this.$route.query.id}).then(res=>{
                if(res.success){
                    for (let key in res.data){
                        this.formParam[key]=res.data[key];
                    }
                    this.uploadData.url=res.data.companyLogoUrl?(this.BASE_URL.sourceBaseUrl+res.data.companyLogoUrl):'';
                    this.formParam.isManage=res.data.isManage.toString();
                    this.$refs.areaSelect.echoData(res.data.provinceCode,res.data.cityCode,res.data.areaCode,res.data.streetCode); //回显
                    let arr=[];
                    res.data.categoryListVOList.map((item,sun)=>{ arr.push(item.categoryName)});
                    this.formParam.selectTitle=arr.join(',');
                    this.$refs.produceRange.echoData(res.data.productVisibilityRange.split(',')); //回显
                    res.data.companyIndustrys?this.$refs.belongIndustry.echoData(res.data.companyIndustrys.split(',')):''; //回显

                }else {
                    this.$message.error(res.message);
                }
            })
        },
        methods:{
            save(){
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if(this.formParam.companyCustomerQq&&!validateUnmber(this.formParam.companyCustomerQq)){
                            this.$message.error('客服QQ输入有误！')
                            return;
                        }
                        if(this.formParam.companyUrl&&!validateURL(this.formParam.companyUrl)){
                            this.$message.error('企业网站无效！')
                            return;
                        }
                        if(this.formParam.phone&&!validateAlphone(this.formParam.phone)){
                            this.$message.error('联系人电话输入有误！')
                            return;
                        }
                        // if(this.formParam.companyDomainName&&!validateURL(this.formParam.companyDomainName)){
                        //     this.$message.error('品牌网站无效！')
                        //     return;
                        // }
                        delete this.formParam['selectTitle'];
                        for (let key in this.formParam){
                            this.formParam[key] ? this.formParam[key] : delete this.formParam[key];
                        }
                        this.formParam['withDistributor']=true; //true: 新增厂商/ false: 新增公司
                        this.formParam['isExamine']=this.formParam.isExamine ? this.formParam.isExamine : 0; //
                        this.API.addComapnyInner(this.formParam).then(res=>{
                            if(res.success){
                                this.$message.success('新增成功！');
                                this.$router.push('/userManage/mfrsManage')
                            }else {
                                this.$message.error(res.message);
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            successUpload(res){
                this.uploadData=res.data;
                this.formParam.companyLogo=res.data.resId;
            },
            produceRangeChange(obj){ //所选的数组id  可见范围
                this.formParam.selectTitle=obj.range.categoryNames;
                this.formParam.productVisibilityRange=obj.range.categoryIds.join(',');
            },
            industryChange(obj){  //
                this.formParam.selectTitle=obj.range.categoryNames;
                this.formParam.companyIndustrys=obj.industry.join(',');
                this.formParam.productVisibilityRange=obj.range.categoryIds.join(',');
            },
            provinceChange(code){
                this.formParam.provinceCode=code;
            },
            cityChange(code){
                this.formParam.cityCode=code;
            },
            areaChange(code){
                this.formParam.areaCode=code;
            },
            streetChange(code){
                this.formParam.streetCode=code;
            },
        }
    }
</script>

<style scoped lang="scss">
    .mfrs-content{
        margin-top: 20px;
    }
    .btn{
        text-align: center;
    }
    .logoImg{
        width: 68px;
        height: 68px;
        border-radius: 4px;
    }
</style>