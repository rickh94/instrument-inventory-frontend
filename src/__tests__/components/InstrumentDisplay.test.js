import React from 'react'
import InstrumentDisplay, {
  InfoItem,
  InstrumentDisplayFields,
} from '../../components/InstrumentDisplay'
import { render, cleanup } from '../../test-utils'

const instrumentSchema = {
  properties: {
    assignedTo: {
      title: 'Assigned To',
      type: 'string',
    },
    condition: {
      title: 'Condition',
      type: 'integer',
    },
    conditionNotes: {
      title: 'Condition Notes',
      type: 'string',
    },
    gifted: {
      title: 'Gifted To Student',
      type: 'boolean',
    },
    location: {
      title: 'Instrument Location',
      type: 'string',
    },
    maintenanceNotes: {
      title: 'Maintenance Notes',
      type: 'string',
    },
    number: {
      title: 'Instrument Number',
      type: 'string',
    },
    quality: {
      title: 'Quality',
      type: 'integer',
    },
    size: {
      title: 'Instrument Size',
      type: 'string',
    },
    type: {
      title: 'Instrument Type',
      type: 'string',
    },
  },
}
const body = {
  type: 'Violin',
  number: '1-808',
  size: '4/4',
  location: 'Office',
  assignedTo: 'Some Name',
  condition: 5,
  quality: 3,
  conditionNotes: 'testconditionnotes',
  maintenanceNotes: 'testmaintenancenotes',
  gifted: true,
}

afterEach(cleanup)

describe('Instrument Display components', () => {
  describe('InstrumentDisplay', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <InstrumentDisplay schema={instrumentSchema} body={body} isLoading={false} />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders data from props', () => {
      const { getAllByText } = render(
        <InstrumentDisplay schema={instrumentSchema} body={body} isLoading={false} />
      )

      expect(getAllByText('Violin 1-808').length).not.toBe(0)
      expect(getAllByText(body.size).length).not.toBe(0)
      expect(getAllByText(body.location).length).not.toBe(0)
      expect(getAllByText(body.assignedTo).length).not.toBe(0)
      expect(getAllByText('★'.repeat(body.condition)).length).not.toBe(0)
      expect(getAllByText('★'.repeat(body.quality)).length).not.toBe(0)
      expect(getAllByText(body.conditionNotes).length).not.toBe(0)
      expect(getAllByText(body.maintenanceNotes).length).not.toBe(0)
    })
  })

  describe('InstrumentDisplayFields', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <InstrumentDisplayFields schema={instrumentSchema} body={body} />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders data from props', () => {
      const { queryAllByText } = render(
        <InstrumentDisplayFields schema={instrumentSchema} body={body} />
      )

      expect(queryAllByText('4/4').length).not.toBe(0)
      expect(queryAllByText('Assigned To').length).not.toBe(0)
    })

    it('does not render omitted fields', () => {
      const { queryByText } = render(
        <InstrumentDisplayFields
          schema={instrumentSchema}
          body={body}
          omitFields={['number', 'type']}
        />
      )

      expect(queryByText('Instrument Number')).toBeFalsy()
      expect(queryByText('1-808')).toBeFalsy()
    })
  })

  describe('InfoItem', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <InfoItem title="test title" data="title" type="string" />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders strings correctly', () => {
      const { getAllByText } = render(
        <InfoItem title="Test Title" data="Something" type="string" />
      )
      expect(getAllByText('Test Title')).toBeTruthy()
      expect(getAllByText('Something')).toBeTruthy()
    })

    it('renders arrays correctly', () => {
      const { getAllByText } = render(
        <InfoItem title="Array" data={['one', 'two', 'three']} type="array" />
      )
      expect(getAllByText('one, two, three')).toBeTruthy()
    })

    it('renders integers as stars', () => {
      const { getAllByText } = render(
        <InfoItem title="Stars" data={3} type="integer" />
      )
      expect(getAllByText('★'.repeat(3))).toBeTruthy()
    })

    it('renders true boolean as yes', () => {
      const { getAllByText, queryByText } = render(
        <InfoItem title="True" data={true} type="boolean" />
      )
      expect(getAllByText('Yes')).toBeTruthy()
      expect(queryByText('No')).toBeFalsy()
    })
  })

  describe('InfoItem false', () => {
    it('renders false boolean as no', () => {
      const { getAllByText, queryByText } = render(
        <InfoItem title="False" data={false} type="boolean" />
      )
      expect(getAllByText('No')).toBeTruthy()
      expect(queryByText('Yes')).toBeFalsy()
    })
  })
})
