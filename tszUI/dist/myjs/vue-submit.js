var header= new Vue({
    el:"#header",
    data: {
        AllProvinces:[
            "北京", "上海", "黑龙江", "吉林", "辽宁", "天津", "安徽", "江苏", "浙江", "陕西", "湖北", "广东", "湖南",
            "甘肃", "四川", "山东", "福建", "河南", "重庆", "云南", "河北", "江西", "山西", "贵州", "广西", "内蒙古",
            "宁夏", "青海", "西藏", "香港", "澳门", "台湾"
        ],
        bShow: 0,
        CurrentCityUniversity:[],
        targetSchool:"所有学校"
    },
    mounted:function () {//加载完成的时候需要加载的东西
        this.showAllUniversitys("北京",1);
    },
    filters:{  //过滤器
    },
    methods:{
        showAllSchool () {
            this.bShow = 1;
        },
        closeAllSchool () {
            this.bShow = 0;
        },
        showAllUniversitys(City,index){
            var _this = this;
            this.$http.get('../dist/res/json/area_university.json',[]).then((res)=>{
                let allCityData = res.body;
                if(index > 31 || index < 0)
                    index = 1;
                if(index >= 1 && index <= 31 ) {
                    allCityData.forEach((data) => {
                        if (typeof data.city === typeof City && data.city === City) {
                            _this.CurrentCityUniversity = [];
                            data.university.forEach((uni) => {
                                _this.CurrentCityUniversity.push(uni.name);
                            });
                        }
                    });
                    this.CurrentCityIndex = index;
                }else if(index == 0){
                    _this.CurrentCityUniversity = [];
                    allCityData.forEach((data) => {
                        data.university.forEach((uni)=> {
                            _this.CurrentCityUniversity.push(uni.name);
                        });
                    });
                }
            });

        },
        selectSchool(schoolName){
            this.targetSchool = schoolName;
            this.closeAllSchool();
        }
    }
});

var helper = new Vue({
    el:'.helper',
    data:{
        helper0:"<i class='fa fa-question-circle-o fa-2x\'></i>",
        helper1:"<i class='fa fa-rocket fa-2x'></i>",
        helper3:"<i class='fa fa-phone-square fa-2x'></i>"
    },
    methods:{
        hide:function(index){
            if(index === 0){
                this.helper0 = "<i class='fa fa-question-circle-o fa-2x\'></i>";
            }else if(index === 1){
                this.helper1 = "<i class='fa fa-rocket fa-2x'></i>";
            }else if(index === 3){
                this.helper3 = "<i class='fa fa-phone-square fa-2x'></i>";
            }
        },
        show:function(value,index){
            if(index === 0){
                this.helper0 = value;
            }else if(index=== 1){
                this.helper1 = value;
            }else if(index === 3){
                this.helper3 = value;
            }
        },
        scrollTop:function(){
            $(window).scrollTop();
            $('body,html').animate({scrollTop:0},500);
        }
    }
});

var main =new Vue({
    el:'#main',
    data:{
        currentStep:1,
        AllAddress:[],
        showCount:3
    },
    methods: {
        Init: function () {
            var _this = this;
            this.$http.get('../dist/res/json/cart.json', []).then((res) => {
                res.body.forEach((data) => {
                    if (data.id == "1") {
                        _this.AllAddress = data.address;
                    }
                });
            });
        },
        addNewAddress:function () {
            alert("添加新地址")
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.Init();
        })
    },
    computed: {
        getAllAddressList(){
            return this.AllAddress.slice(0,this.showCount);
        }
    }
});
