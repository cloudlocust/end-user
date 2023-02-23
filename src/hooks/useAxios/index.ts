import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useEffect, useRef } from 'react'
import qs from 'qs'
import applyCaseMiddleware from 'axios-case-converter'

/**
 * Custom axios hook that handles request cancellation.
 * It creates an instance of axios and pass a source token for every request.
 * When the component is unmounted, the request gets cancelled.
 *
 * @param config AxiosRequestConfig.
 * @description Be aware: wait until request is fully performed before changing a page or doing a redirection.
 * @returns Axios instance & isCancel function that checks if request is cancelled.
 */
const useAxios = (config?: AxiosRequestConfig) => {
    const source = useRef(axios.CancelToken.source())
    const instance = useRef<AxiosInstance>(axios.create({ ...config, cancelToken: source.current.token }))

    useEffect(() => {
        let sourceRefValue = source.current

        instance.current.interceptors.request.use((config) => {
            const { store } = require('src/redux')
            const { userModel } = store.getState()
            const authenticationToken = userModel?.authenticationToken
            if (authenticationToken) {
                config!.headers!.Authorization = authenticationToken
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

        instance.current.interceptors.response.use(
            (response) => {
                // Perform response configuration here
                return response
            },
            (error) => {
                // Handle response error here
                return Promise.reject(error)
            },
        )

        applyCaseMiddleware(instance.current, {
            ignoreHeaders: true,
            caseFunctions: {
                /**
                 * TODO Document.
                 *
                 * @param input TODO Document.
                 * @param options TODO Document.
                 * @returns TODO Document.
                 */
                //@ts-ignore
                snake: (input: string, options: never) => {
                    return input
                        .split(/(?=[A-Z])/)
                        .join('_')
                        .toLowerCase()
                },
            },
            preservedKeys: ['adhocFilters'],
        })

        return () => {
            sourceRefValue.cancel('Cancelling previous request')
        }
    }, [])

    return { axios: instance.current, isCancel: axios.isCancel }
}

export default useAxios
