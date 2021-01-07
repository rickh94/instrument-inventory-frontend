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
  '14"': 10,
  '13"': 11,
  '12"': 12,
  '11"': 13,
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

export function groupByStringName(strings) {
  let stringsByStringName = {}
  for (let string of strings) {
    if (!(string.string in stringsByStringName)) {
      stringsByStringName[string.string] = []
    }
    stringsByStringName[string.string].push(string)
  }
  return stringsByStringName
}

export function groupBySize(strings) {
  let stringsBySize = {}
  for (let string of strings) {
    stringsBySize[string.size] = string
  }
  return stringsBySize
}
