import React from 'react'

export const testToken = 'testtoken'


export function clickThing(tag, wrapper, content) {
  wrapper
    .findWhere(el => el.name() == tag && el.contains(content))
    .simulate('click', { preventDefault: jest.fn() })
}

export const clickButton = (wrapper, content) => clickThing('Button', wrapper, content)
export const clickLink = (wrapper, content) => clickThing('a', wrapper, content)

