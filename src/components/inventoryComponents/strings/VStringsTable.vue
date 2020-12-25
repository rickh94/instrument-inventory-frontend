<template>
  <table class='table table-auto mx-4'>
    <thead>
    <tr class='border-b border-black text-xl'>
      <th class='pr-4'>{{ instrument }}</th>
      <th>Count</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for='string in strings' :key='string.id'>
      <td>{{ string.size }} {{ string.string }}</td>
      <td>{{ string.count }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'VStringsTable',
  props: {
    strings: {
      type: Array,
      required: true,
    },
    instrument: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>

</style>
