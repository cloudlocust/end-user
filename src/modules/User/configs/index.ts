// There is some handlers in test that will import src/modules/User/configs without going through src/configs thus it'll create error of window._env_ undefined, and this fixes it.
if (process.env.NODE_ENV === 'test' && !window._env_) {
    window._env_ = {}
}
/**
 * Authentication url.
 */
export const AUTH_BASE_URL = window._env_.REACT_APP_AUTH_BASE_URL
