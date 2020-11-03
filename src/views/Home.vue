<template>
  <div class="w-full">
    <div class="m-5 shadow p-3 h-auto">
      <button class="bg-gray-800 text-white p-4" @click="scanner = !scanner">Toggle Scanner</button>
      <v-scanner @detected="detected" v-if="scanner"></v-scanner>
    </div>
  </div>
</template>

<script>
// import VScanner from '@/components/VScanner'
import VScanner from '@/components/VScanner'
export default {
  name: 'Home',
  components: { VScanner },
  // components: { VScanner },
  data() {
    return {
      scanner: true,
    }
  },
  methods: {
    detected(data) {
      console.log(data)
    },
  },
}
</script>

<style>
</style>
