const { sortByString } = require('@/mixins/ordering')
const { sortBySize } = require('@/mixins/ordering')
const computedStrings = {
  computed: {
    violinStrings() {
      return this.strings
        .filter(item => item.type === 'Violin')
        .sort(sortByString)
        .sort(sortBySize)
    },
    violaStrings() {
      return this.strings
        .filter(item => item.type === 'Viola')
        .sort(sortByString)
        .sort(sortBySize)
    },
    celloStrings() {
      return this.strings
        .filter(item => item.type === 'Cello')
        .sort(sortByString)
        .sort(sortBySize)
    },
    bassStrings() {
      return this.strings
        .filter(item => item.type === 'Bass')
        .sort(sortByString)
        .sort(sortBySize)
    },
  },
}

export default computedStrings
