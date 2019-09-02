import { titleCase } from '../../libs/titleCase'

describe('titleCase', () => {
  test('works', () => {
    expect(titleCase('test')).toEqual('Test')
  })
})
