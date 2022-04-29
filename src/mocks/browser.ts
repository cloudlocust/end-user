import { setupWorker } from 'msw'

/**
 * Handlers to mock urls for tests.
 */
// Put an any so that typescript is not complaining about setupWorker(...handlers) because needed type is RequestHandler<Record<string, any>.
const handlers: any = []

/** Mock requests. */
// import { userEndpoints } from './handlers/user'

/**
 * Handlers to mock urls for tests.
 */
// const handlers = [
/******InstallationsRequests REQUESTS*****/
// ...userEndpoints,
// ]

/**
 *
 */
export const worker = setupWorker(...handlers)
