import forOwn from 'lodash/forOwn'
import get from 'lodash/get'
import { Location } from 'history'
import { matchRoutes } from 'react-router-config'
import qs from 'qs'
import baseAxios, { AxiosRequestConfig, AxiosStatic } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import dayjs, { ConfigType } from 'dayjs'
import utc from 'dayjs/plugin/utc'

baseAxios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
    // Do not import store using ES6 import syntax, because axios is used by models => import this file
    // and can break things.
    const { store } = require('src/redux')
    const { userModel } = store.getState()
    const authenticationToken = userModel?.authenticationToken
    if (authenticationToken) {
        config.headers.Authorization = authenticationToken
    }

    /**
     * TODO Document.
     *
     * @param params TODO Document.
     * @returns TODO Document.
     */
    config.paramsSerializer = (params: unknown) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
    }

    return config
})

/**
 * TODO Document.
 */
export const axios = applyCaseMiddleware(baseAxios, {
    ignoreHeaders: true,
    caseFunctions: {
        /**
         * TODO Document.
         *
         * @param input TODO Document.
         * @param options TODO Document.
         * @returns TODO Document.
         */
        //TODO Correct this
        //@ts-ignore
        snake: (input: string, options: never) => {
            return input
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase()
        },
    },
    // TODO, find a way to make add additional options without having to add it here directly since it's in common.
    preservedKeys: ['addHookFilters'],
}) as AxiosStatic

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IPageSettings = {
    /**
     * TODO Document.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    layout?: {
        /**
         * TODO Document.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        navbar?: {
            /**
             * TODO Document.
             */
            display?: boolean
            /**
             * Represent the UI item that will be displayed in the navbar for this route, using the fuse template with this link can also have its own children.
             */
            UINavbarItem?: navbarItemType
        }
        /**
         * TODO Document.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        toolbar?: {
            /**
             * TODO Document.
             */
            display?: boolean
        }
    }
}
// WE CAN SET ABAILABLE ROLES IN CONFIG
/**
 * Required authentication information for a resource.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type authT = {
    /**
     * Authentication type requested.
     */
    authType: authTypes
    /**
     * Roles accepted for the resource.
     */
    roles?: string[]
}

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IRoute<T> = {
    /**
     * TODO Document.
     */
    path: string
    /**
     * TODO Document.
     */
    component: FC<T>
    /**
     * TODO Document.
     */
    auth: authT
    /**
     * TODO Document.
     */
    settings?: IPageSettings
    /**
     * TODO Document.
     */
    props?: T
}

/**
 * Authentication type requested for a resource .
 */
export enum authTypes {
    /**
     * User must be authenticated for the resource.
     */
    loginRequired,
    /**
     * User mustn't be authenticated to access this resource.
     */
    anonymousRequired,
    /**
     * Everybody can acess to this resource.
     */
    freeAccess,
}
/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type IModuleConfig<T> = {
    /**
     * TODO Document.
     */
    settings: IPageSettings
    /**
     * TODO Document.
     */
    routes: /**
     * TODO Document.
     */
    { [key: string]: IRoute<T> }
}

/**
 * TODO Document.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type INavigationConfig = {
    /**
     * TODO Document.
     */
    icon: string
    /**
     * TODO Document.
     */
    title: JSX.Element | string
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
 * @param routes TODO Document.
 * @returns TODO Document.
 */
const useRouteMatch = (routes: IRoute<unknown>[]): any => {
    const [state, setstate] = useState<any>(null)
    const location = useLocation<Location>()
    useEffect(() => {
        const matched: any = matchRoutes(routes, location.pathname)
        setstate(matched[0])
    }, [location, routes])
    return state
}

/**
 * TODO Document.Handle errors in response.
 *
 * @param error TODO Document.
 * @returns TODO Document.
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

export { handleErrors, useRouteMatch }

/**
 * Function used as a catch(error) in the hook functions, returning whether a new Error or the error itself.
 *
 * @param error Exception error.
 * @returns Whether a new Error if the exception is string, or the error itself.
 */
export const catchError = (error: unknown) => {
    if (typeof error === 'string') return new Error(error)
    else return new Error('Une Erreur est survenue')
}

/**
 * Utility function to convert input string s into camelCase.
 *
 * @param s String to apply camelCase.
 * @returns CamelCase s.
 */
const toCamelCase = (s: string) => {
    return s.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '')
    })
}
/**
 * Utility function used to apply camel case especially to testing when receiving data from backend.
 *
 * @param o It can be whether (from object to array).
 * @returns The object or array of object with its keys to camelCase.
 */
export const applyCamelCase: (o: any) => any = (o) => {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
        const n: any = {}

        Object.keys(o).forEach((k) => {
            n[toCamelCase(k)] = applyCamelCase(o[k])
        })

        return n
    } else if (Array.isArray(o)) {
        return o.map((i) => {
            return applyCamelCase(i)
        })
    }

    return o
}

/**
 * The type returned when fetching different data with pagination (size, items, page, total).
 */
export interface ILoadDataPagination<itemsType> {
    /**
     * The data loaded and put in variable items.
     */
    items: itemsType
    /**
     * The number of the page the items are stored.
     */
    page: number
    /**
     * Total items returned.
     */
    total: number
    /**
     * The total size asked default is 500.
     */
    size: number
}

/**
 * Dayjs package library with the utc plugin for any date given, so that we can instantly format the date.
 */
dayjs.extend(utc)
// eslint-disable-next-line jsdoc/require-jsdoc
export const dayjsUTC = (config?: ConfigType, format?: string, strict?: boolean) =>
    dayjs.utc(config, format, strict).local()
