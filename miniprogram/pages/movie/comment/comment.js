// pages/movie/comment/comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    content: "",
    score: 5,
    images: [],
    fileIds: [],
    movieid: -1
  },

  onContentChange: function(event){
    this.setData({
      content: event.detail
    })
  },

  onScoreChange: function(event){
    this.setData({
      score: event.detail
    })
  },

  uploadImg: function(){
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      }
    })
  },

  submit: function(){
    wx.showLoading({
      title: '评论中',
    })
    //上传图片到云存储
    let promiseArr = [];
    
    for(let i=0; i<this.data.images.length; i++){
      promiseArr.push(new Promise((resolve, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime()+suffix,
          filePath: item, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIds: this.data.fileIds.concat(res.fileID)
          });
          resolve();
        }).catch(error => {
          // handle error
        })
      }));
    }

    //等到promiseArr执行完后再执行
    Promise.all(promiseArr).then(res =>{
      //插入数据库
      db.collection('comment').add({
        data:{
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieid,
          fileIds: this.data.fileIds
        }
      }).then(res =>{
        wx.hideLoading();
        wx.showToast({
          title: '评价成功',
        })
      }).catch(err =>{
        wx.hideLoading();
        wx.showToast({
          title: '评论失败',
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.movieid);
    this.setData({
      movieid: options.movieid
    })
    wx.cloud.callFunction({
      name: "getDetail",
      data: {
        movieid: options.movieid
      }
    }).then(res =>{
      console.log("1");
      console.log(res.result);
      this.setData({
        detail: JSON.parse(res.result)
      });
    }).catch(err =>{
      console.error(err);
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})