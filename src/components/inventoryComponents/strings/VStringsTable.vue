<template>
  <table class='table table-auto mx-4'>
    <thead>
<!--    <tr class='border-b border-black text-xl'>-->
<!--      <th class='pr-4'>{{ instrument }}</th>-->
<!--      <th>Count</th>-->
<!--    </tr>-->
    <tr class="border-b border-black text-xl">
      <th class="pr-4">{{ instrument }}</th>
      <th v-for="size in sizes" :key="size" class="px-2 text-center">{{ size }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for='(stringList, stringName) in stringsByStringBySize' :key='stringName'>
      <td class="text-center pr-4">{{ stringName }}</td>
      <td v-for="size in sizes" :key="`${stringName}-${size}`" class="text-center">{{ stringList[size] | getStringInfo }} </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import { groupBySize, groupByStringName } from "@/mixins/ordering";

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
  filters: {
    getStringInfo: function(string) {
      if (string === undefined) {
        return "0"
      }
      return `${string.count}`
    }
  },
  computed: {
    sizes() {
      let sizesInStrings = new Set();
      for (let string of this.strings) {
        sizesInStrings.add(string.size);
      }
      return sizesInStrings;
    },
    stringsByStringBySize() {
      const byString = groupByStringName(this.strings)
      let byStringBySize = {}
      for (const stringName in byString) {
        byStringBySize[stringName] = groupBySize(byString[stringName])
      }
      return byStringBySize
    },
  },
}
</script>

<style scoped>

</style>
