<template>
  <div class="main_left">
    <div class="person_img">
      <img src="#" width="200" height="200" class="img-thumbnail" alt="未能加载正常图片" />
      <div class="person_img_common">
        <label for="Niki_name">姓名:</label>
        <p id="Niki_name">
          <a href="#">个人姓名</a>
        </p>
      </div>
      <div class="person_img_common">
        <label for="Niki_school">大学:</label>
        <p id="Niki_school">xxx大学</p>
      </div>
      <div class="person_img_common">
        <label>联系:</label>
        <p>www.baidu.com</p>
      </div>
    </div>
    <div class="person_basic">
      <h4>个人简介</h4>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;这里
        <a href="http://www.cqjtu.edu.cn">xxx大学</a>简短介绍
        <a href="#">...了解更多</a>
      </p>
    </div>
    <div class="person_details">
      <h4>功能列表</h4>
      <ul class="fl more_list">
        <li :class="[currentState == 1 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(1)">基本资料</a>
        </li>
        <li :class="[currentState == 2 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(2)">图书管理</a>
        </li>
        <li :class="[currentState == 3 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(3)">收货地址</a>
        </li>
        <li :class="[currentState == 4 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(4)">图书售卖记录</a>
        </li>
        <li :class="[currentState == 5 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(5)">图书买入</a>
        </li>
        <li :class="[currentState == 6 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(6)">日志记录</a>
        </li>
        <li :class="[currentState == 7 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(7)">收益评估</a>
        </li>
        <li :class="[currentState == 8 ? 'more_list_li_active':'disabled']">
          <a class="hvr-grow" @click="clickTo(8)">修改密码</a>
        </li>
        <li>
          <a href="#" @click="ExitStatusInfo(false)">退出登录</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoiginLeft",
  data() {
    return {
      currentState: 0
    };
  },
  methods: {
    clickTo: function(index) {},
    ExitStatusInfo: function(ExitOK) {}
  }
};
</script>

<style scoped>
.main_left {
  width: 25%;
  /*border: 1px solid red ;*/
  height: 100%;
  background: white;
  margin-right: 10px;
}
.person_img {
  width: 100%;
  height: 40%;
  /*border: 1px solid red ;*/
  text-align: center;
  padding: 8% 3%;
  margin-bottom: 5px;
}
.person_img_common {
  width: 100%;
  height: 30px;
  text-align: center;
  padding: 0px 10%;
  margin-top: 5px;

  display: flex;
}
.person_img_common p {
  margin-left: 15px;
  margin-bottom: 0px;
}

.person_basic {
  border-top: solid 5px rgb(245, 245, 245);
  margin-top: 3px;
  width: 100%;
  height: 20%;
  /*border: 1px solid red ;*/
  border-bottom: 4px solid rgb(245, 245, 245);
}
.person_basic h4 {
  padding-left: 4px;
  padding-bottom: 3px;
  border-bottom: 1px solid #dedede;
}
.person_basic p {
  padding: 3px 8px;
  font-size: 1em;
  font-family: 微软雅黑;
}

.person_details {
  width: 100%;
  height: 50%;
  /*border: 1px solid red ;*/
}
.person_details h4 {
  padding-left: 4px;
  padding-bottom: 3px;
  border-bottom: 1px solid #dedede;
}
.more_list {
  padding-left: 0px;
  width: 100%;
  height: 80%;
}
.more_list li {
  margin-top: 5px;
  text-align: center;
  width: 100%;
}
.more_list li a {
  font-size: 1.2em;
  color: rgba(0, 0, 0, 0.5);
  font-family: Consolas;
}
.more_list li a:hover {
  color: rgb(0, 168, 155);
  cursor: pointer;
}
.more_list_li_active {
  background: #cdcdcd;
  opacity: 0.7;
}
</style>
