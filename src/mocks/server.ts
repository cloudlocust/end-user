import { setupServer } from 'msw/node'
import { metersEndpoints } from './handlers/meters'
import { userEndpoints } from './handlers/user'
import { nrlinkEndpoints } from './handlers/nrlink'
import { consentsEndpoints } from 'src/mocks/handlers/consents'
import { metricsEndpoints } from 'src/mocks/handlers/metrics'

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
    /******Consents REQUESTS*****/
    ...consentsEndpoints,
]

// This configures a request mocking server with the given request handlers.
/**
 *
 */
export const server = setupServer(...handlers)
