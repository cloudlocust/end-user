// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// src/setupTests.js
let serverImport: any
// Establish API mocking before all tests.
beforeAll(() => {
    // Do not import server at the top of the file, because, they potentially import
    // elements from other components, which make jest.mock not working sometimes.
    serverImport = require('src/mocks/server')
    // Used for removing error, warn, info and debug consoles when test mode.
    // jest.spyOn(console, 'error').mockImplementation(() => {})
    // jest.spyOn(console, 'warn').mockImplementation(() => {})
    // jest.spyOn(console, 'info').mockImplementation(() => {})
    // jest.spyOn(console, 'debug').mockImplementation(() => {})
    serverImport.server.listen()
})
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
    serverImport?.server.resetHandlers()
})
// Clean up after the tests are finished.
afterAll(() => {
    serverImport?.server.close()
})
