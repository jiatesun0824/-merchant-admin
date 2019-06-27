<template>
    <div class="tableList">
        <div class="newAdd">
            <el-button v-show="$route.name!='用户列表'" type="primary" size="medium" round
                @click="$refs.userMangeAdd.toggleDialog(true)" v-if="permission(permissionType+'.add')">新增</el-button>
            <el-button v-show="$route.name!='用户列表'" size="medium" round
                @click="$refs.userManageBatchAdd.toggleDialog(true)" v-if="permission(permissionType+'.add')">批量新增
            </el-button>
            <el-button size="medium" round @click="showBatch(1)">批量设置套餐</el-button>
            <el-button size="medium" round  @click="showBatch(2)">批量设置密码</el-button>
        </div>
        <el-table :data="userdata.datalist" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
            align="center" style="width: 100%;text-align: center" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column width="80" type="index" label="序号">
            </el-table-column>
            <el-table-column prop="companyName" label="所属企业">
            </el-table-column>
            <el-table-column prop="nickName" label="登录名">
                <template slot-scope="scope"><span class="txtSpan"
                        @click="toLink('/userManage/info',{id:scope.row.id,pId:scope.row.companyId,businessType:businessType,page:query.page})">{{scope.row.nickName}}</span></template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号">
            </el-table-column>
            <el-table-column prop="userName" label="昵称">
            </el-table-column>
            <el-table-column prop="accountType" label="账号类型">
            </el-table-column>
            <el-table-column prop="type" label="用户类型">
            </el-table-column>
            <el-table-column prop="failureTime" label="到期时间">
            </el-table-column>
            <el-table-column prop="servicesName" label="套餐名称">
            </el-table-column>
            <el-table-column prop="effectiveTime" label="有效时长">
            </el-table-column>
            <el-table-column width="420" align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" v-if="permission(permissionType+'.update')"
                        @click="toLink('/userManage/edit',{userId:scope.row.id,companyId:scope.row.companyId,userType:scope.row.userType,businessType:businessType||'',page:query.page})">
                        编辑</el-button>
                    <el-button type="text" v-if="permission(permissionType+'.del')" @click="deleteUser(scope.row)">删除
                    </el-button>
                    <el-button type="text" v-if="scope.row.servicesFlag!=1&&permission(permissionType+'.platform.view')"
                        @click="toLink('/userManage/platformSet',{userId:scope.row.id})">平台设置</el-button>
                    <el-button type="text" v-if="scope.row.servicesFlag!=1&&permission(permissionType+'.role.view')"
                        @click="toLink('/userManage/setUser',{userId:scope.row.id})">配置角色</el-button>
                    <el-button type="text"
                        v-if="scope.row.servicesFlag!=1&&permission(permissionType+'.rolegroup.view')"
                        @click="toLink('/userManage/userSetGroup',{userId:scope.row.id,type:scope.row.userType})">配置角色组
                    </el-button>
                    <el-button type="text"
                        v-if="scope.row.servicesFlag==1&&permission(permissionType+'.service.renewal')&&scope.row.servicesId"
                        @click="toPackage(0,scope.row)">套餐续费</el-button>
                    <el-button type="text"
                        v-if="scope.row.servicesName&&scope.row.servicesFlag==1&&permission(permissionType+'.service.upgrade')"
                        @click="toPackage(1,scope.row)">套餐修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <div class="pageFrame">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="page" :page-sizes="[10,20,30,50]" :page-size="query.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="userdata.totalCount">
            </el-pagination>
        </div>
        <packagePay ref="packagePay" @refreshList="resetRefresh"></packagePay>
        <!-- <packageEdit ref="packageEdit" @refreshList="resetRefresh"></packageEdit> -->
        <!--新增-->
        <userMangeAdd ref="userMangeAdd" @refreshList="resetRefresh"></userMangeAdd>
        <!--批量新增-->
        <userManageBatchAdd ref="userManageBatchAdd" @refreshList="resetRefresh"></userManageBatchAdd>
    </div>
</template>

<script>
    import packagePay from './packagePay'
    import packageEdit from './packageEdit'
    import minixs from '@s/minixs/index'
    import userMangeAdd from './userMangeAdd'
    import userManageBatchAdd from './userManageBatchAdd'
    export default {
        name: "userList",
        mixins: [minixs],
        inject: ['reload'],
        props: ['userdata', 'loading', 'showNewAdd', 'page', 'businessType'],
        components: {
            packagePay,
            packageEdit,
            userMangeAdd,
            userManageBatchAdd
        },
        data() {
            return {
                companyId: '',
                idBox: [],
                permissionStr: '',
                pId: '',
                query: {
                    page: 1,
                    limit: 10
                },
            }
        },
        computed: {
            permissionType() {
                switch (this.userMethod) {
                    case 'vendor': //厂商
                        return 'manufacturer.user';
                        break;
                    case 'franchiser': //经销商
                        return 'dealer.user';
                        break;
                    case 'company': //公司
                        return 'company.user';
                        break;
                    default:
                        return 'user.manage';
                        break;
                }
            }
        },
        mounted() {
            console.log('初始化')
        },
        created() {
            this.pId = this.$route.query.id;
            this.businessType = !this.businessType ? this.$route.query.businessType : this.businessType;
        },
        methods: {
            showBatch(type) {
                this.$emit('showBatch', type);
            },
            handleSelectionChange(val) {
                console.log(val, 'child')
               this.$emit('handleSelectionChange', val);
            },
            handleSizeChange(val) {
                this.$emit('sizeChange', val)
            },
            handleCurrentChange(val) {
                this.$emit('pageChange', val)
            },
            reset() {
                this.$emit('pageReset', 1);
            },
            resetRefresh() {
                this.loading = true;
                this.$emit('refresh');
            },
            toPackage(type, item) {
                this.setIsNewAdd(4);
                this.setPackageData(item);
                this.setPayType('4');

                if (type == 0) {
                    this.setDialog({
                        packagePayDialog: true
                    })
                } else {
                    this.setServicelist({
                        vm: this,
                        item: item
                    });
                }
            },
            deleteUser(item) {
                this.idBox = [];
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.idBox.push(item.id);
                    this.API.userDel({
                        ids: this.idBox.join(',')
                    }).then(res => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$emit('refresh');
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped lang="scss">
    .tableList {
        width: 100%;
        height: 100%;
    }

    .newAdd {
        margin-bottom: 20px;
    }

    .pageFrame {
        margin-top: 20px;
        text-align: right;
    }

    .txtSpan {
        display: inline-block;
        cursor: pointer;
        color: #409EFF;
        width: 100%;
    }
</style>