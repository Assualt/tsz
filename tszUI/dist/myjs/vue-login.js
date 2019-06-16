const overlay = new Vue({
    el: "#overlay",
    data: {
        bOverLay: false
    },
    methods: {
        setOverlay: function () {
            this.bOverLay = true
        },
        unsetOverlay: function () {
            this.bOverLay = false
        }
    },
    mounted: function () {
        this.bOverLay = false
    }
});

const header = new Vue({
    el: "#header",
    data: {
        AllProvinces: [
            "北京", "上海", "黑龙江", "吉林", "辽宁", "天津", "安徽", "江苏", "浙江", "陕西", "湖北", "广东", "湖南",
            "甘肃", "四川", "山东", "福建", "河南", "重庆", "云南", "河北", "江西", "山西", "贵州", "广西", "内蒙古",
            "宁夏", "青海", "西藏", "香港", "澳门", "台湾"
        ],
        bShow: 0,
        CurrentCityUniversity: [],
        targetSchool: "所有学校",
        userInfoStatus: {
            name: '登录',
            bExpand: false
        }
    },
    mounted: function () {//加载完成的时候需要加载的东西
        this.showAllUniversitys("北京", 1);
    },
    filters: {  //过滤器
    },
    methods: {
        register: function () {
            main.doRegister();
        },
        changeStatusInfo: function (ok) {
            if (ok) {
                this.userInfoStatus.name = '我';
                this.userInfoStatus.bExpand = true;
            } else {
                this.userInfoStatus.name = '登录';
                this.userInfoStatus.bExpand = false;
            }
        },
        exitLogin: function () {
            main.ExitStatusInfo(false);
        },
        showAllSchool: function () {
            this.bShow = 1;
            overlay.setOverlay();
        },
        closeAllSchool: function () {
            this.bShow = 0;
            overlay.unsetOverlay();
        },
        showAllUniversitys: function (City, index) {
            const _this = this;
            this.$http.get('../dist/res/json/area_university.json', []).then((res) => {
                let allCityData = res.body;
                if (index > 31 || index < 0)
                    index = 1;
                if (index >= 1 && index <= 31) {
                    allCityData.forEach((data) => {
                        if (typeof data.city === typeof City && data.city === City) {
                            _this.CurrentCityUniversity = [];
                            data.university.forEach((uni) => {
                                _this.CurrentCityUniversity.push(uni.name);
                            });
                        }
                    });
                    this.CurrentCityIndex = index;
                } else if (index == 0) {
                    _this.CurrentCityUniversity = [];
                    allCityData.forEach((data) => {
                        data.university.forEach((uni) => {
                            _this.CurrentCityUniversity.push(uni.name);
                        });
                    });
                }
            });
        },
        selectSchool: function (schoolName) {
            this.targetSchool = schoolName;
            this.closeAllSchool();
            overlay.unsetOverlay();
        }
    }
});

