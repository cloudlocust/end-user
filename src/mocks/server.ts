/** Mock requests. */
import { setupServer } from 'msw/node'
import { userEndpoints } from './handlers/user'
import { metersEndpoints } from './handlers/meters'
import { nrlinkEndpoints } from './handlers/nrlink'
import { consentsEndpoints } from 'src/mocks/handlers/consents'
import { equipmentsEndpoints } from './handlers/equipments'
import { accomodationEndpoints } from './handlers/accomodation'
import { metricsEndpoints } from './handlers/metrics'
import { housingEndpoints } from 'src/mocks/handlers/houses'
import { contractsEndpoints } from 'src/mocks/handlers/contracts'
import { commercialOfferEndpoints } from 'src/mocks/handlers/commercialOffer'
import { faqEndpoints } from 'src/mocks/handlers/faq'
import { installationRequestsEndpoints } from 'src/mocks/handlers/installationRequests'
import { solarEquipmentsEndpoints } from 'src/mocks/handlers/solarEquipments'
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
    /******Consents REQUESTS*****/
    ...housingEndpoints,
    /******Contracts REQUESTS*****/
    ...contractsEndpoints,
    /******Commercial Offer REQUEST*****/
    ...commercialOfferEndpoints,
    /******FAQ REQUESTS*****/
    ...faqEndpoints,
    /******Installation Requests *****/
    ...installationRequestsEndpoints,
    /*** Solar Equipment requets */
    ...solarEquipmentsEndpoints,
]

// This configures a request mocking server with the given request handlers.
/**
 *
 */
export const server = setupServer(...handlers)
