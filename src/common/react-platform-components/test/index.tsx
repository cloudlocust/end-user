import { renderHook } from '@testing-library/react-hooks'
import { init } from '@rematch/core'
import { models } from 'src/models'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'
// Import your own reducer
import { TranslatitonProvider } from 'src/common/react-platform-translation'
import { SnackbarProvider } from 'src/common/react-platform-components/alerts/SnackbarProvider'

/**
 * This component wrap the render function of testing library to integrate redux stores, translation provider and SnackbarProvider.
 *
 * @param ui React component.
 * @param root0 N/A.
 * @param root0.initialState Initial state for redux store.
 * @param root0.store Redux store.
 * @returns Ui param component rendered with store and translation provider.
 */
export function reduxedRender(
    ui: JSX.Element,
    {
        initialState = {},
        store = init({
            models,
            redux: {
                initialState,
            },
        }),
        ...renderOptions
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Initial state for redux store.
         */
        initialState?: // eslint-disable-next-line jsdoc/require-jsdoc
        {}
        /**
         */
        store?: ReturnType<typeof init>
    } = {}, // https://stackoverflow.com/questions/56969950/optional-typed-immediately-destructured-parameters/56970194
) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function Wrapper({
        children,
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        children?: ReactNode
    }) {
        return (
            <React.StrictMode>
                <Provider store={store}>
                    {/* We override onError because we don't need translation text in the test 
                        and for avoid the "Message messing" error of react-intl */}
                    <TranslatitonProvider onError={(err) => {}}>
                        <SnackbarProvider>{children}</SnackbarProvider>
                    </TranslatitonProvider>
                </Provider>
            </React.StrictMode>
        )
    }
    return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * This component wrap the render hooks function of testing library to integrate redux stores, translation provider and SnackbarProvider.
 *
 * @param hookCallback Hooks to wrap.
 * @param root0 N/A.
 * @param root0.initialState Initial state for redux store.
 * @param root0.store Redux store.
 * @returns Rendered hook with store and translation wrap.
 */
export const reduxedRenderHook = (
    hookCallback: () => any,
    {
        initialState = {},
        store = init({
            models,
            redux: {
                initialState,
            },
        }),
        ...renderHookOptions
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Initial state for redux store.
         */
        initialState?: // eslint-disable-next-line jsdoc/require-jsdoc
        {}
        /**
         * Redux store.
         */
        store?: ReturnType<typeof init>
    } = {}, // https://stackoverflow.com/questions/56969950/optional-typed-immediately-destructured-parameters/56970194
) => {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function Wrapper({
        children,
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        children: ReactNode
    }) {
        return (
            <React.StrictMode>
                <Provider store={store}>
                    <SnackbarProvider>
                        <TranslatitonProvider>{children}</TranslatitonProvider>
                    </SnackbarProvider>
                </Provider>
            </React.StrictMode>
        )
    }
    return { renderedHook: renderHook(hookCallback, { wrapper: Wrapper, ...renderHookOptions }), store }
}
