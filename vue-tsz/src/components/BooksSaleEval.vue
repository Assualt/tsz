<template>
  <div>
    <div class="form-group" style="height:30px">
      <div class="col-md-4">
        <label for="saleType">请选择类别</label>
        <select id="saleType" class="from-control" v-model="saleTypeChoice" @change="selectBar">
          <option v-for="(data,index) in saleType" :key="index">{{data}}</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="saleTime">请选择年份</label>
        <select id="saleTime" class="from-control" v-model="saleTypeYear">
          <option v-for="(data,index) in dateRangeYear" :key="index">{{data}}</option>
        </select>
      </div>
    </div>
    <div id="saleEval">asdas</div>
  </div>
</template>

<script>
// 引入基本模板,按需加载
let echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入柱状图
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/markLine");
export default {
  name: "saleEval",
  data() {
    return {
      saleoptions: {},
      showType: 0,
      dateRangeYear:["今年","去年","2017年","2016年"],
      saleType: ["销售量/金额", "图书种类"],
      saleTypeChoice: "销售量/金额",
      saleTypeYear:"今年",
      options:{}
    };
  },
  methods: {
    drawBar() {
      // 基于dom，初始化echarts实例
      let barGraph = echarts.init(document.getElementById("saleEval"));
      barGraph.clear();
      barGraph.setOption(this.saleoptions);
    },
    async initOptionsData() {
      const RetData = await this.axios_get("static/json/sale_options.json", []);
      if(RetData == false){
        console.log("Request Error");
      }else{
        const data = RetData.data;
        const self = this;
        data.forEach(perChart=>{
          self.options[perChart.name] = perChart.options;
        });
        this.saleoptions = self.options["sale_history"];
      }
    },
    selectBar(){
      if(this.saleTypeChoice == "销售量/金额"){
        this.saleoptions = this.options["sale_history"];
      }else if(this.saleTypeChoice == "图书种类"){
        this.saleoptions = this.options["sale_pie"];
      }
      this.drawBar();
    }
  },
  async created() {
    await this.initOptionsData();
    this.drawBar();
  },
  async mounted() {
  }
};
</script>

<style scoped>
#saleEval {
  width: 685px;
  height: 630px;
}
</style>