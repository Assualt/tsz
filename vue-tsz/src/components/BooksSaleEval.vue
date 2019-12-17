<template>
  <div id="saleEval">asdas</div>
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
      showType:0
    };
  },
  methods: {
    drawBar(type, options) {
      // 基于dom，初始化echarts实例
      let barGraph = echarts.init(document.getElementById("saleEval"));
      if(type == 1){
        const self = this;
        this.axios.get('static/json/sale_options.json').then(res=>{
          const data = res.data;
          data.forEach((perChart)=>{
            if(this.showType == 0 && perChart.name == "sale_history"){
              self.saleoptions = perChart.options;
              barGraph.setOption(this.saleoptions);
            }else if(this.showType == 1 && perChart.name == "sale_pie"){
              self.saleoptions = perChart.options;
              barGraph.setOption(this.saleoptions)
            }
          });
        }).catch(err=>{
          console.log("error on axios.get" + err);
        });
      }else if(type==2){
        barGraph.setOption(options);
      }
    }
  },
  mounted() {
    this.$nextTick(function (){
      this.drawBar(1,{});
    });
  }
};
</script>

<style scoped>
#saleEval {
  width: 685px;
  height: 700px;
}
</style>