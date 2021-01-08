import { groupBySize, groupByStringName } from '@/mixins/ordering'

const stringTableMixin = {
  computed: {
    sizes() {
      let sizesInStrings = new Set()
      for (let string of this.strings) {
        sizesInStrings.add(string.size)
      }
      return sizesInStrings
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

export default stringTableMixin
