/** Mock requests. */
import { setupServer } from 'msw/node'
import { userEndpoints } from './handlers/user'
import { metersEndpoints } from './handlers/meters'
import { nrlinkEndpoints } from './handlers/nrlink'
import { consentsEndpoints } from 'src/mocks/handlers/consents'
import { equipmentsEndpoints } from './handlers/equipments'
import { accomodationEndpoints } from './handlers/accomodation'
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
    /******Equipments REQUESTS*****/
    ...equipmentsEndpoints,
    /******accomodation REQUESTS*****/
    ...accomodationEndpoints,
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
