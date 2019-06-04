import React from 'react'
import InstrumentForm from './InstrumentForm'
import { render, fireEvent } from '@testing-library/react'
import 'jest-dom/extend-expect'

const genericValues = {
  instrumentNumber: '1',
  instrumentType: 'violin',
  size: '4/4',
  location: 'office',
  assignedTo: 'test person',
  maintenanceNotes: 'test maintenance notes',
  conditionNotes: 'test condition notes',
  condition: '4',
  quality: '5',
  rosin: true,
  bow: false,
  shoulderRestEndpinRest: true,
  readyToGo: true,
  gifted: true,
}

describe('InstrumentForm', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <InstrumentForm
        {...genericValues}
        onSubmit={jest.fn()}
        setValue={jest.fn()}
        errors={{}}
        setErrors={jest.fn()}
        validateForm={jest.fn()}
        clearForm={jest.fn()}
        onCancel={jest.fn()}
        buttonsLeft={false}
        photoField={true}
      />
    )

    expect(container).toMatchSnapshot()
  })

  it('passes props down to fields', () => {
    const { container } = render(
      <InstrumentForm
        {...genericValues}
        onSubmit={jest.fn()}
        setValue={jest.fn()}
        errors={{}}
        setErrors={jest.fn()}
        validateForm={jest.fn()}
        clearForm={jest.fn()}
        onCancel={jest.fn()}
        buttonsLeft={false}
        photoField={true}
      />
    )

    expect(container.querySelector('input#scanner-field')).toHaveAttribute(
      'value',
      genericValues.instrumentNumber
    )
    // expect(getByTestId('instrument-type')).toHaveAttribute('value', 'violin')
    expect(container.querySelector('input#assigned-to')).toHaveAttribute(
      'value',
      genericValues.assignedTo
    )
    expect(container.querySelector('textarea#maintenance-notes')).toHaveTextContent(
      genericValues.maintenanceNotes
    )
    expect(container.querySelector('textarea#condition-notes')).toHaveTextContent(
      genericValues.conditionNotes
    )
    expect(container.querySelector('input#condition')).toHaveAttribute(
      'value',
      genericValues.condition
    )
    expect(container.querySelector('input#quality')).toHaveAttribute(
      'value',
      genericValues.quality
    )
    expect(container.querySelector('#rosin')).toHaveAttribute('checked')
    expect(container.querySelector('#bow')).not.toHaveAttribute('checked')
    expect(container.querySelector('#shoulder-rest-endpin-rest')).toHaveAttribute(
      'checked'
    )
    expect(container.querySelector('#ready-to-go')).toHaveAttribute('checked')
  })

  it('calls the state update function on change', () => {
    const setValue = jest.fn()
    const { container } = render(
      <InstrumentForm
        {...genericValues}
        onSubmit={jest.fn()}
        setValue={setValue}
        errors={{}}
        setErrors={jest.fn()}
        validateForm={jest.fn()}
        clearForm={jest.fn()}
        onCancel={jest.fn()}
        buttonsLeft={false}
        photoField={true}
      />
    )
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: 'newinstrumentnumber' },
    })
    expect(setValue).toHaveBeenCalledWith('instrumentNumber', 'newinstrumentnumber')

    fireEvent.change(container.querySelector('select#instrument-type'), {
      target: { value: 'viola' },
    })
    expect(setValue).toHaveBeenCalledWith('instrumentType', 'viola')

    fireEvent.change(container.querySelector('select#size'), {
      target: { value: '3/4' },
    })
    expect(setValue).toHaveBeenCalledWith('size', '3/4')

    fireEvent.change(container.querySelector('select#location'), {
      target: { value: 'Storage' },
    })
    expect(setValue).toHaveBeenCalledWith('location', 'Storage')

    fireEvent.change(container.querySelector('input#assigned-to'), {
      target: { value: 'test name' },
    })
    expect(setValue).toHaveBeenCalledWith('assignedTo', 'test name')

    fireEvent.change(container.querySelector('textarea#maintenance-notes'), {
      target: { value: 'new notes' },
    })
    expect(setValue).toHaveBeenCalledWith('maintenanceNotes', 'new notes')

    fireEvent.change(container.querySelector('textarea#condition-notes'), {
      target: { value: 'new notes' },
    })
    expect(setValue).toHaveBeenCalledWith('conditionNotes', 'new notes')

    fireEvent.change(container.querySelector('input#condition'), {
      target: { value: '2' },
    })
    expect(setValue).toHaveBeenCalledWith('condition', '2')

    fireEvent.change(container.querySelector('input#quality'), {
      target: { value: '4' },
    })
    expect(setValue).toHaveBeenCalledWith('quality', '4')

    // fireEvent.change(container.querySelector(''))
  })
})