var main = new Vue({
    el:"#main",
    data:{
        title:"登录淘书斋",
        Mode:0,  // 0. 登录模式  1. 注册模式
        currentState:0,
        submitData:{
            username:'',
            password:'',
            againpsw:'',
            confirmp:''
        },
        toolTipData:{
            display:false,
            text:'',
            class:'',
            strongtext:'',
        },
        userInfo:{
            account:"1433223",
            nickName:"受伤的小袋鼠",
            gender:{
                male:false,
                female:false,
                secret:true
            },
            nickPhoto:'',
            province:'',
            university:'',
            address:'',
            description:''
        },
        bEdit:false,
        AllCityUniversity:{},
        AllProvinces:[
                    "北京", "上海", "黑龙江", "吉林", "辽宁", "天津", "安徽", "江苏", "浙江", "陕西", "湖北", "广东", "湖南",
                    "甘肃", "四川", "山东", "福建", "河南", "重庆", "云南", "河北", "江西", "山西", "贵州", "广西", "内蒙古",
                    "宁夏", "青海", "西藏", "香港", "澳门", "台湾"
        ],
        selectProvince:'',
        confirmData:{
            confirSeconds:'10',
            show:false,
            title:'获取验证码',
        },
        Address:[{
                id:"addr1",
                name:'侯鑫',
                tel:'13752913198',
                detail:'重庆市黔江区**街道**路',
                postcode:'400000',
                bdefault:true
            },
            {
                id:"addr2",
                name:'侯鑫',
                tel:'13752913198',
                detail:'重庆市黔江区**街道**路',
                postcode:'400000',
                bdefault:false
            }
        ],
        NewAddress:{
            id:"",
            name:"",
            tel:"",
            detail:"",
            postcode:"40000",
            bdefault:false
        },
        UserBookMangeMent:[],

        bookManger:{
            chooseShow: 1,
            currentShowPage:1,
            showPages:[
                1,2,3
            ]


        }
    },
    methods:{
        setDefaultAddress:function(address){
            this.Address.forEach((res)=>{
                res.bdefault = address.id === res.id;
            });
        },
        deleteAddress:function(item){
            const Index = this.Address.indexOf(item);
            this.Address.splice(Index,1);
        },
        addAddress:function(){
            const province = $("#province2").val();
            const city = $("#city2").val();
            const district = $("#district2").val();
            const model = $("#address_add_modal");
            if(this.NewAddress.tel == "" || this.NewAddress.name == "" || this.NewAddress.detail == ""){
                swal('淘书斋提醒','添加新地址失败','error');
                model.modal('hide');
                this.NewAddress.id = '';
                this.NewAddress.name = '';
                this.NewAddress.tel = '';
                this.NewAddress.detail = '';
                return;
            }
            this.NewAddress.detail = province + city + district + this.NewAddress.detail ;
            const s = this.Address[this.Address.length - 1].id;
            const Index = 'addr' + (parseInt(s.substring(s.indexOf('addr') + 4)) + 1);
            this.NewAddress.id = Index;
            model.modal('hide');
            swal('淘书斋提醒','添加新地址成功','success');
            this.Address.push(this.NewAddress);
        },
        getConfirmNum:function(){

            this.toolTipData.display = true;
            this.toolTipData.text = '验证码已发送,请注意查收!';
            this.toolTipData.class = 'alert-info';
            this.toolTipData.strongtext = '淘书斋提醒:';
            const _this = this;
            setTimeout(function(){
                _this.toolTipData.display = false;
            }, 3000);
            this.confirmData.show =true;
            this.countDown();
        },
        countDown:function(){
            const _this = this;
            if(this.confirmData.confirSeconds == 0){
                return false;
            }else{
                this.confirmData.confirSeconds--;
            }
            setTimeout(function(){
                _this.countDown();
            },1000);
            if(this.confirmData.confirSeconds == 0) {
                this.confirmData.show = false;
                this.confirmData.title = '获取验证码';
            }else{
                this.confirmData.title = '当前无法再次获取，等待' + this.confirmData.confirSeconds + 's后重新尝试';
            }
        },
        doRegister:function(){
            this.Mode = 1;
        },
        ExitStatusInfo:function(bExpand){
            if(this.currentState == 0){
                swal('淘书斋提醒','当前用户还未登录，不能退出登录','warning');
                return;
            }
            const _this = this;
            swal({
                title:'淘书斋提醒',
                text:'确定退出当前用户吗',
                icon:'warning',
                buttons:["取消","确定"]
            }).then(function (isconfirm) {
                if(isconfirm == true){
                    swal('淘书斋提醒','退出成功','success');
                    _this.currentState = 0;
                    _this.checkCurrent(0);
                    if(!bExpand){
                        header.changeStatusInfo(false);
                    }
                }else if(isconfirm===false){
                    swal('淘书斋提醒','退出失败','error');
                }
            });
        },
        clickTo:function(Index){
            if(this.currentState == 0 ){
                this.currentState = 0;
                swal('淘书斋提醒','跳转到其他界面之前需要登录','info');
            }else if(this.currentState >= 1 && this.currentState <= 7){
                if(Index == 0){
                    swal('淘书斋提醒','现在已经登录,不能跳转到登录界面','warning');
                }else{
                    this.currentState = Index;
                }
            }
        },
        onSubmit:function(){
            if(this.Mode === 0){
                //登录验证
                if(this.submitData.username === '' || this.submitData.password === ''){
                    swal('淘书斋提醒','登录失败!请检查用户名和密码是否填写后再次登录!','error');
                    return;
                }
                console.log("点击了登录按钮");
                swal('淘书斋提醒','登录成功','success');
                this.currentState = 1;
                header.changeStatusInfo(true);
            }else if (this.Mode === 1){
                //注册验证
                swal('淘书斋提醒','注册成功,跳转值登录界面','success');
                this.Mode = 0;
            }
        },
        checkPasswprd:function(){
            if(this.submitData.againpsw === this.submitData.password ){
                this.toolTipData.display = true;
                this.toolTipData.text = '当前两次输入密码一致!';
                this.toolTipData.class = 'alert-info';
                this.toolTipData.strongtext = '淘书斋提醒:';
                const _this = this;
                setTimeout(function(){
                    _this.toolTipData.display = false;
                }, 3000);
            }else{
                this.toolTipData.display = true;
                this.toolTipData.text = '两次输入不一致，重新输入密码。';
                this.toolTipData.class = 'alert-danger';
                this.toolTipData.strongtext = '淘书斋提醒:';
                this.submitData.againpsw = '';
                const _this = this;
                setTimeout(function(){
                    _this.toolTipData.display = false;
                },3000);

            }
        },
        checkCurrent:function(Index){
            if(this.currentState == 0){
                if(Index >= 1 && Index <= 7){
                    return "disabled";
                }else{
                    if(Index == 0){
                        return "active";
                    }else{
                        return "";
                    }
                }
            }else{
                if(Index != 0){
                    if(Index == this.currentState){
                        return "active";
                    }else{
                        return "";
                    }
                }else{
                    return "disabled";
                }
            }
        },
        checkOptions:function(Index){
            if(Index==1){
                this.userInfo.gender.male = true;
                this.userInfo.gender.female = false;
                this.userInfo.gender.secret = false;
            }else if(Index == 2){
                this.userInfo.gender.male = false;
                this.userInfo.gender.female = true;
                this.userInfo.gender.secret = false;
            }else{
                this.userInfo.gender.male = false;
                this.userInfo.gender.female = false;
                this.userInfo.gender.secret = true;
            }
        },
        uploadFile:function(event){
            const file = event.target.files;
            this.userInfo.nickPhoto = file[0].name;
            console.log(file);
        },
        getUniversityMap:function(){
            if(this.selectProvince == ''){
                return [];
            }
            return this.AllCityUniversity[this.selectProvince];
        },
        forgetPassword:function () {
            if (this.submitData.username === '') {
                swal('淘书斋提醒', '当前未输入用户名,忘记密码操作失败', 'info');
                return;
            }
        },
        InitBookMangeMent:function () {
            this.$http.get('../dist/res/json/user-book.json',[]).then((res)=>{
                const data = res.body;
                const _this = this;
                data.forEach((EachUser)=>{
                    if(EachUser.name == "sunshine" && EachUser.name_id == "1234561"){
                        _this.UserBookMangeMent = EachUser.books;
                        return;
                    }
                });
            });
        },
        doShowCurrent:function() {
            const showLen = parseInt(this.bookManger.chooseShow);
            const begin = (this.bookManger.currentShowPage - 1) * showLen;
            const len = begin + showLen  > this.UserBookMangeMent.length ? this.UserBookMangeMent.length - begin :  showLen;
            return this.UserBookMangeMent.slice(begin,len + begin);
        },
        TurnTo:function (currentPage) {
            let pIndex;
            if(currentPage == 1 || currentPage == 2 || currentPage == 3){
               pIndex = this.bookManger.showPages[currentPage-1];
               this.bookManger.currentShowPage = pIndex;
               this.doShowCurrent();
            }else if(currentPage == -1){//prev

            }else if(currentPage == 0){//next

            }
        },
        InithistorySale:function () {
            const sale_his_line = echarts.init($("#sale_his_line")[0]);
            const sale_his_bar = echarts.init($("#sale_his_bar")[0]);
            const sale_his_pie = echarts.init($("#sale_his_pie")[0]);
            this.$http.get('../dist/res/json/book_his_chart.json',[]).then((res)=>{
                res.body.forEach((data)=>{
                   if(data.name=="1"){
                       data.charts.forEach((perChart)=>{
                          if(perChart.types == "line"){
                              sale_his_line.setOption(perChart.options);
                          }
                           if(perChart.types==="bar"){
                               sale_his_bar.setOption(perChart.options);
                           }
                           if(perChart.types==="pie"){
                               sale_his_pie.setOption(perChart.options);
                           }
                       });
                   }
                });
            });
        }
    },
    watch:{


    },
    filters:{
        idFilter(id){
            return "#" + id;
        },
        idChildFileter(id){
            return "#" + id + "1";
        },
        idChild(id){
            return id + "1";
        },
        toFixed(val){
            return val.toFixed(2);
        },
        showPrice(val){
            return '' + val ;
        }
    },
    mounted:function(){
        this.$nextTick(function () {
             this.$http.get("../dist/res/json/area_university.json",[]).then((res)=>{
                let allCityData = res.body;

                allCityData.forEach((p)=>{
                    const city = p.city;
                    const universitys = [];
                    p.university.forEach((data)=>{
                        universitys.push(data.name);
                    });
                    this.AllCityUniversity[city] = universitys;
                });
             });
             this.InitBookMangeMent();
             this.InithistorySale();
        });

    }

});

