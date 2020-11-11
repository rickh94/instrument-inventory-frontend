<template>
  <div class="border-b border-gray-600 text-gray-800 focus-within:border-purple-600 mb-2 focus-within:text-purple-600 flex flex-col">
    <label :for="labelFor" class="text-sm">{{ label }}</label>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'v-form-control',
  props: {
    label: {
      type: String,
      required: true
    },
    labelFor: {
      type: String,
      required: true,
    }
  }
}
</script>
