import { setupWorker } from 'msw'

/**
 * Handlers to mock urls for tests.
 */
// Put an any so that typescript is not complaining about setupWorker(...handlers) because needed type is RequestHandler<Record<string, any>.
// const handlers: any = []

/** Mock requests. */
import { userEndpoints } from './handlers/user'
import { metersEndpoints } from './handlers/meters'
import { nrlinkEndpoints } from './handlers/nrlink'
import { metricsEndpoints } from './handlers/metrics'

/**
 * Handlers to mock urls for tests.
 */
const handlers = [
    /******User REQUESTS*****/
    ...userEndpoints,
    /******Meters REQUESTS*****/
    ...metersEndpoints,
    /******NrLink REQUESTS*****/
    ...nrlinkEndpoints,
    /******Metrics REQUESTS*****/
    ...metricsEndpoints,
]

/**
 *
 */
export const worker = setupWorker(...handlers)
