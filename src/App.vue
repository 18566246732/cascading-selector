<template>
  <div id="app">
    <cascading-selector
      v-model="address"
      :show-value="showAddress"
    >
      <cascading-wrapper
        prop="province"
      >
        <cascading-option
          v-for="item in provinceList"
          :key="item.id"
          :value="item"
        >
          {{ item.name }}
        </cascading-option>
      </cascading-wrapper>
      <cascading-wrapper
        prop="city"
      >
        <cascading-option
          v-for="item in address.province.cityArray"
          :key="item.id"
          :value="item"
        >
          {{ item.name }}
        </cascading-option>
      </cascading-wrapper>
      <cascading-wrapper
        prop="country"
      >
        <cascading-option
          v-for="item in address.city.countryArray"
          :key="item.id"
          :value="item"
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
              cityArray: []
            },
            city: {
              name: '',
              id: '',
              countryArray: []
            },
            country: {
              name: '',
              id: '',
            }
        },
        provinceList: []
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
    // handleProvinceSelect(item) {
    //   this.address.province = item;
    //   this.handleCitySelect(this.address.province.cityArray[0]);
    //   this.handleCountrySelect(this.address.city.countryArray[0]);
    // },
    // handleCitySelect(item) {
    //   this.address.city = item;
    //   this.handleCountrySelect(this.address.city.countryArray[0]);
    // },
    // handleCountrySelect(item) {
    //   this.address.country = item;
    // },
    // hanldeSelectChanged(type, value) {
    //   const fnName = `handle${String(type).charAt(0).toUpperCase() + String(type).slice(1)}Select`;
    //   this[fnName](value);
    // }
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
