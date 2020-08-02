<template>
  <div>
    <Header1 :universities="universities"></Header1>
    <el-main style="width: 100%;padding: 0 10%;border: 1px solid red;overflow: auto;height: 800px">
      <el-col style="margin-top: 5%">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step title="确认收货地址"></el-step>
          <el-step title="订单确认"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="查看状态"></el-step>
        </el-steps>
      </el-col>
      <el-col style="height: 550px;padding: 5% 0">
        <el-col :span="21" :offset="3" v-if="currentStep==1">
          <el-row :gutter="20">
            <el-col :span="5" v-for="(item,index) in addresses" :key="index" class="address-info">
              <div class="address-title">
                <address>
                  <strong>{{item.add_province}}</strong>
                  <strong>{{item.add_contact_name}}</strong>
                  <br />
                  {{item.add_city}}&nbsp;
                  <small>{{item.add_district}}</small>
                  <br />
                  <p class="address-detail">{{item.add_more_detail}}</p>
                  <br />
                  <abbr title="Phone">Tel:</abbr>
                  <span>{{item.add_contact_phone}}</span>
                </address>
              </div>
              <div class="address-tools">
                <el-button type="text" v-if="!item.add_default">设置默认地址</el-button>
                <el-button type="text" v-if="item.add_default" disabled>默认地址</el-button>
                <el-button type="text">修改地址信息</el-button>
              </div>
            </el-col>
            <el-col
              :span="5"
              class="address-info"
              align="center"
              type="flex"
              style="line-height:200px"
            >
              <el-button class="el-icon-plus" size="big" @click="newAddress.opened=true">添加收获地址</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-col>
      <el-dialog title="添加收获地址" :visible.sync="newAddress.opened" width="30%">
        <el-form ref="form" :model="newAddress.info" label-width="120px">
          <el-form-item label="收件人姓名">
            <el-input v-model="newAddress.info.add_contact_name"></el-input>
          </el-form-item>
          <el-form-item label="收件人地址">
            <el-col :span="6">
              <el-select placeholder="请选择省" v-model="newAddress.info.add_province"></el-select>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-select placeholder="请选择市" v-model="newAddress.info.add_city"></el-select>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-select placeholder="请选择区/县" v-model="newAddress.info.add_district"></el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="收件人详细地址">
            <el-input v-model="newAddress.info.add_more_detail"></el-input>
          </el-form-item>
          <el-form-item label="收件人电话">
            <el-input v-model="newAddress.info.add_contact_phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="newAddress.opened = false">取 消</el-button>
          <el-button type="primary" @click="newAddress.opened = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-col>
        <el-col :span="6" :offset="6">
          <el-button @click="prevstep" :disabled="currentStep==1">上一步</el-button>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-button @click="nextstep" :disabled="currentStep==4">下一步</el-button>
        </el-col>
      </el-col>
    </el-main>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "../BodyComponents/Footer";
import Header1 from "../BodyComponents/Header1";
export default {
  name: "Submit",
  components: { Footer, Header1 },
  props: ["universities"],
  data() {
    return {
      currentStep: 1,
      addresses: [
        {
          add_province: "重庆市",
          add_city: "重庆市",
          add_district: "黔江区",
          add_more_detail: "河滨南路中段1-3, 404号",
          add_contact_phone: "138xxxxxxxxx",
          add_contact_name: "沉睡的毛利小五郎",
          add_default: true
        },
        {
          add_province: "重庆市",
          add_city: "重庆市",
          add_district: "南岸区",
          add_more_detail: "重庆小区1栋3单元",
          add_contact_phone: "13xxxx8",
          add_contact_name: "fd",
          add_default: false
        },
        {
          add_province: "重庆市",
          add_city: "重庆市",
          add_district: "南岸区",
          add_more_detail: "重庆小区1栋3单元",
          add_contact_phone: "13xxxx8",
          add_contact_name: "fd",
          add_default: false
        },
        {
          add_province: "重庆市",
          add_city: "重庆市",
          add_district: "南岸区",
          add_more_detail: "重庆小区1栋3单元",
          add_contact_phone: "13xxxx8",
          add_contact_name: "fd",
          add_default: false
        }
      ],
      newAddress: {
        opened: false,
        title: "添加新的收货地址",
        info: {
          add_province: "",
          add_city: "",
          add_district: "",
          add_more_detail: "",
          add_contact_phone: "",
          add_contact_name: "fd"
        }
      }
    };
  },
  methods: {
    prevstep: function() {
      if (this.currentStep > 1) this.currentStep--;
    },
    nextstep: function() {
      if (this.currentStep < 4) this.currentStep++;
    }
  }
};
</script>

<style scoped>
.address-info {
  padding: 5px 5px 10px 5px;
  border: 1px solid #efefef;
  height: 200px;
  cursor: pointer;
  margin-top: 5px;
  margin-right: 5px;
}
.address-info:hover {
  border: 1px solid orange;
}
.address-title address {
  line-height: 1.8;
  font-size: 16px;
  padding: 10px 10px 0 10px;
  margin-bottom: 0;
}
.address-tools {
  padding: 0 10px;
}
.address-detail{
  font-size:14px;
  text-overflow: ellipsis;
  margin:0;
}
</style>