import { setupWorker } from 'msw'

/**
 * Handlers to mock urls for tests.
 */
// Put an any so that typescript is not complaining about setupWorker(...handlers) because needed type is RequestHandler<Record<string, any>.
// const handlers: any = []

/** Mock requests. */
import { userEndpoints } from 'src/mocks/handlers/user'
import { metersEndpoints } from 'src/mocks/handlers/meters'
import { nrlinkEndpoints } from 'src/mocks/handlers/nrlink'
import { equipmentsEndpoints } from 'src/mocks/handlers/equipments'
import { accomodationEndpoints } from 'src/mocks/handlers/accomodation'
import { metricsEndpoints, currentDayConsumptionEndpoints } from 'src/mocks/handlers/metrics'
import { consentsEndpoints } from 'src/mocks/handlers/consents'
import { housingEndpoints } from 'src/mocks/handlers/houses'
import { contractsEndpoints } from 'src/mocks/handlers/contracts'
import { commercialOfferEndpoints } from 'src/mocks/handlers/commercialOffer'
import { installationRequestsEndpoints } from 'src/mocks/handlers/installationRequests'
import { solarEquipmentsEndpoints } from 'src/mocks/handlers/solarEquipments'
import { ecowattEndpoints } from 'src/mocks/handlers/ecowatt'
import { consumptionAlertsEndpoints } from 'src/mocks/handlers/consumptionAlerts'
import { ecogestesEndpoints } from 'src/mocks/handlers/ecogestes'
import { novuALertPreferencesEndpoints } from 'src/mocks/handlers/novuAlertPreferences'
import { connectedPlugsEndpoints } from 'src/mocks/handlers/connectedPlugs'
import { accessRightsEndpoints } from 'src/mocks/handlers/accessRights'
import { activitiesEndpoints } from 'src/mocks/handlers/labelization'
import { DashboardEndpoints } from 'src/mocks/handlers/dashboard'
import { solarSizingEndpoints } from 'src/mocks/handlers/solarSizing'
import { AlpiqSubscriptionEndpoints } from 'src/mocks/handlers/alpiqSubscription'
import { installationEndpoints } from 'src/mocks/handlers/installation'

/**
 * Handlers to mock urls for tests.
 */
export const handlers = [
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
    /***** SolarSizing endpoints. *****/
    ...solarSizingEndpoints,
    /***** Alpiq Subscription Endpoints. *****/
    ...AlpiqSubscriptionEndpoints,
    /***** Installation informations Endpoints. *****/
    ...installationEndpoints,
    /***** Current day consumption Endpoints. *****/
    ...currentDayConsumptionEndpoints,
]

/**
 *
 */
export const worker = setupWorker(...handlers)
