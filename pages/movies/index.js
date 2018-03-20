// pages/movies/index/index.js

/* 导入网络请求工具类 */
var httpUtil = require('../../utils/httpUtil.js');
/* 导入字符处理工具类 */
var stringUtil = require('../../utils/stringUtil.js');
/* 获取App对象 */
var app = getApp();

Page({

  data: {
    //存储从三个区块的数据
    threeBlockInfo: {
      hot: {},//正在热映
      recent: {},//即将上映
      top250: {} //排行榜
    }
  },

  /**
   * 本页面第一次加载时调用
   */
  onLoad: function (options) {
    //设置页面标题
    wx.setNavigationBarTitle({
      title: '电影排行榜',
    })

    //基本网址
    var baseUrl = app.globalData.baseUrl;
    //起止条数
    var startAndCount = "?start=0&count=7";
    //正在热映网址
    var hotUrl = baseUrl + "/v2/movie/in_theaters" + startAndCount;
    //即将上映网址
    var recentUrl = baseUrl + "/v2/movie/coming_soon" + startAndCount;
    //排行榜数据网址
    var top250Url = baseUrl + "/v2/movie/top250" + startAndCount;

    //获取正在热映电影数据
    httpUtil.requestBlockMovies(hotUrl, "hot", "正在热映", this.processResult);
    //获取即将上映电影数据
    httpUtil.requestBlockMovies(recentUrl, "recent", "即将上映", this.processResult);
    //获取排行版电影数据
    httpUtil.requestBlockMovies(top250Url, "top250", "排行榜", this.processResult);
  },

  /**
   * 获取电影数据的success回调函数，在此处理请求到的数据
   * result 请求结果
   * key 存储结果到哪个key值
   * blockTitle 区块标题
   */
  processResult: function (result, key, blockTitle) {
    console.log(result.subjects)
    //处理电影名称过长的问题，截取前8位
    stringUtil.processTitle(result.subjects, 8);

    //将处理过的结果放入threeBlockInfo中
    this.data.threeBlockInfo[key] = {
      blockTitle: blockTitle,
      blockMovies: result
    }

    //更新threeBlockInfo数据
    this.setData({
      threeBlockInfo: this.data.threeBlockInfo
    })
  }
})