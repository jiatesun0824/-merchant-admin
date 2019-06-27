<template>
  <div class="user-management">
    <div class="main-body">
      <div class="title">参与活动用户管理</div>
      <div class="usermanage-table-box">
        <div class="option-btn">
          <div class="option-btn-left">
            <el-select
              v-model="companyId"
              clearable
              filterable
              @change="changeCompanyId"
              @clear="clearCompanyId"
              placeholder="请选择厂商"
            >
              <el-option
                v-for="item in comList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
            <el-select
              clearable
              filterable
              v-model="brandId"
              @focus="brandFocus"
              @clear="clearBrandId"
              placeholder="请选择品牌"
            >
              <el-option
                v-for="item in brandList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="searchList">查询</el-button>
          </div>
          <div class="option-btn-right">
            <el-button type="primary" @click="registExportExcel">导出数据</el-button>
          </div>
        </div>
        <div class="table">
          <el-table border v-loading="loading" :data="userList" style="width: 100%">
            <el-table-column prop="date" label="序号" align="center">
              <template slot-scope="scope">
                <div>{{(page.currentPage-1)*page.pageSize+(scope.$index+1)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="nickName"  align="center" label="用户昵称" width="160">
               <template slot-scope="scope">
              <div class="nickName" :title="scope.row.nickName">{{scope.row.nickName?scope.row.nickName:'匿名用户'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
            <el-table-column label="地区" align="center">
               <template slot-scope="scope">
                <div>{{scope.row.provinceCity?scope.row.provinceCity:'未知'}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="companyName" label="厂商" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="预约时间" align="center"></el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[10, 20, 30,40, 50]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      comList: [],
      brandList: [],
      companyId: "",
      brandId: "",
      value: "",
      userList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    };
  },
  created() {
    this.getRegistList();
    this.getRegistCompList();
  },

  components: {},
  methods: {
    // 获取厂商列表
    getRegistCompList() {
      this.API.getRegistCompList().then(res => {
        if (res.success) {
          this.comList = res.obj;
        }
      });
    },
    // 获取品牌商列表
    getRegistBrandList() {
      this.API.getRegistBrandList({ companyId: this.companyId }).then(res => {
        console.log(res);
        if (res.success) {
          this.brandList = res.obj;
        }
      });
    },
    // 厂商id变化
    changeCompanyId() {
      if (this.companyId) {
        this.brandList = [];
        this.brandId = "";
        this.getRegistBrandList();
      }
    },
    // 品牌选择框被点击
    brandFocus() {
      if (!this.companyId) {
        this.$message({
          message: "请先选择厂商",
          type: "warning"
        });
      }
      if (this.companyId && this.brandList.length == 0) {
        this.$message({
          message: "该厂商品牌为空，请重新选择厂商",
          type: "warning"
        });
      }
    },
    // 清除品牌id
    clearBrandId() {
      this.brandId = "";
    },
    // 清除厂商id
    clearCompanyId() {

      this.companyId = "";
      this.brandList = [];
      this.brandId = "";
    },
    // 获取列表
    getRegistList() {
      this.loading = true;
      let params = {
        limit: this.page.pageSize,
        start: this.page.currentPage
      };
      if (this.companyId) {
        params.companyId = this.companyId;
      }
      if (this.brandId) {
        params.brandId = this.brandId;
      }
      this.API.getRegistList(params).then(res => {
        if (res.success) {
          this.loading = false;
          this.userList = res.datalist;
          this.page.total = res.totalCount
        }
      });
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getRegistList();
    },
    // 改变页码
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getRegistList();
    },
    // 搜索
    searchList() {
      this.page.currentPage = 1;
      this.getRegistList();
    },
    // 数据导出
    registExportExcel(){
      let params = {
        limit: this.page.pageSize,
        start: this.page.currentPage
      };
      if (this.companyId) {
        params.companyId = this.companyId;
      }
      if (this.brandId) {
        params.brandId = this.brandId;
      }
      this.API.registExportExcel(params).then(res=>{
        let url = window.URL.createObjectURL(res);
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url;
        link.setAttribute('download', '参与活动用户管理表.xls')
        document.body.appendChild(link)
        link.click()
      })
    }
  }
};
</script>
<style lang='scss' scoped>
.user-management {
  padding: 30px;
  .main-body {
    min-height: 860px;
    background: #fff;
    .title {
      font-size: 18px;
      padding: 15px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }
    .usermanage-table-box {
      padding: 30px;
      .option-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .option-btn-left {
          display: flex;
          .el-select {
            margin-right: 15px;
          }
        }
      }
      .table {
        margin-top: 30px;
      }
    }
  }
  .pagination-box{
    margin-top: 30px;
  }
   .nickName{
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>