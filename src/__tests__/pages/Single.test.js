import React from 'react'
import Single from '../../pages/Single'
import { render, cleanup, flushPromises } from '../../test-utils'
import { API } from 'aws-amplify'

afterEach(cleanup)

describe('Single', () => {
  test('matches snapshot', async () => {
    API.get = jest.fn().mockResolvedValueOnce({
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
    })
    const { container } = render(
      <Single match={{ params: { recId: '1' } }} location={{}} />
    )
    await flushPromises()
    expect(container).toMatchSnapshot()
  })
})
