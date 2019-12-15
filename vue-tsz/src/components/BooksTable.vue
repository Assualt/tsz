<template>
  <form id="book_management_1">
    <fieldset>
      <legend>
        <i class="fa fa-book"></i>&nbsp;图书管理
      </legend>
      <div class="form-group col-md-10">
        <label for="sel_num_show">每页显示</label>
        <select
          id="sel_num_show"
          v-model="PagesManger.currentShowCnt"
          @change="calcCurrentBooks(0)"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <label for="sel_num_show">条</label>
      </div>
      <ul class="fr nav nav-pills nav-tabs-justified col-md-2">
        <li class="fl active">
          <a href="#show_in_table" class="fa fa-table" data-toggle="tab" title="表格形式"></a>
        </li>
        <li class="fl">
          <a href="#show_in_list" class="fa fa-list-alt" data-toggle="tab" title="列表模式"></a>
        </li>
      </ul>
      <div class="tab-content fl" style="width:100%">
        <div class="tab-pane fade in active" id="show_in_table">
          <table class="table-striped table-bordered table-condensed table-hover">
            <caption>图书列表</caption>
            <thead align="center" class="black white-text">
              <tr>
                <th>编号</th>
                <th>书名</th>
                <th>图片</th>
                <th>广告词</th>
                <th>作者</th>
                <th>出版社</th>
                <th>上架时间</th>
                <th>版次</th>
                <th>单价</th>
                <th>库存</th>
                <th>操作</th>
                <th>其他</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in currentBooks" :key="index">
                <td align="center">{{item.book_id}}</td>
                <td align="center">
                  <a :href="item.book_name | bookUrl" target="_blank">{{item.book_name}}</a>
                </td>
                <td>
                  <img :src="item.book_img_url" alt="未能加载正常图片" width="64" height="80" />
                </td>
                <td align="center">{{item.book_ads}}</td>
                <td align="center">
                  <a :href="item.book_author| authorUrl" target="_blank">{{item.book_author}}</a>
                </td>
                <td align="center">{{item.book_publish}}</td>
                <td align="center">{{item.book_uploadtime}}</td>
                <td align="center">{{item.book_edition}}</td>
                <td align="center">{{item.book_price_now | showPrice}}</td>
                <td align="center">{{item.book_left}}</td>
                <td style="width:50px" align="center">
                  <a class="btn btn-link">删除</a>
                  <a class="btn btn-link">修改</a>
                </td>
                <td align="center">{{item.book_else}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tab-pane fade" id="show_in_list">
          <ul>
            <li v-for="(item,index) in currentBooks" :key="index">
              <div class="book_list_info">
                <div class="fl book_list_info_left">
                  <img
                    :src="item.book_img_url "
                    alt="未能加载正常图片"
                    width="120"
                    height="140"
                    class="img-rounded"
                  />
                </div>
                <div class="fl book_list_info_right">
                  <div class="list_info_1">
                    <a href="#" :title="item.book_ads">{{item.book_ads}}</a>
                  </div>
                  <div class="list_info_2">
                    <h4 class="fl">&thetav;</h4>
                    <div class="badge fl">
                      <a href>励志</a>
                    </div>
                    <div class="badge fl">
                      <a href>青春</a>
                    </div>
                    <div class="badge fl">
                      <a href>励志</a>
                    </div>
                    <p class="fl info_price">
                      <strong>&yen;&nbsp;{{item.book_price_now}}</strong>
                    </p>
                    <del class="fl info_price_before">&yen;&nbsp;{{item.book_price_before}}</del>
                    <p
                      class="fl info_price_dis"
                    >{{ item.book_price_now / item.book_price_before | toFixed }} 折</p>
                    <br />
                  </div>
                  <div class="list_info_3">
                    &nbsp;&nbsp;[中]
                    &sol; 作者:
                    <a href="#">{{item.book_author}}</a>
                    &sol; 上架时间:{{item.book_uploadtime}}
                    &sol; {{item.book_publish}}
                    &sol; {{item.book_edition}}
                  </div>
                  <div class="list_info_4">
                    &nbsp;&nbsp;图书编号: {{item.book_id}}
                    &sol; 余量({{item.book_left}})
                    &sol; 描述 {{item.book_else}}
                  </div>
                  <div class="list_info_5">
                    <a href="#" class="btn btn-warning">删除</a>
                    <a href="#" class="btn btn-danger">修改</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <ul class="pager fr" id="book_management_pager">
        <li class="previous">
          <a href="javascript:void(0)" @click="TurnTo(-1)">Prev</a>
        </li>
        <li class="next">
          <a href="javascript:void(0)" @click="TurnTo(0)">Next</a>
        </li>
      </ul>
    </fieldset>
  </form>
</template>

<script>
export default {
  name: "bookstable",
  data() {
    return {
      currentBooks: [
        {
          book_id: 1,
          book_store_id: 1,
          book_img_url: "static/upload/5分钟丰胸.jpg",
          book_store_name: "华夏图书",
          book_name: "一千零一夜",
          book_ads: "欢迎",
          book_author: "莫言",
          book_publish: "人民教育出版社",
          book_edition: "第三版",
          book_price_now: 15.0,
          book_price_before: 23.0,
          book_left: "123",
          book_else: "-",
          book_uploadtime: "2019-11-21"
        }
      ],
      PagesManger: {
        maxPages: 0, //最大页数
        minPages: 0, //最小页数
        currentPage: 1, //当前Pages index
        allBooks: [],
        currentShowCnt: 1
      }
    };
  },
  methods: {
    TurnTo: function(index) {
      if (index == 0) {
        this.PagesManger.currentPage += 1;
      } else if (index == -1) {
        this.PagesManger.currentPage -= 1;
      } else {
        this.PagesManger.currentPage = index;
      }
      this.calcCurrentBooks(0);
    },
    /**
     * @function
     * @param: mode 0 default
     * @param: mode 1 true to/not use again
     * @param: mode 3 prev/next
     */
    calcCurrentBooks: function(mode) {
      if (mode == 0) {
        var begin =
          this.PagesManger.currentShowCnt * (this.PagesManger.currentPage - 1);
        var end = Math.min(
          begin + parseInt(this.PagesManger.currentShowCnt),
          this.PagesManger.maxPages
        );
        var tmp = this.PagesManger.allBooks.slice(begin, end);
        if(tmp.length == 0){
            alert('当前页面超出页面限制，无法进行选取.');
        }else{
            this.currentBooks = tmp;
        }
      } else if (mode == 1) {
        console.log(123);
      }
    }
  },
  filters: {
    showPrice(price) {
      return "￥" + price;
    },
    authorUrl(author) {
      return "https://baike.baidu.com/item/" + author;
    },
    bookUrl(bookName) {
      return "https://baike.baidu.com/item/" + bookName;
    },
    toFixed(val) {
      return val.toFixed(2);
    }
  },
  mounted() {
    this.axios
      .get("static/json/user-book.json")
      .then(res => {
        this.PagesManger.allBooks = res.data.books;
        this.PagesManger.maxPages = Math.floor(
          this.PagesManger.allBooks.length / this.PagesManger.currentShowCnt
        );
        //set current books
        this.calcCurrentBooks(0);
      })
      .catch(err => {
        console.log("catch err" + err);
      });
  }
};
</script>


<style scoped>
#show_in_list h4 a {
  color: rgb(155, 180, 0);
}
#show_in_list ul {
  width: 100%;
  padding: 0;
}
#show_in_list ul li {
  width: 100%;
  height: 160px;
  border: 1px solid #dedede;
  /*border: 1px solid red;*/
  background: rgb(245, 245, 245);
  margin-top: 5px;
}
.book_list_info {
  height: 100%;
}
.book_list_info_left {
  height: 100%;
  padding: 10px 0 0 20px;
  background: white;
  width: 23%;
}
.book_list_info_right {
  width: 77%;
  height: 100%;
}
.list_info_1 {
  width: 100%;
  height: 20px;
  padding-top: 3px;
  padding-left: 10px;
}
.list_info_1 a {
  color: black;
}
.list_info_1 a:hover {
  color: orange;
}
.list_info_2 {
  width: 100%;
  height: 35px;
  padding: 5px;
}
.list_info_2 div.badge:nth-child(1) {
  background: rgba(255, 0, 0, 0.5);
}
.list_info_2 div.badge:nth-child(2) {
  background: rgba(174, 160, 113, 0.8);
}
.list_info_2 div.badge:nth-child(3) {
  background: rgba(209, 219, 113, 0.8);
}
.list_info_2 div.badge a {
  color: white;
}
.list_info_3 {
  margin-top: 3px;
  width: 100%;
  height: 25px;
}
.list_info_4 {
  width: 100%;
  height: 25px;
}
.list_info_5 {
  padding-left: 10px;
  width: 100%;
  height: auto;
}
.list_info_2 h4 {
  margin: 5px 5px 5px 15px;
  color: rgba(233, 123, 1, 1);
}
.list_info_2 div {
  color: white;
  padding: 6px;
  margin-left: 5px;
}
.info_price {
  font-size: 16px;
  font-weight: bolder;
  color: red;
  margin: 3px 9px;
}
.info_price_before {
  font-size: 12px;
  font-weight: 400;
  color: #777777;
  opacity: 0.5;
  margin: 5px 6px;
}
.info_price_dis {
  color: #aaaaaa;
  font-size: 12px;
  margin-top: 4px;
}
</style>