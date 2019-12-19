<template>
  <div id="app">
    <router-view :universities="AllCityUniversity" :allcities="AllChineseCites"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      AllCityUniversity: [],
      AllChineseCites: {}
    };
  },
  methods:{
    async initUniversities(){
      try{
        const retData = await this.axios_get("static/json/area_university.json",[]);
        this.AllCityUniversity = retData.data;
      }catch(err){
        console.log("init Universities failed " + err);
      }
    },
    async initAllCities(){
      try{
        const retData = await this.axios_get("static/json/chinese_cities.json",[]);
        let CitiesData = retData.data;
        const self = this;
        const AllProvinces = CitiesData["86"];
        for (const Provincecode in AllProvinces) {
          //Province Code: ProvinceName
          const Cities = CitiesData[Provincecode];
          let cities_disticts = [];
          for (const CityCode in Cities) {
            let city_disticts = [];
            for (const DistictCode in CitiesData[CityCode]) {
              city_disticts.push(CitiesData[CityCode][DistictCode]);
              // console.log(Provincecode, AllProvinces[Provincecode], CityCode, Cities[CityCode], DistictCode, CitiesData[CityCode][DistictCode]);
            }
            cities_disticts.push({
              name: Cities[CityCode],
              dis: city_disticts
            });
          }
          self.AllChineseCites[AllProvinces[Provincecode]] = cities_disticts;
        }
      }catch(err){
        console.log("init Universities failed " + err);
      }
    }
  },
  created() {
    this.initUniversities();
    this.initAllCities();
  }
};
</script>

<style>
</style>
