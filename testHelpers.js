/* eslint-disable react/prop-types */
import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { HelpersContext, SchemaContext } from './contexts'
import { MemoryRouter } from 'react-router-dom'

export const TestTheme = ({ children }) => (
  <MuiThemeProvider theme={createMuiTheme()}>{children}</MuiThemeProvider>
)


export const TestHelpers = ({
  children,
  showAlert = jest.fn(),
  setSearchResults = jest.fn(),
  setFilterResults = jest.fn(),
  searchResults = [],
  filterResults = [],
}) => (
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

export const TestEverything = ({ children, schema, helpers }) => (
  <TestTheme>
    <TestHelpers {...helpers}>
      <TestSchema schema={schema}>{children}</TestSchema>
    </TestHelpers>
  </TestTheme>
)

export const flushPromises = () => new Promise(setImmediate)
