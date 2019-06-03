import React from 'react'
import InstrumentDisplay, { InfoItem } from './InstrumentDisplay'
import { render } from '@testing-library/react'

describe('InstrumentDisplay', () => {
  const blankInstrument = {
    instrumentType: 'testtype',
    instrumentNumber: 'testnumber',
    size: 'testsize',
    location: 'testlocation',
    assignedTo: 'testassignedto',
    condition: 5,
    quality: 3,
    conditionNotes: 'testconditionnotes',
    maintenanceNotes: 'testmaintenancenotes',
    rosin: true,
    bow: true,
    readyToGo: true,
    shoulderRestEndpinRest: true,
    giftedToStudent: true,
  }

  it('matches snapshot', () => {
    const { container } = render(
      <InstrumentDisplay {...blankInstrument} isLoading={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders data from props', () => {
    const { getAllByText } = render(
      <InstrumentDisplay {...blankInstrument} isLoading={false} />
    )

    expect(getAllByText('Testtype testnumber').length).not.toBe(0)
    expect(getAllByText(blankInstrument.size).length).not.toBe(0)
    expect(getAllByText(blankInstrument.location).length).not.toBe(0)
    expect(getAllByText(blankInstrument.assignedTo).length).not.toBe(0)
    expect(getAllByText('★'.repeat(blankInstrument.condition)).length).not.toBe(0)
    expect(getAllByText('★'.repeat(blankInstrument.quality)).length).not.toBe(0)
    expect(getAllByText(blankInstrument.conditionNotes).length).not.toBe(0)
    expect(getAllByText(blankInstrument.maintenanceNotes).length).not.toBe(0)
  })
})

describe('InfoItem', () => {
  it('matches snapshot', () => {
    const { container } = render(<InfoItem primary="test" secondary="test" />)
    expect(container).toMatchSnapshot()
  })

  it('renders data from props', () => {
    const { queryAllByText } = render(
      <InfoItem primary="testprimary" secondary="testsecondary" />
    )

    expect(queryAllByText('testprimary').length).not.toBe(0)
    expect(queryAllByText('testsecondary').length).not.toBe(0)
  })
})
