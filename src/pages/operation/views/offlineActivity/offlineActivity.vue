<template>
  <div class="offline-activity">
    <div class="main-body">
      <div class="title">线下活动</div>
      <div class="usermanage-table-box">
        <div class="option-btn">
          <div class="option-btn-left">
            <el-button type="primary" @click="addActivity">新增活动</el-button>
          </div>
        </div>
        <div class="table">
          <el-table border v-loading="loading" :data="activityList" style="width: 100%">
            <el-table-column label="序号" align="center">
              <template slot-scope="scope">
                <div>{{page.pageSize*(page.currentPage-1)+(scope.$index+1)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="activityName" align="center" label="活动名称" width="160">
              <template slot-scope="scope">
                <div class="activityName" :title="scope.row.activityName">{{scope.row.activityName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="活动图片" align="center">
              <template slot-scope="scope">
                <img class="coverPic" :src="sourceBaseUrl+scope.row.coverPicId" alt>
              </template>
            </el-table-column>
            <el-table-column prop="companyName" align="center" label="参加活动企业"></el-table-column>
            <el-table-column prop="brandName" align="center" label="参加活动品牌"></el-table-column>
            <el-table-column label="活动有效期" align="center" width="180">
              <template slot-scope="scope">
                <div>{{scope.row.startTime}} - {{scope.row.endTime}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" align="center" label="添加活动时间"></el-table-column>
            <!-- <el-table-column  align="center" label="链接"></el-table-column> -->
            <el-table-column prop="status" align="center" label="状态"></el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[10, 20, 30, 40,50]"
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
      sourceBaseUrl: "",
      activityList: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      loading: true
    };
  },
  created() {
    this.getActivityList();
    let basePath = process.env;
    this.sourceBaseUrl = basePath.sourceBaseUrl;
  },
  components: {},
  methods: {
    addActivity() {
      this.$router.push({
        path: "/offlineActivity/addActivity",
        query: { type: "add" }
      });
    },
    // 获取列表
    getActivityList() {
      this.loading = true;
      this.API.getActivityList({
        limit: this.page.pageSize,
        start: this.page.currentPage
      }).then(res => {
        if (res.success) {
          this.loading = false;
          res.datalist.forEach(item => {
            item.startTime = item.startTime.split(" ")[0];
            item.endTime = item.endTime.split(" ")[0];
            item.gmtCreate = item.gmtCreate.split(" ")[0];
          });
          this.activityList = res.datalist;
          this.page.total = res.totalCount;
        }
      });
    },
    handleEdit(index, row) {
      let id = row.id;
      this.$router.push({
        path: "/offlineActivity/addActivity",
        query: { id: id, type: "edit" }
      });
    },
    handleDelete(index, row) {
      let self = this;
      let params = {
        id: row.id
      };
      this.$confirm(`确认删除${row.activityName}活动吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self.API.deleteActivity(params).then(res => {
          console.log(res);
          if (res.success) {
            self.$message({
              showClose: true,
              type: "success",
              message: "删除成功!"
            });
            self.getActivityList();
          }
        });
      });
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getActivityList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getActivityList();
    }
  }
};
</script>
<style lang='scss' scoped>
.offline-activity {
  padding: 30px;
  .main-body {
    min-height: 860px;
    background: #fff;
    .title{
      font-size: 18px;
      color: #222;
      padding: 15px 30px;
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
        }
      }
      .table {
        margin-top: 30px;
      }
    }
  }
  .pagination-box {
    margin-top: 30px;
  }
  .coverPic {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  .activityName {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>