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
import { equipmentsEndpoints } from './handlers/equipments'
import { accomodationEndpoints } from './handlers/accomodation'
import { metricsEndpoints } from './handlers/metrics'
import { consentsEndpoints } from 'src/mocks/handlers/consents'
import { housingEndpoints } from 'src/mocks/handlers/houses'
import { contractsEndpoints } from './handlers/contracts'
import { commercialOfferEndpoints } from 'src/mocks/handlers/commercialOffer'
import { installationRequestsEndpoints } from 'src/mocks/handlers/installationRequests'
import { solarEquipmentsEndpoints } from 'src/mocks/handlers/solarEquipments'
import { ecowattEndpoints } from 'src/mocks/handlers/ecowatt'
import { consumptionAlertsEndpoints } from 'src/mocks/handlers/consumptionAlerts'
import { ecogestesEndpoints } from './handlers/ecogestes'
import { novuALertPreferencesEndpoints } from 'src/mocks/handlers/novuAlertPreferences'

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
    /******Housing REQUESTS*****/
    ...housingEndpoints,
    /******Contracts REQUESTS*****/
    ...contractsEndpoints,
    /******Commercial Offer REQUEST*****/
    ...commercialOfferEndpoints,
    /******Installation Requests *****/
    ...installationRequestsEndpoints,
    /*** Solar Equipment requets */
    ...solarEquipmentsEndpoints,
    /** Ecowatt requests. */
    ...ecowattEndpoints,
    /** Consumption Alerts. */
    ...consumptionAlertsEndpoints,
    /** Ecogestes and categories. */
    ...ecogestesEndpoints,
    /**** Novu Alert Preferences endpoint. */
    ...novuALertPreferencesEndpoints,
]

/**
 *
 */
export const worker = setupWorker(...handlers)
