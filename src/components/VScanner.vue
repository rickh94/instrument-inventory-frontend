<template>
  <div class="flex justify-center w-full">
    <div class="relative w-96 h-64 sm:w-104 sm:h-76 md:w-140 md:h-104 overflow-hidden">
      <v-quagga :on-detected="detected" class="w-96 sm:w-104 md:w-140" :reader-types="['code-128_reader', 'code_39_reader']"></v-quagga>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VScanner',
  methods: {
    detected(data) {
      this.$emit('detected', data)
    },
  },
}
</script>

