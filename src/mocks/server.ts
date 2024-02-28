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
import { installationRequestsEndpoints } from 'src/mocks/handlers/installationRequests'
import { solarEquipmentsEndpoints } from 'src/mocks/handlers/solarEquipments'
import { ecowattEndpoints } from 'src/mocks/handlers/ecowatt'
import { consumptionAlertsEndpoints } from 'src/mocks/handlers/consumptionAlerts'
import { ecogestesEndpoints } from 'src/mocks/handlers/ecogestes'
import { novuALertPreferencesEndpoints } from './handlers/novuAlertPreferences'
import { connectedPlugsEndpoints } from 'src/mocks/handlers/connectedPlugs'
import { accessRightsEndpoints } from './handlers/accessRights'
import { activitiesEndpoints } from './handlers/labelization'
import { DashboardEndpoints } from 'src/mocks/handlers/dashboard'
import { AlpiqSubscriptionEndpoints } from 'src/mocks/handlers/alpiqSubscription'
import { installationEndpoints } from 'src/mocks/handlers/installation'

/**
 * Handlers to mock urls for tests.
 */
const handlers = [
    /***** User endpoints *****/
    ...userEndpoints,
    /***** Meters endpoints *****/
    ...metersEndpoints,
    /***** NrLink endpoints *****/
    ...nrlinkEndpoints,
    /***** Equipments endpoints *****/
    ...equipmentsEndpoints,
    /***** accomodation endpoints *****/
    ...accomodationEndpoints,
    /***** Metrics endpoints *****/
    ...metricsEndpoints,
    /***** Consents endpoints *****/
    ...consentsEndpoints,
    /***** Housing endpoints *****/
    ...housingEndpoints,
    /***** Contracts endpoints *****/
    ...contractsEndpoints,
    /***** Commercial Offer endpoints *****/
    ...commercialOfferEndpoints,
    /***** Installation endpoints *****/
    ...installationRequestsEndpoints,
    /***** Solar Equipment endpoints *****/
    ...solarEquipmentsEndpoints,
    /***** Ecowatt endpoints. *****/
    ...ecowattEndpoints,
    /***** Consumption Alerts endpoints. *****/
    ...consumptionAlertsEndpoints,
    /***** Ecogestes and categories endpoints. *****/
    ...ecogestesEndpoints,
    /***** Novu Alert Preferences endpoints. *****/
    ...novuALertPreferencesEndpoints,
    /***** Connected Plug Consent State endpoints. *****/
    ...connectedPlugsEndpoints,
    /***** Access rights endpoints. *****/
    ...accessRightsEndpoints,
    /***** Activities endpoints. *****/
    ...activitiesEndpoints,
    /***** Dashboard endpoints. *****/
    ...DashboardEndpoints,
    /***** Alpiq Subscription Endpoints. *****/
    ...AlpiqSubscriptionEndpoints,
    /***** Installation informations Endpoints. *****/
    ...installationEndpoints,
]

// This configures a request mocking server with the given request handlers.
/**
 *
 */
export const server = setupServer(...handlers)
