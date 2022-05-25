import { setupServer } from 'msw/node'
import { metersEndpoints } from './handlers/meters'
import { userEndpoints } from './handlers/user'
import { nrlinkEndpoints } from './handlers/nrlink'
import { equipmentsEndpoints } from './handlers/equipments'
import { profilEndpoints } from './handlers/profile'

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
    /******Profile REQUESTS*****/
    ...profilEndpoints,
]

// This configures a request mocking server with the given request handlers.
/**
 *
 */
export const server = setupServer(...handlers)
