function sortBowsBySize(a, b) {
  if (a.size > b.size) {
    return -1
  }
  if (b.size > a.size) {
    return 1
  }
  return 0
}

const computedBows = {
  computed: {
    violinBows() {
      return this.bows.filter(item => item.type === 'Violin').sort(sortBowsBySize)
    },
    violaBows() {
      return this.bows.filter(item => item.type === 'Viola').sort(sortBowsBySize)
    },
    celloBows() {
      return this.bows.filter(item => item.type === 'Cello').sort(sortBowsBySize)
    },
    bassBows() {
      return this.bows.filter(item => item.type === 'Bass').sort(sortBowsBySize)
    },
  },
}

export default computedBows
