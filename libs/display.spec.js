import { stars, yesOrNo, truncateText } from './display'


describe('helpers', () => {
  test('stars', () => {
    expect(stars(1)).toEqual('★')
    expect(stars(2)).toEqual('★★')
    expect(stars(3)).toEqual('★★★')
    expect(stars(4)).toEqual('★★★★')
    expect(stars(5)).toEqual('★★★★★')
  })

  test('yesOrNo', () => {
    expect(yesOrNo(true)).toEqual('Yes')
    expect(yesOrNo(false)).toEqual('No')
  })
  
  test('truncateText', () => {
    expect(truncateText('one two three', 30)).toEqual('one two three')
    expect(truncateText('one two three four five six seven eight nine', 30)).toEqual('one two three four five six se...')
  })
})
