
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
        showAllSchool:function() {
            this.bShow = 1;
        },
        closeAllSchool:function() {
            this.bShow = 0;
        },
        showAllUniversitys:function(City,index){
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
        selectSchool:function(schoolName){
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
        currentStep:1,
        showOverlay:true
    },
    methods:{
        PrevStep:function(){
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
        NextStep:function(){
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
        SubmitOK:function(){
            this.closeSubmit();
            this.showOverlay = false;
            swal('淘书斋提醒','删除成功','success');
        },
        closeSubmit:function(){
            this.isSubmit = false;
            this.showOverlay = false;
            console.log(this.isSubmit);
        },
        cancelEdi:function(){//取消修改地址
            this.closeEditAddress();
        },
        SubmitEdit:function(){//修改地址
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
        closeEditAddress:function(){//关闭
            $("#edit_add").removeClass('in');
        },
        setDefaultAddress:function(item){
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
        Init:function() {
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
        IncreaseCnt:function(Item) {
            if (Item.book_des[0].num > 19) {
                alert("当前商品库存20件，最大选择20件");
                Item.book_des[0].num = 20;
            } else {
                Item.book_des[0].num++;
            }
            this.handleAllCnt(2,Item,true);
            // console.log("Increase Cnt" + Item.book_des[0].num);
        },
        DecreaseCnt:function(Item) {
            if (Item.book_des[0].num === 1) {
                alert("当前至少选择一件商品");
            } else {
                Item.book_des[0].num--;
            }
            this.handleAllCnt(2,Item,true);
            // console.log("Decrease Cnt" + Item.book_des[0].num);
        },
        InputChange:function(Inputval) {
            if (isNaN(Item.book_des[0].num)) {
                alert("你输入的不是一个有效的整数,请重新输入");
                Inputval.book_des[0].num = 1;
            } else if (Item.book_des[0].num < 0) {
                alert("当前至少选择一件商品");
                Inputval.book_des[0].num = 1;
            } else if (Item.book_des[0].num > 20) {
                alert("当前商品库存20件，最大选择20件");
                Inputval.book_des[0].num = 20;
            }
            this.handleAllCnt(2,Item,true);
        },
        moveIntoLocale:function(good) {//移入收藏夹
            console.log(Model.SelectedAllShops.length);
        },
        moveSeletedtoLocale:function () {//移入选中到收藏夹
            console.log(Model.SelectedAllShops.length);
        },
        removeItem:function(good) {//删除商品
            var bOK= confirm(
                "图书名:" + good.book_name + "\n" +
                "作  者:" + good.book_des[0].author + "\n" +
                "确认删除这本书？\n"
            );
            if(bOK){
                var bookName = good.book_name;
                var author = good.book_des[0].author;
                var bookPrice = good.book_des[0].dis_price;
                var edition = good.book_des[0].edition;
                var bookNum = good.book_des[0].num;
                var bookID = good.book_des[0].ID;
                var _this = this;
                this.cartGoodsShops.forEach((data,pIndex)=>{
                   data.goods_info.forEach((res,index)=>{
                      if(res.book_name == bookName && res.book_des[0].author == author &&
                         res.book_des[0].dis_price == bookPrice && res.book_des[0].edition == edition &&
                         res.book_des[0].num == bookNum && res.book_des[0].ID == bookID
                      ){
                          this.cartGoodsNum --;
                          if(data.goods_info.length == 1){
                              _this.cartGoodsShops.splice(pIndex,1);
                          }else{
                              data.goods_info.splice(index,1);
                          }
                      }
                   });
                });
                _this.allTotalMoney = 0;
                _this.allCount = 0;
                Model.SelectedAllShops.forEach((data,index)=>{
                    if(data.bookID == bookID ){
                        Model.SelectedAllShops.splice(index,1);
                    }else {
                        _this.allCount += data.bookCnt;
                        _this.allTotalMoney = parseFloat(_this.allTotalMoney) + parseFloat(data.bookTotal);
                        _this.allTotalMoney = _this.allTotalMoney.toFixed(2);
                    }
                });
            }else{
                alert("删除失败");
            }
        },
        removeSeleted:function () {
            console.log(Model.SelectedAllShops.length);
        },
        handleAllCnt:function(Index, Item, bSkip) {
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
                            bookID:data.book_des[0].ID,
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
                               bookID:data.book_des[0].ID,
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
                                    bookID:data.book_des[0].ID,
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
        randomWord:function(randomFlag, min, max) {
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
        submitCheck:function(){
            Model.isSubmit = true;
            overlay.showOverlay = true;
        },
        getHeight:function (Item) {
            return Item.goods_info.length  * 145;
        }
    },
    mounted: function () {
        this.Init()
    }
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
        this.$nextTick(function () {
            this.Init();
        });
    },
    methods:{
        Init:function(){
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
        lubbo:function(){
            $("#daily_hot").carousel( {interval:5000});
            $('#guess_like').carousel({interval:5000});
        },
        showDiv:function(Index){
            this.recommendIndex = Index;
        },
        showDailyHot:function(Index){
            this.dailyHotCurrentIndex = Index;
            var tStart = this.dailyHotCurrentIndex * 5;
            var tEnd = tStart + 5 > this.dailyHotAll.length ? this.dailyHotAll.length : tStart + 5;
            this.dailyHot = []
            for(var i = tStart; i< tEnd; i++ ){
                this.dailyHot.push(this.dailyHotAll[i]);
            }
        },
        showGuessLike:function(Index){
            this.guessLikeCurrentIndex = Index;
            var tStart = this.guessLikeCurrentIndex * 5;
            var tEnd = tStart + 5 > this.guessLikeAll.length ? this.guessLikeAll.length : tStart + 5;
            this.guessLike = []
            for(var i = tStart; i< tEnd; i++ ){
                this.guessLike.push(this.guessLikeAll[i]);
            }
        },
        next:function(options){
            if(options === "daily-hot"){
                this.dailyHotCurrentIndex = (this.dailyHotCurrentIndex + 1) % 5;
                this.showDailyHot(this.dailyHotCurrentIndex);
            }else if(options=== "guess-like"){
                this.guessLikeCurrentIndex = (this.guessLikeCurrentIndex + 1) % 5;
                this.showGuessLike(this.guessLikeCurrentIndex);
            }
        },
        prev:function(options){
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