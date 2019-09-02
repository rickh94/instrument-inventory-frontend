import React from 'react'
import { Nav, NavItemInternal } from '../../components/Nav'
import { render, fireEvent, cleanup } from '../../test-utils'
import 'jest-dom/extend-expect'

afterEach(cleanup)

describe('Nav', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Nav isAuthenticated={false} handleLogout={jest.fn()} />
    )

    expect(container).toMatchSnapshot()
  })

  it('opens drawer when button is clicked', () => {
    const { container, queryByTestId } = render(
      <Nav isAuthenticated={false} handleLogout={jest.fn()} />
    )

    expect(queryByTestId('nav-drawer')).not.toBeInTheDocument()

    fireEvent.click(container.querySelector('button[data-testid="open-drawer-button"]'))

    expect(queryByTestId('nav-drawer')).toBeInTheDocument()
  })

  describe('renders the correct button based on isAuthenticated', () => {
    it('renders login if isAuthenticated is false', () => {
      const { queryByTestId } = render(
        <Nav isAuthenticated={false} handleLogout={jest.fn()} />
      )
      expect(queryByTestId('login-button')).toBeTruthy()
      expect(queryByTestId('logout-button')).toBeFalsy()
    })
    it('renders logout if true', () => {
      const { queryByTestId } = render(
        <Nav isAuthenticated={true} handleLogout={jest.fn()} />
      )

      expect(queryByTestId('logout-button')).toBeTruthy()
      expect(queryByTestId('login-button')).toBeFalsy()
    })
  })

  it('calls handle logout when logout is clicked', async () => {
    const handleLogoutMock = jest.fn()
    const { container } = await render(
      <Nav isAuthenticated={true} handleLogout={handleLogoutMock} />
    )

    fireEvent.click(container.querySelector('button[data-testid="logout-button"]'))
    expect(handleLogoutMock).toHaveBeenCalled()
  })
})

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
    const { getByText, getByTestId } = render(
      <NavItemInternal
        icon={<div data-testid="test-icon" />}
        to="/"
        setDrawerOpen={jest.fn()}
        text="test text"
        history={{ push: jest.fn() }}
      />
    )
    expect(getByText('test text')).toBeInTheDocument()
    expect(getByTestId('test-icon')).toBeInTheDocument()
  })
})
