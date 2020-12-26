export const sizeOrder = {
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

export const stringOrder = {
  E: 0,
  A: 1,
  D: 2,
  G: 3,
  C: 4,
}

export function sortBySize(a, b) {
  return sizeOrder[a.size] - sizeOrder[b.size]
}

export function sortByString(a, b) {
  return stringOrder[a.string] - stringOrder[b.string]
}
