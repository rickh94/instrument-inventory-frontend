import temporaryError from '../../libs/temporaryError'

jest.useFakeTimers()

describe('temporaryError', () => {
  test('works', () => {
    const setErrorMock = jest.fn()
    const message = 'test error'
    const time = 500

    temporaryError({ setError: setErrorMock, message, timeSeconds: time })
    expect(setErrorMock).toHaveBeenCalledWith(new Error(message))
    expect(setTimeout).toHaveBeenCalledTimes(1)

    jest.runAllTimers()

    expect(setErrorMock).toHaveBeenCalledTimes(2)
    expect(setErrorMock).toHaveBeenCalledWith(null)
  })
})
