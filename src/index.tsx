import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import { MSW_MOCK } from './configs'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'
import 'typeface-poppins'
import 'src/common/ui-kit/fuse/styles/app-base.css'
import 'src/common/ui-kit/fuse/styles/app-components.css'
import 'src/common/ui-kit/fuse/styles/app-utilities.css'
import { StyledEngineProvider } from '@mui/material/styles'
import App from './App'
import { store } from './redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { getPersistor } from '@rematch/persist'
import { TranslatitonProvider, LOAD_TRANSLATIONS } from 'src/common/react-platform-translation'
import { SnackbarProvider } from 'src/common/react-platform-components/alerts/SnackbarProvider'
import { pwaTrackingListeners } from './pwaEventlisteners'

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
            <StyledEngineProvider injectFirst>
                <Provider store={store}>
                    <PersistGate persistor={getPersistor()}>
                        <TranslatitonProvider>
                            <Router>
                                <SnackbarProvider>
                                    <App />
                                </SnackbarProvider>
                            </Router>
                        </TranslatitonProvider>
                    </PersistGate>
                </Provider>
            </StyledEngineProvider>
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

bootstrapApplication().then((app) => {
    ReactDOM.render(app, document.getElementById('root'))
})

/**
 * TODO Made sure that the PWA service worker is loaded only in Production environement.
 * Add NODE_ENV === "production" to the condition.
 */
if (isBrowser && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/pwaSW.js`)
        /**
         * Start the mocking browser conditionally, only during development.
         * MSW Browser not working because registering PWA Service Working.
         * HINT REFERENCE: https://mswjs.io/docs/getting-started/integrate/browser#create-react-app-version-3 .
         */
        if (MSW_MOCK === 'enabled') {
            await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/mockServiceWorker.js`)
            const { worker } = require('src/mocks/browser')
            worker.start()
        }
    })
}

// ReactDOM.render(<Application />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
