import React from 'react'
import { Nav, NavItemInternal } from './Nav'
import { render, fireEvent } from '@testing-library/react'
import 'jest-dom/extend-expect'

describe('<Nav />', () => {})

describe('NavItemInternal', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <NavItemInternal
        to="/"
        setDrawerOpen={jest.fn()}
        text="test"
        history={{ push: jest.fn() }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('pushes history and closes drawer on click', () => {
    const setDrawerOpenMock = jest.fn()
    const to = '/test'
    const historyMock = { push: jest.fn() }
    const { container } = render(
      <NavItemInternal
        to={to}
        setDrawerOpen={setDrawerOpenMock}
        history={historyMock}
        text="test"
      />
    )

    fireEvent.click(container.querySelector('li[data-testid="item"]'))
    expect(setDrawerOpenMock).toHaveBeenCalledWith(false)
    expect(historyMock.push).toHaveBeenCalledWith(to)
  })

  it('renders icon and title from props', () => {
    const { container, getByText, getByTestId } = render(
      <NavItemInternal
        icon={<div data-testid="test-icon" />}
        to="/"
        setDrawerOpen={jest.fn()}
        text="test text"
        history={{ push: jest.fn() }}
      />
    )
    expect(getByText("test text")).toBeInTheDocument()
    expect(getByTestId("test-icon")).toBeInTheDocument()
  })
})
