import React, { useState, useLayoutEffect, useContext } from 'react'
import { API } from 'aws-amplify'
import { RootPaper, SearchResultsList, LoadingHeader } from '../../components'
import { HelpersContext } from '../../contexts'

const Gifted = () => {
  const [isLoading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const { showAlert } = useContext(HelpersContext)

  useLayoutEffect(() => {
    const getRecords = async () => {
      setLoading(true)
      try {
        const res = awai  // test('renders header', () => {
          //   API.get = jest.fn().mockImplementation(() => Promise.resolve(mockInstruments))
          //   const { queryByText } = render(
          //     <TestEverything>
          //       <Gifted />
          //     </TestEverything>
          //   )
          //   expect(queryByText('Gifted Instruments')).toBeTruthy()
          // })
        
          // test('renders items', async () => {
          //   jest.useFakeTimers()
          //   API.get = Promise.resolve(mockInstruments)
          //   const { queryByText, container, queryByTestId, getByText } = render(<Gifted />, { wrapper: TestEverything })
          //   await act(async () => {
          //     await flushPromises()
          //     await jest.runAllTicks()
          //   })
          //   console.log(container.innerHTML)
          //   await wait(() => getByText('Violin 4-002'))
          //   console.log(container.innerHTML)
          // })t API.get('instrument-inventory', 'filter/gifted')
        setRecords(res)
      } catch (err) {
        showAlert(err)
      }
      setLoading(false)
    }

    getRecords()
  }, [])
  return (
    <RootPaper>
      <LoadingHeader title="Gifted Instruments" isLoading={isLoading} />
      <SearchResultsList results={records} />
    </RootPaper>
  )
}

Gifted.propTypes = {}

export default Gifted
