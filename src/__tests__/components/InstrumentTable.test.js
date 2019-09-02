import React from 'react'
import { render, cleanup } from '../../test-utils'
import { InstrumentTable, InstrumentTableCell } from '../../components/InstrumentTable'

afterEach(cleanup)

describe('<InstrumentTable />', () => {
  test('renders', () => {
    const { container } = render(
      <InstrumentTable records={[{}]} history={{ push: jest.fn() }} />
    )
    expect(container).toMatchSnapshot()
  })

  test('renders correct headers', () => {
    const { container, queryByText } = render(
      <InstrumentTable records={[{}]} history={{ push: jest.fn() }} />
    )

    expect(queryByText('Number')).toBeTruthy()
    expect(queryByText('Type')).toBeTruthy()
    expect(queryByText('Size')).toBeTruthy()
    expect(queryByText('Assigned To')).toBeTruthy()
    expect(queryByText('Location')).toBeTruthy()
    expect(queryByText('Condition')).toBeTruthy()
    expect(queryByText('Quality')).toBeTruthy()
    expect(queryByText('Gifted')).toBeTruthy()
    expect(queryByText('History')).toBeTruthy()
    expect(container.querySelector('.ReactVirtualized__Table')).toBeTruthy()
    expect(container.querySelector('.ReactVirtualized__Table__Grid')).toBeTruthy()
  })
})

describe('InstrumentTableCell', () => {
  const testInstrument = {
    id: 1,
    number: '1-001',
    type: 'Violin',
    size: '4/4',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: false,
    history: ['one', 'two', 'three'],
  }

  test('renders number', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="number"
        classes={{}}
        cellData={testInstrument.number}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText(testInstrument.number)).toBeTruthy()
  })

  test('renders type', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="type"
        classes={{}}
        cellData={testInstrument.type}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText(testInstrument.type)).toBeTruthy()
  })

  test('renders location', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="location"
        classes={{}}
        cellData={testInstrument.location}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText(testInstrument.location)).toBeTruthy()
  })

  test('renders condition', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="condition"
        classes={{}}
        cellData={testInstrument.condition}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText('★★★★')).toBeTruthy()
  })

  test('renders quality', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="quality"
        classes={{}}
        cellData={testInstrument.quality}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText('★★★')).toBeTruthy()
  })

  test('renders gifted false', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="gifted"
        classes={{}}
        cellData={testInstrument.gifted}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText('No')).toBeTruthy()
  })

  test('renders gifted true', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="gifted"
        classes={{}}
        cellData={true}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText('Yes')).toBeTruthy()
  })

  test('renders history', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="history"
        classes={{}}
        cellData={testInstrument.history}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText('one, two, three')).toBeTruthy()
  })

  test('renders history truncated', () => {
    const { queryByText } = render(
      <InstrumentTableCell
        dataKey="history"
        classes={{}}
        cellData={[
          'one two',
          'three four',
          'five six',
          'seven eight',
          'nine ten',
          'eleven twelve',
        ]}
        rowHeight={5}
        columnIndex={1}
        columns={[{}, {}]}
      />
    )
    expect(queryByText('one two, three four, five six,...')).toBeTruthy()
  })
})
