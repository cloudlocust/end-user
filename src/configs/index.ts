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
    if (process.env.NODE_ENV === 'test' || process.env.STORYBOOK) {
        window._env_ = {}
    }
    for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith('REACT_APP_')) {
            window._env_[key] = value
        }
    }
    // To avoid errors when starting app on localhost, we duplicate PWA related tags in here because when starting app on localhost, index.html it doesn't yet know window._env_ that's why we define it here.
    if (process.env.NODE_ENV === 'development') {
        const REACT_APP_CLIENT_ICON_FOLDER = window._env_.REACT_APP_CLIENT_ICON_FOLDER
        document.getElementById('apple-touch-icon-link') &&
            document
                .getElementById('apple-touch-icon-link')!
                .setAttribute('href', `/clients-icons/${REACT_APP_CLIENT_ICON_FOLDER}/logo192x192.png`)
        document.getElementById('manifest-link') &&
            document
                .getElementById('manifest-link')!
                .setAttribute('href', `/clients-icons/${REACT_APP_CLIENT_ICON_FOLDER}/manifest.json`)
        document.getElementById('icon-link') &&
            document
                .getElementById('icon-link')!
                .setAttribute('href', `/clients-icons/${REACT_APP_CLIENT_ICON_FOLDER}/favicon.ico`)
        document.title = window._env_.REACT_APP_TITLE
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

/**
 * Current Client Environment Folder.
 */
export const CLIENT_ICON_FOLDER = window._env_.REACT_APP_CLIENT_ICON_FOLDER

/**
 * Env var for router basename.
 *
 * @example  "/" or "/app"
 */
export const BASENAME_URL = window._env_.REACT_APP_BASENAME_URL
