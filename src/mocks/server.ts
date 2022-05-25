/** Mock requests. */
import { setupServer } from 'msw/node'
import { userEndpoints } from './handlers/user'
import { metersEndpoints } from './handlers/meters'
import { nrlinkEndpoints } from './handlers/nrlink'
import { equipmentsEndpoints } from './handlers/equipments'
import { myHouseEndpoints } from './handlers/myHouse'

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
    /******MyHouse REQUESTS*****/
    ...myHouseEndpoints,
]

// This configures a request mocking server with the given request handlers.
/**
 *
 */
export const server = setupServer(...handlers)
