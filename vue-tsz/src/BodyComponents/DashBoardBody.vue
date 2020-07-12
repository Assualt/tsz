<template>
  <div :class="bExpand? 'dashboard-main-expand':'dashboard-main'">
    <div class="dashboard-welcome">
      <div class="welcome-item">
        <div class="col-md-4 welcome-icon">
          <i class="fa fa-users fa-3x text-info"></i>
        </div>
        <div class="col-md-8 welcome-desc">
          <p>New Visitors</p>
          <p>123213</p>
        </div>
      </div>
      <div class="welcome-item">
        <div class="col-md-4 welcome-icon">
          <i class="fa fa-commenting fa-3x text-primary"></i>
        </div>
        <div class="col-md-8 welcome-desc">
          <p>Messages</p>
          <p>123213</p>
        </div>
      </div>
      <div class="welcome-item">
        <div class="col-md-4 welcome-icon">
          <i class="fa fa-yen fa-3x text-danger"></i>
        </div>
        <div class="col-md-8 welcome-desc">
          <p>Purchases</p>
          <p>123213</p>
        </div>
      </div>
      <div class="welcome-item">
        <div class="col-md-4 welcome-icon">
          <i class="fa fa-shopping-cart fa-3x text-success"></i>
        </div>
        <div class="col-md-8 welcome-desc">
          <p>Shoppings</p>
          <p>123213</p>
        </div>
      </div>
    </div>
    <div class="charts-main" id="charts-main"></div>
    <ul class="charts-detail">
      <li class="charts-detail-item" id="charts-detail-item-1"></li>
      <li class="charts-detail-item" id="charts-detail-item-2"></li>
      <li class="charts-detail-item" id="charts-detail-item-3"></li>
    </ul>
    <div class="panel-list">
      <div class="panel panel-primary panel-1">
        <div class="panel-heading">Panel heading without title</div>
        <!-- <div class="panel-body"/> -->
        <table class="table">
          <thead>
            <tr>
              <th>Order No.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in order_list" :key="index">
              <td>{{item.order_id}}</td>
              <td>¥{{item.order_price}}</td>
              <td>
                <span class="label label-default" v-if="item.order_state == 1">{{item.order_status}}</span>
                <span
                  class="label label-primary"
                  v-else-if="item.order_state == 2"
                >{{item.order_status}}</span>
                <span
                  class="label label-success"
                  v-else-if="item.order_state == 3"
                >{{item.order_status}}</span>
                <span
                  class="label label-info"
                  v-else-if="item.order_state == 4"
                >{{item.order_status}}</span>
                <span
                  class="label label-warning"
                  v-else-if="item.order_state == 5"
                >{{item.order_status}}</span>
                <span
                  class="label label-danger"
                  v-else-if="item.order_state == 6"
                >{{item.order_status}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel panel-info panel-2">
        <div class="panel-heading">ToDo list</div>
        <ul class="list-group">
          <li class="list-group-item">
            <input type="checkbox" />
            Cras justo odio
            <span class="fr fa fa-close"></span>
          </li>
          <li class="list-group-item">
            <input type="checkbox" />
            Dapibus ac facilisis in
            <span class="fr fa fa-close"></span>
          </li>
          <li class="list-group-item">
            <input type="checkbox" />
            Morbi leo risus
            <span class="fr fa fa-close"></span>
          </li>
          <li class="list-group-item">
            <input type="checkbox" />
            Porta ac consectetur ac
            <span class="fr fa fa-close"></span>
          </li>
          <li class="list-group-item">
            <input type="checkbox" />
            Vestibulum at eros
            <span class="fr fa fa-close"></span>
          </li>
        </ul>
        <div class="panel-footer" style="height:20px;line-height:20px;">2 Items</div>
      </div>
    </div>
  </div>
</template>


<script>
let echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入柱状图
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/markLine");

export default {
  name: "DashBoardBody",
  components: {},
  props: {
    bExpand: Boolean
  },
  data() {
    return {
      chartsOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["蒸发量", "降水量", "平均温度"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "水量",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} ml"
            }
          },
          {
            type: "value",
            name: "温度",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value} °C"
            }
          }
        ],
        series: [
          {
            name: "蒸发量",
            type: "bar",
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },
          {
            name: "降水量",
            type: "bar",
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3
            ]
          },
          {
            name: "平均温度",
            type: "line",
            yAxisIndex: 1,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      },
      detail_1: {
        title: {
          text: "某站点用户访问来源",
          subtext: "纯属虚构",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      order_list: [
        {
          order_id: "eeAc9B7d-4cA3-cBbe-A46F-c9487e",
          order_price: "9449.2",
          order_status: "pending",
          order_state: 1
        },
        {
          order_id: "eeAc9B7d-4cA3-cBbe-A46F-c9487e",
          order_price: "9449.2",
          order_status: "Loop",
          order_state: 2
        },
        {
          order_id: "eeAc9B7d-4cA3-cBbe-A46F-c9487e",
          order_price: "944.2",
          order_status: "Primary",
          order_state: 3
        },
        {
          order_id: "eeAc9B7d-4cA3-cBbe-A46F-c9487e",
          order_price: "4249.2",
          order_status: "Info",
          order_state: 4
        },
        {
          order_id: "eeAc9B7d-4cA3-cBbe-A46F-c9487e",
          order_price: "9439.2",
          order_status: "Warning",
          order_state: 5
        },
        {
          order_id: "eeAc32B7d-4cA3-cBbe-A46F-c9487e",
          order_price: "19449.2",
          order_status: "Danger",
          order_state: 6
        }
      ]
    };
  },
  methods: {
    drawMain() {
      // 基于dom，初始化echarts实例
      var barGraph = echarts.init(document.getElementById("charts-main"));
      barGraph.clear();
      barGraph.setOption(this.chartsOptions);
    },
    drawDetail() {
      var barGraph_1 = echarts.init(
        document.getElementById("charts-detail-item-1")
      );
      barGraph_1.clear();
      barGraph_1.setOption(this.detail_1);
      var barGraph_2 = echarts.init(
        document.getElementById("charts-detail-item-2")
      );
      barGraph_2.clear();
      barGraph_2.setOption(this.detail_1);
      var barGraph_3 = echarts.init(
        document.getElementById("charts-detail-item-3")
      );
      barGraph_3.clear();
      barGraph_3.setOption(this.detail_1);
    }
  },
  mounted() {
    this.drawMain();
    this.drawDetail();
  },
  created() {},
  watch: {
    bExpand: {
      handler: function(val, oldval) {
        if (val != null) {
          this.drawMain();
          this.drawDetail();
        }
      }
    }
  }
};
</script>

