<template>
  <div id="app">
		  <router-view :universities="AllCityUniversity" :allcities="AllChineseCites"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
	data(){
    return{
      AllCityUniversity:[],
	    AllChineseCites:{}
    }
	},
	created () {
		let self = this;
		this.AllCityUniversity = [];
		this.axios.get('http://192.168.0.105:8080/static/json/area_university.json').then(res => {
			self.AllCityUniversity = res.data;
		}).catch(err => {
			console.log("Request Error." + err);
		});
		this.axios.get('http://192.168.0.105:8080/static/json/chinese_cities.json').then(res=>{
		  let CitiesData = res.data;
		  const self  = this;
		  const AllProvinces = CitiesData['86'];
		  for(const Provincecode in AllProvinces){
		    //Province Code: ProvinceName
			  const Cities = CitiesData[Provincecode];
			  let cities_disticts = [];
			  for(const CityCode in Cities){
			    let city_disticts = [];
				  for(const DistictCode in CitiesData[CityCode]){
            city_disticts.push(CitiesData[CityCode][DistictCode]);
            // console.log(Provincecode, AllProvinces[Provincecode], CityCode, Cities[CityCode], DistictCode, CitiesData[CityCode][DistictCode]);
				  }
				  cities_disticts.push({"name": Cities[CityCode]  ,"dis": city_disticts})
			  }
        self.AllChineseCites[AllProvinces[Provincecode]] = cities_disticts;
		  }
		}).catch(err=>{
      console.log("Request Error." + err);
		});
    // this.$store.dispatch("setCities",this.AllCityUniversity);
  }
}
</script>

<style>

</style>
