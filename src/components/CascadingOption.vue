<template>
  <li
    class="cascading-selector-option"
    :class="value.isActive ? 'active': ''"
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
            this.$parent.$emit('optionClicked', this.value);
          }
        }
    };
</script>

<style lang="scss" scoped>
.cascading-selector-option {
  line-height: $base-brick-height;
  height: $base-brick-height;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.active {
  color: $primary-color;
}
</style>
