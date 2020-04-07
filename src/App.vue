<template>
  <div id="app">
    <!--
    最外层cascading-selector绑定v-model对象形式，showValue指定文字显示规则，change事件监听只要对象发生变化就触发，
    内部cascading-wrapper组件，表示需要几级联动，prop表示绑定父级v-model上的哪个属性，change事件可以监听到单个属性的变化，当前属性发生变化触发，返回当前属性的最新值，
    cascading-option，选择项列表，遍历生成，value为v-model或者change事件返回的值，默认插槽可以用来显示文字，不写默认显示value值
    -->
    <cascading-selector
      v-model="address"
      :show-value="showAddress"
      :show="isShow"
    >
      <cascading-wrapper prop="province">
        <cascading-option
          v-for="item in provinceList"
          :key="item.id"
          :value="item.id"

          @handleOptionClick="handleProvinceSelect(item)"
        >
          {{ item.name }}
        </cascading-option>
      </cascading-wrapper>
      <cascading-wrapper prop="city">
        <cascading-option
          v-for="item in address.province.cities"
          :key="item.id"
          :value="item.id"
          @handleOptionClick="handleCitiSelect(item)"
        >
          {{ item.name }}
        </cascading-option>
      </cascading-wrapper>
      <cascading-wrapper prop="country">
        <cascading-option
          v-for="item in address.city.countries"
          :key="item.id"
          :value="item.id"
        >
          {{ item.name }}
        </cascading-option>
      </cascading-wrapper>
    </cascading-selector>
  </div>
</template>

<script>
import CascadingSelector from "./components/CascadingSelector";
import CascadingWrapper from "./components/CascadingWrapper";
import CascadingOption from "./components/CascadingOption";

import areaData from "./area.data.json";

export default {
  name: 'App',
  components: {
    CascadingSelector,
    CascadingWrapper,
    CascadingOption
  },
  data() {
      return {
        address: {
            province: {
              name: '',
              id: '',
              cities: []
            },
            city: {
              name: '',
              id: '',
              countries: []
            },
            country: {
              name: '',
              id: '',
            }
        },
        provinceList: [],
        isShow: false
      };
  },
  computed: {
      showAddress() {
          let province = this.address.province.name ? this.address.province : {name:'选择省'};
          let city = this.address.city.name ? this.address.city : {name:'选择市'};
          let country = this.address.country.name ? this.address.country : {name:'选择县'};
          return `${province.name} - ${city.name} - ${country.name}`;
      },
  },
  mounted() {
    this.provinceList = areaData.provinces;
  },
  methods: {
    handleProvinceSelect(item) {
      this.address.province = item;
    },
    handleCitiSelect(item) {
      this.address.city = item;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

li {
  list-style: none;
}

</style>
