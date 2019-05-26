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

var Model = new Vue({
    el:"#myModal",
    data:{
        isSubmit:false,
        SelectedAllShops:[],
        cartAddress:[],
        currentStep:1
    },
    methods:{
        PrevStep(){
            if(this.currentStep == 1){
                this.currentStep = 1;
                $("#step_submit").attr("disabled",true);
                $("#step_prev").attr("disabled",true);
                $("#step_next").attr("disabled",false)
            }else{
                this.currentStep --;
                $("#step_submit").attr("disabled",true);
                $("#step_next").attr("disabled",false);
                if(this.currentStep == 1){
                    $("#step_prev").attr("disabled",true);
                }else{
                    $("#step_next").attr("disabled",false)
                }
            }
        },
        NextStep(){
            if(this.currentStep == 4){
                this.currentStep = 4;
                $("#step_submit").attr("disabled",false);
                $("#step_prev").attr("disabled",false);
                $("#step_next").attr("disabled",true);
            }else{
                this.currentStep ++;
                $("#step_prev").attr("disabled",false);
                if(this.currentStep == 4){
                    $("#step_submit").attr("disabled",false);
                    $("#step_next").attr("disabled",true);
                }else{
                    $("#step_next").attr("disabled",false);
                }
            }
        },
        SubmitOK(){
            this.closeSubmit();
            swal('淘书斋提醒','删除成功','success');
        },
        closeSubmit(){
            this.isSubmit = false;
            console.log(this.isSubmit);
        },
        cancelEdit(){//取消修改地址
            this.closeEditAddress();
        },
        SubmitEdit(){//修改地址
            this.cartAddress.forEach((res)=>{
               if(res.add_default == true) {
                   res.add_province = $("#province2").val();
                   res.add_district =  $("#city2").val() + $("#district2").val();
                   res.add_contact_phone = $("#tel2").val();
                   res.add_contact_name =$("#contact_name2").val();
                   res.add_more_detail =$("#more_address_2").val();
                   this.closeEditAddress();
                   alert("修改地址成功");
               }
            });
        },
        closeEditAddress(){//关闭
            $("#edit_add").removeClass('in');
        },
        setDefaultAddress(item){
            this.cartAddress.forEach((res)=>{
                if(res.add_default == true){
                    res.add_default = false;
                }
            });
            item.add_default = true;
        }
    }
});
var cartMain = new Vue({
    el:'.shop',
    data:{
        cartGoodsShops:[],
        cartGoodsNum:0,
        isAllSelected:false,
        allCount:0,
        allTotalMoney:0.00
    },
    methods: {
        Init() {
            var _this = this;
            this.$http.get('../dist/res/json/cart.json', []).then((res) => {
                res.body.forEach((data) => {
                    if (data.id == "1") {
                        _this.cartGoodsShops = data.goods;
                        Model.cartAddress = data.address;
                        _this.cartGoodsShops.forEach((data) => {
                            var goods = data.goods_info;
                            _this.cartGoodsNum += Object.keys(goods).length;
                        });
                    }
                });
            });
        },
        IncreaseCnt(Item) {
            if (Item.book_des[0].num > 19) {
                alert("当前商品库存20件，最大选择20件");
                Item.book_des[0].num = 20;
            } else {
                Item.book_des[0].num++;
            }
            this.handleAllCnt(2,Item,true);
            // console.log("Increase Cnt" + Item.book_des[0].num);
        },
        DecreaseCnt(Item) {
            if (Item.book_des[0].num === 1) {
                alert("当前至少选择一件商品");
            } else {
                Item.book_des[0].num--;
            }
            this.handleAllCnt(2,Item,true);
            // console.log("Decrease Cnt" + Item.book_des[0].num);
        },
        InputChange(Item) {
            if (isNaN(Item.book_des[0].num)) {
                alert("你输入的不是一个有效的整数,请重新输入");
                Item.book_des[0].num = 1;
            } else if (Item.book_des[0].num < 0) {
                alert("当前至少选择一件商品");
                Item.book_des[0].num = 1;
            } else if (Item.book_des[0].num > 20) {
                alert("当前商品库存20件，最大选择20件");
                Item.book_des[0].num = 20;
            }
            this.handleAllCnt(2,Item,true);
        },
        moveIntoLocale(Item) {//移入收藏夹

        },
        removeItem(Item) {//删除商品

        },
        handleAllCnt(Index, Item, bSkip) {
            if(!bSkip) {
                if (Index === 0) {//全选
                    var flag = !this.isAllSelected;
                    this.isAllSelected = flag;
                    Item.forEach((data) => {
                        data.isChecked = flag;
                        data.goods_info.forEach((da) => {
                            da.isChecked = flag;
                        });
                    });
                } else if (Index === 1) {
                    var flag = !Item.isChecked;
                    Item.isChecked = flag;
                    Item.goods_info.forEach((data) => {
                        data.isChecked = flag;
                    });
                } else if (Index === 2) {
                    var flag = !Item.isChecked;
                    Item.isChecked = flag;
                }
            }
            Model.SelectedAllShops = [];
            var _this = this;
            if (this.isAllSelected) {
                this.cartGoodsShops.forEach((res) => {
                    res.goods_info.forEach((data) => {
                        Model.SelectedAllShops.push({
                            ID:this.randomWord(false,20),
                            bookName:data.book_name,
                            bookAuthor:data.book_des[0].author,
                            bookPrice:data.book_des[0].dis_price,
                            bookCnt:data.book_des[0].num,
                            bookTotal:(data.book_des[0].dis_price * data.book_des[0].num ).toFixed(2)
                        });
                    });
                });
            }else{
                this.cartGoodsShops.forEach((res)=>{
                   if(res.isChecked === true){//这个商店被全部选中
                       res.goods_info.forEach((data)=>{
                           Model.SelectedAllShops.push({
                               ID:this.randomWord(false,20),
                               bookName:data.book_name,
                               bookAuthor:data.book_des[0].author,
                               bookPrice:data.book_des[0].dis_price,
                               bookCnt:data.book_des[0].num,
                               bookTotal:(data.book_des[0].dis_price * data.book_des[0].num ).toFixed(2)
                           });
                       });
                   }else{
                       res.goods_info.forEach((data)=>{
                            if(data.isChecked === true){
                                Model.SelectedAllShops.push({
                                    ID:this.randomWord(false,20),
                                    bookName:data.book_name,
                                    bookAuthor:data.book_des[0].author,
                                    bookPrice:data.book_des[0].dis_price,
                                    bookCnt:data.book_des[0].num,
                                    bookTotal:(data.book_des[0].dis_price * data.book_des[0].num ).toFixed(2)
                                });
                            }
                       });
                   }
                });
            }
            var EnableSubmit = Model.SelectedAllShops.length == 0 ? true : false;
            $("#btn_js1").attr("disabled",EnableSubmit);
            $("#btn_js2").attr("disabled",EnableSubmit);
            console.log(JSON.stringify(Model.SelectedAllShops));
            var _this =this;
            _this.allCount = 0;
            _this.allTotalMoney = 0;
            Model.SelectedAllShops.forEach((res)=>{
                _this.allCount += res.bookCnt;
                _this.allTotalMoney = parseFloat(_this.allTotalMoney) + parseFloat(res.bookTotal);
                _this.allTotalMoney = _this.allTotalMoney.toFixed(2);
            });
        },
        randomWord(randomFlag, min, max) {
            var str = "",
                range = min,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            // 随机产生
            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (var i = 0; i < range; i++) {
                var pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        },
        submitCheck(){
            Model.isSubmit = true;
        }
    },
    mounted: function () {
        this.Init()
    },

});



var recommend_daily = new Vue({
    el:".recommend_daily",
    data:{
        dailyHot:[],
        dailyHistory:[],
        guessLike:[],
        dailyHotAll:[],
        guessLickAll:[],
        //Dayhot history guess_like Div
        recommendIndex:1,
        ShowClass:'recommend_daily_body carousel slide display_show',
        HideClass:'recommend_daily_body carousel slide display_hide',
        //Selector
        ShowClassLine:"list-group-item fl border-line",
        HideClassLine:"list-group-item fl border-offline",
        //轮播 选择
        dailyHotCurrentIndex:0,
        guessLikeCurrentIndex:0
    },
    mounted:function () {
        this.Init()
    },
    methods:{
        Init(){
            var _this = this;
            this.$http.get('../dist/res/json/daily_interest.json',[]).then((res)=>{
               let allData = res.body;
               allData.forEach((data)=>{
                   if(data.name === "guess_like"){
                       _this.guessLikeAll = data.item;
                       _this.guessLike = []
                       var tStart = _this.guessLikeCurrentIndex * 5;
                       var tEnd = tStart + 5 > data.item.length ? data.item.length : tStart + 5;
                       for(var i = tStart; i< tEnd; i++ ){
                           _this.guessLike.push(data.item[i]);
                       }
                   }else if(data.name === "daily_history"){
                       _this.dailyHistory = data.item;
                   }else if(data.name === "daily_hot"){ //  5 Items
                       _this.dailyHotAll = data.item;
                       _this.dailyHot = []
                       var tStart = _this.dailyHotCurrentIndex * 5;
                       var tEnd = tStart + 5 > data.item.length ? data.item.length : tStart + 5;
                       for(var i = tStart; i< tEnd; i++ ){
                           _this.dailyHot.push(data.item[i]);
                       }
                   }

               });
            });
        },
        lubbo(){
            $("#daily_hot").carousel( {interval:5000});
            $('#guess_like').carousel({interval:5000});
        },
        showDiv(Index){
            this.recommendIndex = Index;
        },
        showDailyHot(Index){
            this.dailyHotCurrentIndex = Index;
            var tStart = this.dailyHotCurrentIndex * 5;
            var tEnd = tStart + 5 > this.dailyHotAll.length ? this.dailyHotAll.length : tStart + 5;
            this.dailyHot = []
            for(var i = tStart; i< tEnd; i++ ){
                this.dailyHot.push(this.dailyHotAll[i]);
            }
        },
        showGuessLike(Index){
            this.guessLikeCurrentIndex = Index;
            var tStart = this.guessLikeCurrentIndex * 5;
            var tEnd = tStart + 5 > this.guessLikeAll.length ? this.guessLikeAll.length : tStart + 5;
            this.guessLike = []
            for(var i = tStart; i< tEnd; i++ ){
                this.guessLike.push(this.guessLikeAll[i]);
            }
        },
        next(options){
            if(options === "daily-hot"){
                this.dailyHotCurrentIndex = (this.dailyHotCurrentIndex + 1) % 5;
                this.showDailyHot(this.dailyHotCurrentIndex);
            }else if(options=== "guess-like"){
                this.guessLikeCurrentIndex = (this.guessLikeCurrentIndex + 1) % 5;
                this.showGuessLike(this.guessLikeCurrentIndex);
            }
        },
        prev(options){
            if(options === "daily-hot"){
                if(this.dailyHotCurrentIndex == 0)
                    this.dailyHotCurrentIndex = 4;
                else
                    this.dailyHotCurrentIndex = (this.dailyHotCurrentIndex + 1) % 5;
                this.showDailyHot(this.dailyHotCurrentIndex);
            }else if(options=== "guess-like"){
                if(this.guessLikeCurrentIndex == 0)
                    this.guessLikeCurrentIndex = 4;
                else
                    this.guessLikeCurrentIndex = (this.guessLikeCurrentIndex + 1) % 5;
                this.showGuessLike(this.guessLikeCurrentIndex);
            }
        }
    }
});

const timer = setInterval(()=>{
    recommend_daily.next("daily-hot");
},3000);
const timer1 = setInterval(()=>{
    recommend_daily.next("guess-like");
},6000);