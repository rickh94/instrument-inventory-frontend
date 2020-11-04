<template>
  <div class="flex flex-col w-full items-center">
    <div class="flex justify-center w-full">
      <div class="relative w-96 h-64 sm:w-104 sm:h-76 md:w-140 md:h-104 overflow-hidden">
        <v-quagga :on-detected="detected"
                  class="w-96 sm:w-104 md:w-140"
                  :reader-types="['code-128_reader', 'code_39_reader']"></v-quagga>
      </div>
    </div>
    <button class="appearance-none font-bold text-purple-800 text-lg py-2 px-4"
            @click="$emit('close')">Close Scanner
    </button>
  </div>
</template>

<script>
export default {
  name: 'VScanner',
  methods: {
    detected(result) {
      this.$emit('detected', result)
    },
  },
}
</script>

