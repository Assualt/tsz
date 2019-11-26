

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
        targetSchool:"所有学校",
        userID: '',
        userToken: '',
        bIsLogined: false
    },
    mounted:function () {//加载完成的时候需要加载的东西
        this.showAllUniversitys("北京",1);
        var ca = document.cookie.split(';')
        for(var i = 0;i < ca.length; ++i){
            var tmpCookie = ca[i];
            //cookie = TSZ&UserID&UserToken
            if(tmpCookie.startsWith("TSZ")){
                var srcList = tmpCookie.split('&');
                self.userID = srcList[1];
                self.userToken = srcList[2];
                self.bIsLogined = true;
                break;
            }
        }
    },
    filters:{  //过滤器
    },
    methods:{
        showAllSchool:function () {
            this.bShow = 1;
            overlay.setOverlay();
        },
        closeAllSchool:function () {
            this.bShow = 0;
            overlay.unsetOverlay();
        },
        showAllUniversitys:function(City,index){
            var _this = this;
            this.$http.get('dist/res/json/area_university.json',[]).then((res)=>{
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
            overlay.unsetOverlay();
        },
        CheckOrLogin:function(){
            if(!self.bIsLogined){
                window.location.href='./sites/login.html';
            }
        }
    }
});

var main = new Vue({
    el:".main",
    data:{
        currentSlide:0,
        AllSlideCnt:3,
        currentSlideImgPath:'dist/res/focus_0.jpg',
        opcityval:1,
        activeClass:'fa fa-circle opacity_1',
        disactiveClass:'fa fa-circle opacity_04',
        hotTopicWord:[],
        hotStore:[],
        hotPerson:[],
        mostFocus:[],
        newRegister:[],
        bookRecommend:[],
        bookDiscount:[],
        bookNewComment:[],
        bookPopular:[]
    },
    fileters:{

    },
    methods:{
        imgFormat:function(value){
            return 'dist/res/focus_' + value +'.jpg';
        },
        prev:function(){
            if(this.currentSlide == 0)
                this.currentSlide = 2;
            else
                this.currentSlide = (this.currentSlide-1) % this.AllSlideCnt;
            this.currentSlideImgPath = this.imgFormat(this.currentSlide);
        },
        next:function(){
            this.currentSlide = (this.currentSlide+1) % this.AllSlideCnt;
            this.currentSlideImgPath = this.imgFormat(this.currentSlide);
        },
        setSlide:function(index){
            this.currentSlide = index;
            this.currentSlideImgPath = this.imgFormat(index);
        },
        Init:function(){
            var _this = this;
            this.$http.get('dist/res/json/hot-topic.json',[]).then((res)=>{
                let allData = res.body;
                allData.forEach((data)=>{
                    if(data.name === "hot-topic"){
                        this.hotTopicWord = data.value;
                    }else if(data.name === "hot-bookstore"){
                        this.hotStore = data.value;
                    }else if(data.name === "hot-person"){
                        this.hotPerson = data.value;
                    }else if(data.name === "most-focus"){
                        this.mostFocus = data.value;
                    }else if(data.name === "new-register"){
                        this.newRegister = data.value;
                    }
                });
            });

            this.$http.get('dist/res/json/book-recommend.json',[]).then((res)=>{
                this.bookRecommend = res.body;
            });
            this.$http.get('dist/res/json/book-discount.json',[]).then((res)=>{
                this.bookDiscount = res.body;
            });
            this.$http.get('dist/res/json/book-new-comment.json',[]).then((res)=>{
               this.bookNewComment = res.body;
            });
            this.$http.get('dist/res/json/book-popular.json',[]).then((res)=>{
                this.bookPopular = res.body;
            });
        }


    },
    mounted:function () {//加载完成的时候需要加载的东西
        this.$nextTick(function () {
            this.Init();
        });
    }
});

const timer = setInterval(()=>{
    main.next();
},3000);

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

var overlay = new Vue({
    el:"#overlay",
    data:{
        bOverLay : false
    },
    methods:{
        setOverlay:function(){
            this.bOverLay = true
        },
        unsetOverlay:function(){
            this.bOverLay = false
        }
    },
    mounted:function(){
        this.bOverLay = false
    }
});
