const sizeOrder = {
  '4/4': 0,
  '3/4': 1,
  '1/2': 2,
  '1/4': 3,
  '1/8': 4,
  '1/10': 5,
  '1/16': 6,
  '17"': 7,
  '16"': 8,
  '15"': 9,
  '13"': 10,
  '12"': 11,
  '11"': 12,
}

export function sortBySize(a, b) {
  return sizeOrder[a.size] - sizeOrder[b.size]
}

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
