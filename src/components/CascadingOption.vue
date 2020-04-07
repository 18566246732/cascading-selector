<template>
  <li
    class="h-selector-option"
    @click="handleOptionClick"
  >
    <slot>{{ value }}</slot>
  </li>
</template>

<script>
    export default {
        name: "CascadingOption",
        props: {
            value: {
                type: [String,Number],
                required: true
            }
        },
        methods: {
          handleOptionClick() {
            this.$emit('handleOptionClick', this.value);
          }
        }
    };
</script>
