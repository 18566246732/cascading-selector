<template>
  <li
    class="cascading-selector-option"
    @click="handleOptionClick"
  >
    <slot />
  </li>
</template>

<script>
    export default {
        name: "CascadingOption",
        props: {
            value: {
                type: Object,
                required: true
            }
        },
        methods: {
          handleOptionClick() {
            this.$emit('handleOptionClick');
          }
        }
    };
</script>

<style lang="scss" scoped>
.cascading-selector-option {
  line-height: 60px;
  height: 60px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
