import { setupWorker } from 'msw'

/**
 * Handlers to mock urls for tests.
 */
// Put an any so that typescript is not complaining about setupWorker(...handlers) because needed type is RequestHandler<Record<string, any>.
const handlers: any = []

/** Mock requests. */
// import commentsREST from './handlers/comments'
// import notificationsREST from './handlers/notifications'
// import customersREST from './handlers/customers'
// import metersEndpoints from './handlers/meters'
// import equipmentsEndpoints from './handlers/equipments'
// import installationsRequestsRest from './handlers/installationsRequests'
// import { userEndpoints } from './handlers/user'

// /**
//  * Handlers to mock urls for tests.
//  */
// const handlers = [
//     /********* METER REQUESTS ****************/
//     ...metersEndpoints,

// /********* EQUIPMENT REQUESTS ****************/
// ...equipmentsEndpoints,

//     /*********** COMMENT REQUESTS. ***********/
//     ...commentsREST,
//     /*********** NOTIFICATIONS REQUESTS. ***********/
//     ...notificationsREST,

// /******InstallationsRequests REQUESTS*****/
// ...installationsRequestsRest,
// ...userEndpoints,
// ...customersREST,
// ]

/**
 *
 */
export const worker = setupWorker(...handlers)
