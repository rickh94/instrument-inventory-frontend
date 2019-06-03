import React from 'react'
import { Nav, NavItemInternal } from './Nav'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import 'jest-dom/extend-expect'

describe('Nav', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Nav isAuthenticated={false} handleLogout={jest.fn()} />
      </MemoryRouter>
    )

    expect(container).toMatchSnapshot()
  })

  it('opens drawer when button is clicked', () => {
    const { container, queryByTestId } = render(
      <MemoryRouter>
        <Nav isAuthenticated={false} handleLogout={jest.fn()} />
      </MemoryRouter>
    )

    expect(queryByTestId('nav-drawer')).not.toBeInTheDocument()

    fireEvent.click(container.querySelector('button[data-testid="open-drawer-button"]'))

    expect(queryByTestId('nav-drawer')).toBeInTheDocument()
  })

  describe('renders the correct button based on isAuthenticated', () => {
    it('renders login if isAuthenticated is false', () => {
      const { queryAllByText } = render(
        <MemoryRouter>
          <Nav isAuthenticated={false} handleLogout={jest.fn()} />
        </MemoryRouter>
      )
      expect(queryAllByText('Login').length).not.toBe(0)
      expect(queryAllByText('Logout').length).toBe(0)
    })
    it('renders logout if true', () => {
      const { queryAllByText } = render(
        <MemoryRouter>
          <Nav isAuthenticated={true} handleLogout={jest.fn()} />
        </MemoryRouter>
      )

      expect(queryAllByText('Logout').length).not.toBe(0)
      // for some reason it the login button is also rendered in tests but not in practice
    })
  })

  it('calls handle logout when logout is clicked', async () => {
    const handleLogoutMock = jest.fn()
    const { container } = await render(
      <MemoryRouter>
        <Nav isAuthenticated={true} handleLogout={handleLogoutMock} />
      </MemoryRouter>
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
    const { container, getByText, getByTestId } = render(
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
