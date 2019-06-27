<template>
  <div class="add-activity">
    <div class="main-body">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/offlineActivity' }">线下活动</el-breadcrumb-item>
          <el-breadcrumb-item>{{typeText}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="form-box">
        <el-form
          ref="ruleForm"
          :rules="rules"
          :label-position="labelPosition"
          :model="activity"
          label-width="200px"
        >
          <el-form-item label="活动名称：" prop="activityName" label-width="200px">
            <el-input v-model="activity.activityName" minlength="1" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label-width="200px" label="选择厂商：" prop="companyId">
            <el-select
              clearable
              filterable
              v-model="activity.companyId"
              @change="changeCompanyId"
              @clear="clearCompanyId"
              placeholder="请选择厂商"
            >
              <el-option
                v-for="item in compList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选择品牌：" prop="brandId" label-width="200px">
            <el-select
              clearable
              filterable
              v-model="activity.brandId"
              @focus="brandFocus"
              placeholder="请选择品牌"
            >
              <el-option
                v-for="item in brandList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传活动背景图：" class="star" label-width="200px">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="coverPicIdSuccess"
              :headers="headerToken"
            >
              <img
                v-if="activity.coverPicId"
                :src="sourceBaseUrl+activity.coverPicId"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="el-form-item__error" v-if="!activity.coverPicId && addFlag">请上传活动背景图</div>
          </el-form-item>
          <el-form-item label="活动时间：" prop="startTime" label-width="200px">
            <el-date-picker
              v-model="date"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="dateChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="未参加活动按钮：" class="activity-btn-img star" label-width="200px">
            <el-upload
              class="btn-normal-upload"
              :action="uploadUrl"
              :show-file-list="false"
              :headers="headerToken"
              :on-success="unjoinPicSuccess"
            >
              <img v-if="unjoinPic" :src="sourceBaseUrl+unjoinPic" class="avatar">
              <i v-else>添加图片</i>
            </el-upload>
            <div class="el-form-item__error" v-if="!activity.unjoinPicId && addFlag">请上传已参加活动按钮图片</div>
          </el-form-item>
          <el-form-item label="已参加活动按钮：" class="activity-btn-img star" label-width="200px">
            <el-upload
              class="btn-normal-upload"
              :action="uploadUrl"
              :headers="headerToken"
              :show-file-list="false"
              :on-success="joinPicSuccess"
            >
              <img v-if="joinPic" :src="sourceBaseUrl+joinPic" class="avatar">
              <i v-else>添加图片</i>
            </el-upload>
            <div class="el-form-item__error" v-if="!activity.joinPicId && addFlag">请上传已参加活动按钮图片</div>
          </el-form-item>
          <el-form-item label="参与人数（假）：" label-width="200px">
            <el-input v-model="activity.selfDefineNum" type="number"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit-btn" @click="submitForm('ruleForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      type: "",
      typeText: "",
      date: [],
      activity: {
        activityName: "",
        companyId: "",
        brandId: "",
        coverPicId: "",
        startTime: "",
        endTime: "",
        unjoinPicId: "",
        joinPicId: "",
        selfDefineNum: ""
      },
      pickerOptions:{
        disabledDate(time){
       
          
          return time.getTime() <= new Date().getTime() -  1000 * 3600 * 24 
        }
      },
      unjoinPic: "",
      joinPic: "",
      headerToken: {
        Authorization: qs.parse(sessionStorage.getItem("loginUser")).token
      },
      uploadUrl: "",
      sourceBaseUrl: "",
      compList: [],
      brandList: [],
      labelPosition: "left",
      addFlag: false,
      rules: {
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "请选择厂商", trigger: ["blur", "change"] }
        ],
        brandId: [
          { required: true, message: "请选择品牌", trigger: ["blur", "change"] }
        ],
        startTime: [
          { required: true, message: "请选择活动日期", trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  created() {
    // 初始化厂商列表
    this.getCompList();
    // 初始化图片路径
    let basePath = process.env;
    this.uploadUrl = basePath.systemUrl + "/v1/act4/underline/uploadPic";
    this.sourceBaseUrl = basePath.sourceBaseUrl;
    // 初始化标题
    this.type = this.$route.query.type;
    console.log(this.type);
    switch (this.type) {
      case "add":
        this.typeText = "新增活动";
        break;
      case "edit":
        this.typeText = "编辑活动";
        let id = this.$route.query.id;
        this.getDetailInfo(id);
        break;
    }
  },
  methods: {
    getDetailInfo(id) {
      this.API.getDetailInfo({ id: id }).then(res => {
        if (res.success) {
          res.obj.startTime = res.obj.startTime.split(" ")[0];
          res.obj.endTime = res.obj.endTime.split(" ")[0];
          this.activity = res.obj;
          this.date.push(res.obj.startTime);
          this.date.push(res.obj.endTime);
          console.log(this.date);
          this.joinPic = res.obj.joinPicPath;
          this.unjoinPic = res.obj.unjoinPicPath;
          this.getBrandList();
        }
      });
    },
    dateChange(date) {
      if (date) {
        this.activity.startTime = date[0];
        this.activity.endTime = date[1];
      } else {
        this.activity.startTime = "";
        this.activity.endTime = "";
      }
    },
    coverPicIdSuccess(e) {
      this.activity.coverPicId = e.data.picPath;
    },
    unjoinPicSuccess(e) {
      this.activity.unjoinPicId = e.data.picId;
      this.unjoinPic = e.data.picPath;
    },
    joinPicSuccess(e) {
      this.activity.joinPicId = e.data.picId;
      this.joinPic = e.data.picPath;
    },
    changeCompanyId(e) {
      if (this.activity.companyId) {
        this.activity.brandList = [];
        this.activity.brandId = "";
        this.getBrandList();
      }
    },
    clearCompanyId() {
      this.brandList = [];
      this.activity.brandId = "";
    },
    brandFocus() {
      if (!this.activity.companyId) {
        this.$message({
          message: "请先选择厂商",
          type: "warning"
        });
      }
      if (this.activity.companyId && this.brandList.length == 0) {
        this.$message({
          message: "该厂商品牌为空，请重新选择厂商",
          type: "warning"
        });
      }
    },
    // 厂商列表
    getCompList() {
      this.API.getCompList().then(res => {
        if (res.success) {
          this.compList = res.obj;
        }
      });
    },
    // 品牌商列表
    getBrandList() {
      this.API.getBrandList({
        companyId: this.activity.companyId
      }).then(res => {
        console.log(res);
        if (res.success) {
          this.brandList = res.obj;
        }
      });
    },
    submitForm(formName) {
      this.addFlag = true;
      if (
        !(
          this.activity.coverPicId &&
          this.activity.joinPicId &&
          this.activity.unjoinPicId
        )
      ) {
        this.$message({
          message: "请填写完整信息",
          type: "warning"
        });
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.type == "add") {
            this.API.addActivity(this.activity).then(res => {
              if (res.success) {
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.$router.push({ path: "/offlineActivity" });
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            this.API.updateInfo(this.activity).then(res => {
              if (res.success) {
                this.$message({
                  message: "编辑成功",
                  type: "success"
                });
                this.$router.push({ path: "/offlineActivity" });
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          }
        } else {
          this.$message({
            message: "请填写完整信息",
            type: "warning"
          });
          return false;
        }
      });
    }
  }
};
</script>
<style lang='scss'>
.add-activity {
  padding: 30px;

  .main-body {
    min-height: 860px;
    background: #fff;
    .title,
    .breadcrumb-box {
      font-size: 18px;
      padding: 15px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }
    .el-breadcrumb__inner a,
    .el-breadcrumb__inner.is-link {
      font-size: 18px;
      color: #222;
      font-weight: normal;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      font-size: 18px;
      color: #222;
      font-weight: normal;
    }
    .form-box {
      margin: 0 auto;
      margin-top: 30px;
      width: 80%;
      .el-input,
      .el-select {
        width: 150px;
      }
      .el-date-editor {
        width: 400px;
      }
      .el-form-item {
        display: flex;
        justify-content: start;
        align-items: center;
      }
      .el-form-item__label {
        font-size: 16px;
      }
    
      .choose-brand {
        margin-left: 80px;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        object-fit: cover;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
        object-fit: cover;
      }

      .btn-normal-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 262px;
        height: 60px;
        .avatar {
          width: 262px;
          height: 60px;
          display: block;
          object-fit: cover;
        }

        i {
          width: 262px;
          height: 60px;
          line-height: 50px;
          text-align: center;
          display: inline-block;
        }
      }
    }
    .el-form-item__content {
      line-height: 60px;
    }
    .submit-btn {
      margin: 80px 0 50px 50px;
    }
    .star {
      position: relative;
      .el-form-item__label {
        padding-left: 8px;
      }
      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -2px;
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>