<style scoped>
.dashboard-main-expand {
  margin: 0 0 0 12%;
  position: absolute;
  top: 120px;
  width: 87%;
  background-color: #f0f2f5;
  padding: 20px 2.4%;
}
.dashboard-main {
  margin: 0 0 0 4%;
  position: absolute;
  top: 120px;
  width: 95%;
  background-color: #f0f2f5;
  padding-top: 20px;
  z-index: -1;
  padding: 20px 2.4%;
}
.dashboard-welcome {
  height: 120px;
  width: auto;
}
.welcome-item {
  height: 100%;
  padding: 10px 10px;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  color: #666;
  background: #fff;
  width: 23%;
  float: left;
  margin: 0 1.33%;
}
.welcome-item:first-child {
  margin-left: 0%;
  margin-right: 1.33%;
}
.welcome-item:last-child {
  margin-right: 0%;
  margin-left: 1.33%;
}
.welcome-icon {
  line-height: 100px;
  text-align: center;
  padding: 10px 0;
}
.welcome-desc {
  height: 100%;
  padding: 0 5px;
  text-align: center;
  line-height: 50px;
}
.welcome-desc p:first-child {
  height: 50%;
  font-weight: bold;
  font-size: 1em;
  margin: 0;
}
i:hover {
  cursor: pointer;
}
.welcome-icon i {
  padding: 5px;
  border-radius: 5%;
}
.welcome-item:first-child > .welcome-icon > i.text-info:hover {
  color: white;
  background-color: #31708f;
}
.welcome-item:nth-child(2) > .welcome-icon > i.text-primary:hover {
  color: white;
  background-color: #337ab7;
}
.welcome-item:nth-child(3) > .welcome-icon > i.text-danger:hover {
  color: white;
  background-color: #a94442;
}
.welcome-item:nth-child(4) > .welcome-icon > i.text-success:hover {
  color: white;
  background-color: #3c763d;
}
.charts-main {
  padding: 0 20px;
  height: 300px;
  /* border: 1px solid red; */
  background: #fff;
  width: 100%;
  margin-top: 20px;
}
.charts-detail {
  margin-top: 20px;
  height: 320px;
}
.charts-detail-item {
  width: 32%;
  margin: 0 1%;
  height: 100%;
  background-color: #fff;
}
.charts-detail-item:first-child {
  margin-left: 0%;
  margin-right: 1%;
}
.charts-detail-item:last-child {
  margin-left: 1%;
  margin-right: 0%;
}
.panel-list {
  margin-top: 20px;
  height: 400px;
  width: 100%;
}
.panel-1 {
  width: 50%;
  height: 350px;
  float: left;
}
.panel-2 {
  margin-left: 6%;
  width: 40%;
  /* height: 300px; */
  float: left;
}
.panel-2 ul li {
  width: 100%;
}
</style>