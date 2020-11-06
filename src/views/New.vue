<template>
  <div>New</div>
</template>

<script>
export default {
  name: 'New',
  created() {
    console.log(this.$store.state.newInstrumentNumber)
  },
}
</script>

<style scoped>

</style>
