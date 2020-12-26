import { sortBySize } from '@/mixins/ordering'

const computedBows = {
  computed: {
    violinBows() {
      return this.bows.filter(item => item.type === 'Violin').sort(sortBySize)
    },
    violaBows() {
      return this.bows.filter(item => item.type === 'Viola').sort(sortBySize)
    },
    celloBows() {
      return this.bows.filter(item => item.type === 'Cello').sort(sortBySize)
    },
    bassBows() {
      return this.bows.filter(item => item.type === 'Bass').sort(sortBySize)
    },
  },
}

export default computedBows
