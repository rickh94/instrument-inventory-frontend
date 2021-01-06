<template>
  <div class="fixed w-full h-full top-0 left-0 flex items-end sm:items-center justify-center">
    <div class="absolute w-full h-full bg-gray-900 opacity-50 z-10" @click="$emit('close')"></div>
    <div class="p-3 shadow bg-white opacity-100 z-50 flex flex-col sm:rounded w-full max-h-screen overflow-auto" :class="widthClass">
        <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'VModal',
    props: {
      widthClass: String
    }
  }
</script>

<style scoped>

</style>
