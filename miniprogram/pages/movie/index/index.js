// pages/movie/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: []
  },

  getMovieList: function(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "movielist",
      data: {
        start: this.data.movies.length,
        count: 10
      }
    }).then(res => {
      this.setData({
        movies: this.data.movies.concat(JSON.parse(res.result).subjects)
      });
      wx.hideLoading();
      console.log(res);
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });
  },

  gotocomment: function(event){
    console.log(event.target.dataset.movieid);
    wx.navigateTo({
      url: '../comment/comment?movieid='+event.target.dataset.movieid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})