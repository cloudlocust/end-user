import forOwn from 'lodash/forOwn'
import get from 'lodash/get'
import has from 'lodash/has'
import { Location } from 'history'
import { matchRoutes } from 'react-router-config'
import merge from 'lodash/merge'
import qs from 'qs'
import axios, { AxiosRequestConfig } from 'axios'
import { FC, useEffect, useState } from 'react'
import { Redirect, useLocation } from 'react-router-dom'

// TODO Is this duplicated ???
axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
    const { authenticatedToken } = JSON.parse(
        get(JSON.parse((localStorage.getItem('persist:model') as string) || '{}'), 'userModel', '{}'),
    )

    if (authenticatedToken) {
        config.headers.Authorization = authenticatedToken
    }

    /**
     * TODO Document.
     *
     * @param params TODO Document.
     * @returns  TODO Document.
     */
    config.paramsSerializer = (params: unknown) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
    }

    return config
})

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IPageSettings = {
    /**
     * TODO Document.
     */
    layout?: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * TODO Document.
         */
        navbar: // eslint-disable-next-line jsdoc/require-jsdoc
        {
            /**
             * TODO Document.
             */
            display: boolean
        }
        /**
         * TODO Document.
         */
        toolbar: // eslint-disable-next-line jsdoc/require-jsdoc
        {
            /**
             * TODO Document.
             */
            display: boolean
        }
    }
}

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IRoute = {
    /**
     * TODO Document.
     */
    path: string
    /**
     * TODO Document.
     */
    component: FC
    /**
     * TODO Document.
     */
    auth?: string[]
    /**
     * TODO Document.
     */
    settings?: IPageSettings
}

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IModuleConfig = {
    /**
     * TODO Document.
     */
    settings: IPageSettings
    /**
     * TODO Document.
     */
    auth?: string[]
    /**
     * TODO Document.
     */
    routes: IRoute[]
}

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type INavigationConfig = {
    /**
     * TODO Document.
     */
    auth?: string[]
    /**
     * TODO Document.
     */
    icon: string
    /**
     * TODO Document.
     */
    title: JSX.Element
    /**
     * TODO Document.
     */
    type: string
    /**
     * TODO Document.
     */
    url: string
}

/**
 * TODO Document.
 *
 * @param config TODO Document.
 * @returns  TODO Document.
 */
const setRoutes = (config: IModuleConfig) => {
    // We merge common settings and auth between
    let routes: IRoute[] = [...config.routes]
    routes = routes.map((route: IRoute) => {
        const auth = has(route, 'auth') ? route.auth : config.auth
        const settings: IPageSettings = merge({}, config.settings, route.settings)
        return {
            ...route,
            auth,
            settings,
        }
    })
    return [...routes] as IRoute[]
}

/**
 * TODO Document.
 *
 * @param configs TODO Document.
 * @returns TODO Document.
 */
const generateRoutesFromConfigs = (configs: IModuleConfig[]) => {
    let allRoutes: IRoute[] = []
    configs.forEach((config: IModuleConfig) => {
        allRoutes = [...allRoutes, ...setRoutes(config)]
    })

    return [
        ...allRoutes,
        {
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            // eslint-disable-next-line react/display-name
            /**
             * TODO Document.
             *
             * @returns  TODO Document.
             */
            component: (): JSX.Element => <Redirect to="/home" />,
            path: '/',
        },
        {
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            // eslint-disable-next-line react/display-name
            /**
             * TODO Document.
             *
             * @returns  TODO Document.
             */
            component: (): JSX.Element => <Redirect to="/login" />,
        },
    ]
}

/**
 *  TODO Document.
 *
 * @param routes TODO Document.
 * @returns  TODO Document.
 */
const useRouteMatch = (routes: IRoute[]): any => {
    const [state, setstate] = useState<any>(null)
    const location = useLocation<Location>()
    useEffect(() => {
        const matched: any = matchRoutes(routes, location.pathname)
        setstate(matched[0])
    }, [location, routes])
    return state
}

/**
 * TODO Documents. Handle errors in response.
 *
 * @param error TODO Documents.
 * @returns TODO Documents.
 */
const handleErrors = (error: any) => {
    if (error.response && error.response.status) {
        switch (error.response.status) {
            case 400:
                // get form_errors from response
                let errors = {}
                errors = get(error, 'response.data.form_errors')
                errors = {
                    ...errors,
                    ...get(error, 'response.data.response.errors'),
                }
                if (errors) {
                    const errorsList: string[] = []
                    // Loop through errors
                    forOwn(errors, (values, key) => {
                        if (typeof values[0] === 'string') {
                            // If the value is a string, add key value pair to errorsList
                            errorsList.push(`${key.toLocaleUpperCase()}: ${values[0]}.`)
                        } else {
                            // If the value is not a string, loop through the values add key value pair to errorsList
                            forOwn(values[0], (v, k) => {
                                errorsList.push(`${k.toLocaleUpperCase()}: ${v[0]}.`)
                            })
                        }
                    })
                    return errorsList.join('\n')
                } else {
                    return 'Something went wrong'
                }

            case 401:
                // Handle unauthorized error
                return "Vous n'avez pas le droit d'effectuer cette opération."

            default:
                return 'Service inaccessible pour le moment.'
        }
    } else {
        // If error has no response return the message of error
        return error.message
    }
}

export { axios, generateRoutesFromConfigs, handleErrors, useRouteMatch }
