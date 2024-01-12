/* eslint-disable no-console */
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
 * Current Client redirect link when clicking on his Logo.
 */
export const CLIENT_LOGO_REDIRECT_LINK = window._env_.REACT_APP_CLIENT_LOGO_REDIRECT_LINK || ''

/**
 * REACT_APP_NOVU_SOCKET_URL.
 */
export const REACT_APP_NOVU_SOCKET_URL = window._env_.REACT_APP_NOVU_SOCKET_URL

/**
 * REACT_APP_NOVU_BACKEND_URL.
 */
export const REACT_APP_NOVU_BACKEND_URL = window._env_.REACT_APP_NOVU_BACKEND_URL

/**
 * REACT_APP_NOVU_APPLICATION_IDENTIFIER.
 */
export const REACT_APP_NOVU_APPLICATION_IDENTIFIER = window._env_.REACT_APP_NOVU_APPLICATION_IDENTIFIER
/**
 * Env var for router basename.
 *
 * @example  "/" or "/app"
 */
export const BASENAME_URL = window._env_.REACT_APP_BASENAME_URL

/**
 * REACT_APP_FIREBASE_APIKEY.
 */
export const REACT_APP_FIREBASE_API_KEY = window._env_.REACT_APP_FIREBASE_API_KEY

/**
 * REACT_APP_FIREBASE_AUTH_DOMAIN.
 */
export const REACT_APP_FIREBASE_AUTH_DOMAIN = window._env_.REACT_APP_FIREBASE_AUTH_DOMAIN

/**
 * REACT_APP_FIREBASE_AUTH_DOMAIN.
 */
export const REACT_APP_FIREBASE_PROJECT_ID = window._env_.REACT_APP_FIREBASE_PROJECT_ID

/**
 * REACT_APP_FIREBASE_STORAGE_BUCKET.
 */
export const REACT_APP_FIREBASE_STORAGE_BUCKET = window._env_.REACT_APP_FIREBASE_STORAGE_BUCKET

/**
 * REACT_APP_FIREBASE_STORAGE_BUCKET.
 */
export const REACT_APP_FIREBASE_MESSAGING_SENDER_ID = window._env_.REACT_APP_FIREBASE_MESSAGING_SENDER_ID

/**
 * REACT_APP_FIREBASE_STORAGE_BUCKET.
 */
export const REACT_APP_FIREBASE_APP_ID = window._env_.REACT_APP_FIREBASE_APP_ID

/**
 * REACT_APP_FIREBASE_VAPID_KEY.
 */
export const REACT_APP_FIREBASE_VAPID_KEY = window._env_.REACT_APP_FIREBASE_VAPID_KEY

/**
 * Is Access Rights active.
 */
export const isAccessRightsActive = window._env_.REACT_APP_ACCESS_RIGHTS_STATE === 'enabled'

/**
 * All firebase config in one variable.
 */
export const FIREBASE_CONFIG = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
}

/**
 * Firebase Messaging Service worker URL w/config variables.
 *
 * In order for firebase-messaging-sw.js to use environment variables, it needs to do some workaround.
 * Reference: https://stackoverflow.com/a/64961858 .
 *
 */
export const FIREBASE_MESSAGING_SW_URL = `${process.env.PUBLIC_URL}/firebase-messaging-sw.js?${new URLSearchParams(
    FIREBASE_CONFIG,
).toString()}`

console.log('\n****************************** scr/configs/index.ts ********************************')
console.log(FIREBASE_MESSAGING_SW_URL)
console.log('**************************************************************************************')

/**
 * GTM ID environment variable.
 */
export const REACT_APP_GTM_ID = window._env_.REACT_APP_GTM_ID

/**
 * Tag Manager Config.
 */
export const TAG_MANAGER_CONFIG = {
    gtmId: REACT_APP_GTM_ID,
}

/**
 * FAQ redirect link.
 */
export const FAQ_REDIRECT_LINK = window._env_.REACT_APP_FAQ_REDIRECT_LINK

/**
 * Env variable that determines of we are in mauntenance mode.
 *
 * All routes should be inaccessible.
 */
export const isMaintenanceMode = window._env_.REACT_APP_IS_MAINTENANCE_MODE === 'true'
