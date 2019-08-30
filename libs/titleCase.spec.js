import { titleCase } from './titleCase'

describe('titleCase', () => {
  test('works', () => {
    expect(titleCase('test')).toEqual('Test')
  })
})
