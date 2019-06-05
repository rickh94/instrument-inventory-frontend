import React from 'react'
import {
  InstrumentTypeSelect,
  InstrumentSizeSelect,
  LocationSelect,
} from './CustomFields'
import 'jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'

describe('Fields', () => {
  describe('InstrumentTypeSelect', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <InstrumentTypeSelect
          error={{}}
          value={'violin'}
          onChange={jest.fn()}
          required={false}
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('calls function on change', () => {
      const onChangeMock = jest.fn()
      const { container } = render(
        <InstrumentTypeSelect
          error={{}}
          value={'violin'}
          onChange={onChangeMock}
          required={false}
        />
      )

      fireEvent.change(container.querySelector('select#instrument-type'), {
        target: { value: 'viola' },
      })
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('does not set required', () => {
      const { container } = render(
        <InstrumentTypeSelect error={{}} value={'violin'} onChange={jest.fn()} />
      )

      expect(container.querySelector('select#instrument-type')).not.toHaveAttribute(
        'required'
      )
    })

    it('does set required', () => {
      const { container } = render(
        <InstrumentTypeSelect
          error={{}}
          value={'violin'}
          onChange={jest.fn()}
          required
        />
      )

      expect(container.querySelector('select#instrument-type')).toHaveAttribute(
        'required'
      )
    })
  })

  describe('InstrumentSizeSelect', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <InstrumentSizeSelect
          error={{}}
          value="4/4"
          onChange={jest.fn()}
          required={false}
          instrumentType="violin"
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('renders different sizes for viola', () => {
      const { queryByText } = render(
        <InstrumentSizeSelect
          error={{}}
          value="4/4"
          onChange={jest.fn()}
          required={false}
          instrumentType="viola"
        />
      )
      expect(queryByText('12"').length).not.toBe(0)
      expect(queryByText('4/4').length).toBeFalsy()
    })

    it('calls function on change', () => {
      const onChangeMock = jest.fn()
      const { container } = render(
        <InstrumentSizeSelect
          error={{}}
          value="4/4"
          onChange={onChangeMock}
          required={false}
          instrumentType="violin"
        />
      )

      fireEvent.change(container.querySelector('select#size'), {
        target: { value: '1/2' },
      })
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('does not set required', () => {
      const { container } = render(
        <InstrumentSizeSelect
          error={{}}
          value="4/4"
          instrumentType="violin"
          onChange={jest.fn()}
        />
      )

      expect(container.querySelector('select#size')).not.toHaveAttribute('required')
    })

    it('does set required', () => {
      const { container } = render(
        <InstrumentSizeSelect
          error={{}}
          value="4/4"
          onChange={jest.fn()}
          instrumentType="violin"
          required
        />
      )

      expect(container.querySelector('select#size')).toHaveAttribute('required')
    })
  })

  describe('LocationSelect', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <LocationSelect
          error={{}}
          value="Grant Elementary School"
          onChange={jest.fn()}
          required={false}
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('calls function on change', () => {
      const onChangeMock = jest.fn()
      const { container } = render(
        <LocationSelect
          error={{}}
          value=""
          onChange={onChangeMock}
          required={false}
        />
      )

      fireEvent.change(container.querySelector('select#location'), {
        target: { value: 'Trenton High School' },
      })
      expect(onChangeMock).toHaveBeenCalled()
    })

    it('does not set required', () => {
      const { container } = render(
        <LocationSelect error={{}} value="trade" onChange={jest.fn()} />
      )

      expect(container.querySelector('select#location')).not.toHaveAttribute(
        'required'
      )
    })

    it('does set required', () => {
      const { container } = render(
        <LocationSelect
          error={{}}
          value=""
          onChange={jest.fn()}
          required
        />
      )

      expect(container.querySelector('select#location')).toHaveAttribute(
        'required'
      )
    })
  })
})
