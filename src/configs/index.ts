/**
 *
 */

declare global {
    /**
     * Extends window global variable.
     */
    interface Window {
        /**
         * Extends window to add _env_ varaible.
         */
        _env_: any
    }
}
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'test') {
        window._env_ = {}
    }
    for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith('REACT_APP_')) {
            window._env_[key] = value
        }
    }
}
/**
 * Extends window global variable.
 */
export const STATIC_PATH = process.env.PUBLIC_URL || ''

/**
 * DEPRECATED DO NOT USE BASE Api URL (www.toto.fr/api/v3 for example).
 */
export const API_BASE_URL = window._env_.REACT_APP_API_BASE_URL || ''

/**
 * LOGO URL.
 */
export const LOGO_URL = window._env_.REACT_APP_LOGO_URL

/**
 * Default language.
 */
export const DEFAULT_LOCALE = 'fr'

/**
 * MSW Activation state.
 */
export const MSW_MOCK = window._env_.REACT_APP_MSW_MOCK

/**
 * GOOGLE MAPS KEY.
 */
export const GOOGLE_MAPS_API_KEY = window._env_.REACT_APP_GOOGLE_MAPS_API_KEY

/**
 * API GATEWAY ENDPOINT.
 */
export const API_RESOURCES_URL = window._env_.REACT_APP_API_RESOURCES_URL
