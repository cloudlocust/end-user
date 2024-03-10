import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import { BASENAME_URL, MSW_MOCK, SENTRY_DSN, CLIENT_ENVIRONNEMENT } from './configs'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'
import 'typeface-poppins'
import 'src/common/ui-kit/fuse/styles/app-base.css'
import 'src/common/ui-kit/fuse/styles/app-components.css'
import 'src/common/ui-kit/fuse/styles/app-utilities.css'
import { StyledEngineProvider } from '@mui/material/styles'
import App from './App'
import { store } from './redux'
import { Router, BrowserRouter, matchPath } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { getPersistor } from '@rematch/persist'
import { TranslatitonProvider, LOAD_TRANSLATIONS } from 'src/common/react-platform-translation'
import { SnackbarProvider } from 'src/common/react-platform-components/alerts/SnackbarProvider'
import { pwaTrackingListeners } from './pwaEventlisteners'
import TagManager from 'react-gtm-module'
import { TAG_MANAGER_CONFIG } from 'src/configs'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserHistory } from 'history'
import { routes } from 'src/routes'
import { initializeSentry } from 'src/monitoring/sentry'

/**
 * The history object for browser navigation.
 */
const history = createBrowserHistory()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
})

const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
    pwaTrackingListeners()
}

/**
 * Main app.
 *
 * @returns Main app.
 */
const Application: FC<any> = () => {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <StyledEngineProvider injectFirst>
                    <Provider store={store}>
                        <PersistGate persistor={getPersistor()}>
                            <TranslatitonProvider>
                                <Router history={history}>
                                    <BrowserRouter basename={BASENAME_URL} getUserConfirmation={() => {}}>
                                        <SnackbarProvider>
                                            <App />
                                        </SnackbarProvider>
                                    </BrowserRouter>
                                </Router>
                            </TranslatitonProvider>
                        </PersistGate>
                    </Provider>
                </StyledEngineProvider>
            </QueryClientProvider>
        </React.StrictMode>
    )
}

/**
 * TODO Document.
 *
 * @returns TODO Document.
 */
async function bootstrapApplication() {
    try {
        await store.dispatch({ type: LOAD_TRANSLATIONS })
    } catch (error) {}
    return <Application />
}

// Initialize google tag manager
TagManager.initialize(TAG_MANAGER_CONFIG)

if (process.env.NODE_ENV === 'production') {
    // Initialize sentry for bugs tracking.
    initializeSentry({
        dsn: SENTRY_DSN,
        environment: CLIENT_ENVIRONNEMENT,
        history,
        matchPath,
        routes: routes.map((route) => ({ path: route.path })),
    })
}

bootstrapApplication().then((app) => {
    ReactDOM.render(app, document.getElementById('root'))
})

// In order to activate MSW, you have to set the env variable to enabled in env.development.
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'development' && MSW_MOCK === 'enabled') {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/mockServiceWorker.js`)
    const { worker } = require('src/mocks/browser')
    worker.start()
}

// PWA service worker should only be working in production mode.
if (isBrowser && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
        await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/pwaSW.js`)
    })
}

// ReactDOM.render(<Application />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
