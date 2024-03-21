import * as Sentry from '@sentry/react'
import { RouteConfig, RouterHistory, MatchPath } from '@sentry/react/types/reactrouter'

/**
 * Parameters for initializing Sentry.
 */
type InitializeSentryParams =
    /**
     * Parameters for initializing Sentry.
     */
    {
        /**
         * The Data Source Name (DSN) for Sentry.
         */
        dsn: string
        /**
         * The environment in which Sentry is being initialized.
         */
        environment: string
        /**
         * The router history from react-router.
         */
        history: RouterHistory
        /**
         * An array of route configurations.
         */
        routes: Array<RouteConfig>
        /**
         * The match path function from react-router.
         */
        matchPath: MatchPath
    }
/**
 *
 */
type InitializeSentry = (params: InitializeSentryParams) => void

/**
 * Initializes Sentry for error monitoring and performance tracking.
 *
 * @param {Object} options - The options for initializing Sentry.
 * @param {string} options.dsn - The Data Source Name (DSN) for connecting to Sentry.
 * @param {string} options.environment - The environment in which the application is running.
 * @param {Object} options.history - The history object from react-router.
 * @param {Array} options.routes - The routes configuration.
 * @param {Function} options.matchPath - The matchPath function from react-router.
 */
export const initializeSentry: InitializeSentry = ({ dsn, environment, history, routes, matchPath }) => {
    Sentry.init({
        dsn,
        environment,
        integrations: [
            // See docs for support of different versions of variation of react router
            // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
            Sentry.reactRouterV5BrowserTracingIntegration({ history, routes, matchPath }),
            Sentry.replayIntegration(),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        tracesSampleRate: 1.0,

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    })
}
