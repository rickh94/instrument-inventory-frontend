/* eslint-disable react/prop-types */
import React from 'react'
import { MuiThemeProvider, createMuiTheme, indigo } from '@material-ui/core'
import { HelpersContext, SchemaContext } from './contexts'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: '#0A81D1',
    },
  },
})

export const showAlert = jest.fn()
export const setSearchResults = jest.fn()
export const setFilterResults = jest.fn()
export const searchResults = jest.fn()
export const filterResults = jest.fn()

export const TestTheme = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
)

export const TestHelpers = ({ children }) => (
  <HelpersContext.Provider
    value={{
      showAlert,
      setSearchResults,
      setFilterResults,
      searchResults,
      filterResults,
    }}
  >
    {children}
  </HelpersContext.Provider>
)

export const TestRouter = ({ children }) => <MemoryRouter>{children}</MemoryRouter>

export const TestSchema = ({ children, schema = { components: { schemas: {} } } }) => (
  <SchemaContext.Provider value={schema}>{children}</SchemaContext.Provider>
)

export const TestEverything = ({ children }) => (
  <TestRouter>
    <TestTheme>
      <TestHelpers>{children}</TestHelpers>
    </TestTheme>
  </TestRouter>
)

// eslint-disable-next-line no-undef
export const flushPromises = () => new Promise(setImmediate)

const customRender = (ui, options, schema = { components: { schemas: {} } }) =>
  render(<TestSchema schema={schema}>{ui}</TestSchema>, {
    wrapper: TestEverything,
    ...options,
  })

export * from '@testing-library/react'

export { customRender as render }
