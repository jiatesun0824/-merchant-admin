import { fetch, formPost, exportData, exportExcel } from "../utils/request";
const basePath = process.env;
export default {
  /**--------------------装修报价管理-------------------------**/
  showQuoted(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/company/shop/check`;
    return fetch(url, params, "get");
  },
  //装修报价列表
  getQuotedPrice(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/manage/list`;
    return fetch(url, params, "get");
  },
  //装修报价详情
  getQuotedPriceDetail(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/detail`;
    return fetch(url, params, "get");
  },
  //装修报价 编辑
  updateQuotedPrice(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/plan/edit`;
    return fetch(url, params, "get");
  },
  //全屋报价 列表
  getCompanyPrice(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/company/price/list`;
    return fetch(url, params, "get");
  },
  //全屋报价 编辑
  updateCompanyPrice(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/company/price/edit`;
    return fetch(url, params, "post");
  },
  //产品清单
  getPlanProducts(params) {
    const url =
      basePath.systemUrl + `/v1/planQuotedPrice/company/plan/products`;
    return fetch(url, params, "get");
  },
  //方案详情 预览图片接口
  reViewPlanImges(params) {
    let url = basePath.baseUrl + `/v1/designplan/getRederPic`;
    return fetch(url, params, "get");
  },
  getHouse(params) {
    //获取空间类型
    const url = basePath.baseUrl + `/v1/dictionary/group/type/house`;
    return fetch(url, params, "get");
  },
  getStyle(params) {
    //获取风格
    const url = basePath.baseUrl + `/v1/product/base/style/plan/list`;
    return fetch(url, params, "get");
  },
  //方案的报价接口
  quoted(params) {
    const url = basePath.systemUrl + `/v1/planQuotedPrice/company/quoted`;
    return fetch(url, params, "post");
  },
  obtainCompanyShop(params) {
    //增加获取公司下所有的店铺(用户数据接口中使用)
    const url = basePath.systemUrl + "/v1/company/shop/obtainCompanyShop";
    return fetch(url, params, "get");
  },
  /**--------------------方案库-------------------------**/
  // 设计师列表
  getDesignerList(params) {
    const url = basePath.baseUrl + "/v1/designplan/getDesignerList";
    return fetch(url, params, "get");
  },
  // 全屋设计师列表
  getDesignerListByFullHouse(params) {
    const url = basePath.baseUrl + "/v1/fullHouse/getFullHouseDesignerList";
    return fetch(url, params, "get");
  },
  // 导出智能单空间方案
  exportListExcelByOnekey(params) {
    const url = basePath.baseUrl + "/v1/designplan/onekey/exportListExcel";
    return exportData(url, params, "get");
  },
  // 导出智能全屋方案
  exportListExcelByFullHouse(params) {
    const url = basePath.baseUrl + "/v1/fullHouse/list/exporListFullHouse";
    return exportData(url, params, "get");
  },
  // 导出普通方案
  getDesignerListByCommon(params) {
    const url = basePath.baseUrl + "/v1/designplan/common/exportListExcel";
    return exportData(url, params, "get");
  }
};
