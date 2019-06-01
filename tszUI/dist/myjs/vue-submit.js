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
        showCount:3,
        selectedAddress:{},
        NewAddressProvince:'',
        NewAddressCity:'',
        NewAddressDistrict:'',
        NewAddressMore:'',
        NewAddressContactName:'',
        NewAddressTel:'',
        currentEditIndex:0,
        EditAddress:{},
        SelectedAllShops:[],
        payWays:0,
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
            var qrCode = new QRCode(document.getElementById('payOff'),{
                width:100,height:100
            });
            var text = "https://www.baidu.com/";
            qrCode.makeCode(text);
        },
        addNewAddress:function () {
            if( this.NewAddressProvince == '' || this.NewAddressCity == '' || this.NewAddressDistrict == '' ||
                this.NewAddressContactName == '' || this.NewAddressTel == '' || this.NewAddressMore == ''){
                alert("当前你还有未输出的选项,请选择完整后方能提交");
            }else{
                this.AllAddress.push({
                    add_province:this.NewAddressProvince,
                    add_city:this.NewAddressCity,
                    add_district:this.NewAddressDistrict,
                    add_more_detail:this.NewAddressMore,
                    add_contact_phone:this.NewAddressTel,
                    add_contact_name:this.NewAddressContactName,
                    add_default:false
                });
                this.NewAddressTel = this.NewAddressContactName = this.NewAddressMore = this.NewAddressDistrict
                = this.NewAddressContactName = this.NewAddressProvince = '';
                alert("添加地址OK");
                $("#AddressModal").modal("hide");
                $('.modal-backdrop').remove();
            }
        },
        chooseAddress:function (Address) {
            this.selectedAddress = Address;
        },
        deleteAddress:function (Address) {
            var pos = this.AllAddress.indexOf(Address);
            if(pos!= -1){
                var ok = confirm("确认删除本条地址");
                if(ok) {
                    this.AllAddress.splice(pos, 1);
                    alert("删除地址成功");
                }else{
                    alert("删除地址失败");
                }
            }
        },
        editAddress:function () {
            alert("修改成功");
            $("#EditAddressModal").modal("hide");
            $('.modal-backdrop').remove();
        },
        setDefaultAdddress:function (Address) {
            this.AllAddress.forEach((data)=>{
                data.add_default = false;
            });
            Address.add_default = true;
        },
        PrevStep:function (){
            if(this.currentStep == 1){
            }else{
                this.currentStep--;
            }
        },
        NextStep:function (){
            if(this.currentStep == 1){
                if(JSON.stringify(this.selectedAddress) == "{}"){
                    alert("你必须选择一个收货地址才能进行下一步");
                }else{
                    this.currentStep ++;
                    console.log("Next step");
                }
            }else if(this.currentStep == 2){
                this.currentStep++;
            }
        },
        payWay:function (way) {
            this.payWays = way;
            console.log(way);
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
        },
        getAllShops(){
            var UserID = localStorage.getItem('userID');
            console.info(UserID);
            if(UserID == ''){
                alert("当前未登陆,无需结算");
            }else {
                var userData = localStorage.getItem(UserID);
                if(userData== ''){
                    alert("当前未选择任何商品,无需结算");
                }else{
                    console.log(userData);
                    if(hex_md5(userData) != UserID){
                        alert("当前商品有人非法篡改,不能结算");
                    }else{
                        this.SelectedAllShops = JSON.parse(userData).data;
                        console.log(this.SelectedAllShops);
                    }
                }
            }
            if(this.SelectedAllShops == null){
                return [];
            }else{
                return this.SelectedAllShops;
            }
        }
    }
});
