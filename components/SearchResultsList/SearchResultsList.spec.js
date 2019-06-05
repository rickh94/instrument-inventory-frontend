import React from 'react'
import SearchResultsList, { ResultRowInternal } from './SearchResultsList'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import 'jest-dom/extend-expect'

const testItem = {
  id: 'testid',
  fields: {
    'Instrument Type': 'test',
    Size: '4/4',
    'Assigned To': 'test person',
    Location: 'test location',
    Number: '1-001',
  },
}

const makeTestItem = id => ({
  id: id,
  fields: {
    'Instrument Type': 'test',
    Size: '4/4',
    'Assigned To': `test${id}`,
    Location: 'test',
    Number: '1-001',
  },
})

describe('ResultRowInternal', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ResultRowInternal item={testItem} history={{ push: jest.fn() }} />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders data from props', () => {
    const { container } = render(
      <ResultRowInternal item={testItem} history={{ push: jest.fn() }} />
    )
    expect(
      container.querySelector('td[data-testid="type-and-number"]')
    ).toHaveTextContent('Test 1-001')
    expect(container.querySelector('td[data-testid="size"]')).toHaveTextContent('4/4')
    expect(container.querySelector('td[data-testid="assignedTo"]')).toHaveTextContent(
      'test person'
    )
    expect(container.querySelector('td[data-testid="location"]')).toHaveTextContent(
      'test location'
    )
  })

  it('goes to instrument page on click', () => {
    const push = jest.fn()
    const { container } = render(
      <ResultRowInternal item={testItem} history={{ push }} />
    )

    fireEvent.click(container.querySelector('tr'))
    expect(push).toHaveBeenCalledWith('/instrument/testid')
  })
})

describe('<SearchResultsList />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <SearchResultsList
          results={[makeTestItem(0), makeTestItem(1), makeTestItem(2)]}
        />
      </MemoryRouter>
    )

    expect(container).toMatchSnapshot()
  })

  it('renders a result row for each item', () => {
    const { container } = render(
      <MemoryRouter>
        <SearchResultsList
          results={[makeTestItem(0), makeTestItem(1), makeTestItem(2)]}
        />
      </MemoryRouter>
    )
    expect(container.querySelectorAll('tr[data-testid="result-row"]').length).toBe(3)
  })
})
