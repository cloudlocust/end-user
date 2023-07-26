import { useEffect, useState, useCallback, useRef } from 'react'
import { AxiosResponse } from 'axios'
import { axios, catchError } from 'src/common/react-platform-components'
import { useIntl, formatMessageType } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { ILoadDataPagination } from 'src/common/react-platform-components/utils/mm'
import { getQueryParamsFromFiltersObject } from 'src/modules/utils'
import { useAxiosCancelToken } from 'src/hooks/AxiosCancelToken'

/**
 * T: Type one element in the elementList (model of data basically).
 * U: Type of the body in addElement POST Request.
 * K: Type of filter.
 * N: type of isPaginationTable input param, that will indicate what kind of returned functions we'll have in our pagination.
 */

/**
 * Type of the returned Functions that are common in useElementList no matter the pagination type (TablePagination or InfiniteScroll).
 */
interface useElementListCommonFunctions<T, U, K> {
    // eslint-disable-next-line jsdoc/require-jsdoc
    reloadElements: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    updateFilters: (newFilters: K) => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadingInProgress: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    elementList: T[] | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    addElement: (body: U) => Promise<T>
    // eslint-disable-next-line jsdoc/require-jsdoc
    totalElementList: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadElementList: () => void
}

/**
 * Type of the returned Functions of useElementList related to TablePagination.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
type useElementListTableFunctions<T, U, K> = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadPage: (page: number) => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    nextPage: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    previousPage: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    page: number
} & useElementListCommonFunctions<T, U, K>

/**
 * Type of the returned Functions of useElementList related to Infinite Scroll.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
type useElementListInfiniteScrollFunctions<T, U, K> = {
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadMoreElements: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    noMoreElementToLoad: boolean
} & useElementListCommonFunctions<T, U, K>

/**
 * We are doing an advanced operation in typescript which is CONDITIONAL TYPE, to indicate the final type of useElementList, which represents what are the functions that will be returned for useElementList.
 * Conditional Type is the same as If/Else statement, where in typescript extends kinda represents ('===' operator) in javascript.
 * Thus the following expression (N extends true) in javascript translates to (N === true ? [useElementList will return TableFunctions] : [useElementList will return InfiniteScroll Functions]).
 * Where N represent the type of 'isPaginationTable' input, and InfiniteScroll and Table represent the type of pagination, which both will have some functions specific to each.
 * Reference Example: https://stackoverflow.com/a/54166010.
 *
 *
 * By Implementing this Conditional Type, it'll use the power of typescript, so that we will have typescript errors.
 * For Example: we'll have an error when importing 'loadPage' when we give false for isTablePagination input, because for typescript false means infiniteScroll and thus loadPage is not returned for infiniteScroll.
 */
type useElementListFunctionsType<T, U, K, N> = N extends true
    ? useElementListTableFunctions<T, U, K>
    : useElementListInfiniteScrollFunctions<T, U, K>

/**
 * Function that returns customer snackbar message for overriding the default useElementList messages.
 */
export type snackBarMessage0verrideType<responseDataType> =
    // eslint-disable-next-line jsdoc/require-jsdoc
    | {
          // eslint-disable-next-line jsdoc/require-jsdoc
          addElementSuccess?: (responseData: responseDataType, formatMessage: formatMessageType) => string
          // eslint-disable-next-line jsdoc/require-jsdoc
          addElementError?: (error: any, formatMessage: formatMessageType) => string
          // eslint-disable-next-line jsdoc/require-jsdoc
          loadElementListError?: (error: any, formatMessage: formatMessageType) => string
      }
    | undefined

/**
 * Function that returns custom snackbar messages for useElementDetails functions.
 */
export type elementDetailsSnackBarMessage0verrideType<T, K> =
    // eslint-disable-next-line jsdoc/require-jsdoc
    | {
          /**
           *  Callback returns the fail load elementDetails snackbar message.
           */
          loadElementDetailsError?: (error: any, formatMessage: formatMessageType) => string
          /**
           *  Callback returns the success edit elementDetails snackbar message.
           */
          editElementDetailsSuccess?: (responseData: T, formatMessage: formatMessageType) => string
          /**
           *  Callback returns the fail edit elementDetails snackbar message.
           */
          editElementDetailsError?: (error: any, formatMessage: formatMessageType) => string
          /**
           *  Callback returns the success remove elementDetails snackbar message.
           */
          removeElementDetailsSuccess?: (responseData: K, formatMessage: formatMessageType) => string
          /**
           *  Callback returns the fail remove elementDetails snackbar message.
           */
          removeElementDetailsError?: (error: any, formatMessage: formatMessageType) => string
      }
    | undefined

/**
 * Builder for implementing useElement.
 *
 * @param props N/A.
 * @param props.API_ENDPOINT Represent the endpoint for all request of the customer useElementList.
 * @param props.sizeParam Default SizeParam when instanciating useElementList.
 * @param props.snackBarMessage0verride Function that returns Custom snackbar message for overriding the default useElementList messages.
 * @param props.immediate Indicates if the called on instantiation or not.
 * @returns Builder for implement useElementList hook.
 */
export function BuilderUseElementList<T, U, K>({
    API_ENDPOINT,
    sizeParam,
    snackBarMessage0verride,
    immediate = true,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    API_ENDPOINT: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    sizeParam?: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    snackBarMessage0verride?: snackBarMessage0verrideType<T>
    // eslint-disable-next-line jsdoc/require-jsdoc
    immediate?: boolean
}) {
    /**
    `* Hooks for customersList.
     *
     * @param isTablePagination Indicate if the useElementList will Load data using TablePagination type by loading and setting elementList from a given page ...etc.
     * @param defaultFilters Default filters to be passed to the API END POINT queryParams. Empty Object {} means no default query params.
     * @returns UseCustomers hook.
    */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    function useElementList<N extends undefined | boolean = undefined>(isTablePagination?: N, defaultFilters = {}) {
        const [elementList, setElementList] = useState<T[] | null>(null)
        const [loadingInProgress, setLoadingInProgress] = useState(false)
        const [noMoreElementToLoad, setNoMoreElementToLoad] = useState(false)
        // totalElementList represent the total size of all data that can be return from backend, the filters query will affect the total possible returned.
        const [totalElementList, setTotalElementList] = useState(0)
        const [page, setPage] = useState(1)
        // Use Ref is used so not to have sideEffect with reload of state, as it is stored and used.
        const size = useRef(sizeParam ? sizeParam : 10)
        // eslint-disable-next-line jsdoc/require-jsdoc
        const filters = useRef<K | {}>(defaultFilters)
        const { enqueueSnackbar } = useSnackbar()
        const { formatMessage } = useIntl()
        const isInitialMount = useRef(true)
        const { source, isCancel } = useAxiosCancelToken()

        /**
         * Load Customers function responsing for fetching customersList.
         *
         * @returns The function returns a string message containing successful and errors message.
         */
        const loadElementList = useCallback(async () => {
            setLoadingInProgress(true)

            let endpointUrl = `${API_ENDPOINT}?size=${size.current}&page=${page}&${getQueryParamsFromFiltersObject(
                filters.current,
            )}`

            try {
                const { data: responseData } = await axios.get<ILoadDataPagination<T[]>>(`${endpointUrl}`, {
                    cancelToken: source.current.token,
                })
                if (isTablePagination || page === 1) {
                    setElementList(responseData.items)
                } else {
                    setElementList((prevCustomersList: T[] | null) => {
                        const newCustomersList = prevCustomersList ? [...prevCustomersList] : []
                        return newCustomersList.concat(responseData.items)
                    })
                }
                setTotalElementList(responseData.total)
                setNoMoreElementToLoad(responseData.page * responseData.size >= responseData.total ? true : false)
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.loadElementListError
                        ? snackBarMessage0verride.loadElementListError(error, formatMessage)
                        : formatMessage({
                              id: 'Erreur lors du chargement de la liste des éléments',
                              defaultMessage: 'Erreur lors du chargement de la liste des éléments',
                          }),
                    { variant: 'error' },
                )
            }
            setLoadingInProgress(false)
        }, [page, source, isTablePagination, isCancel, enqueueSnackbar, formatMessage])

        // UseEffect to trigger loadElement List on every page change, besides it won't trigger when hook isInstiantiated.
        useEffect(() => {
            if (!isInitialMount.current) {
                loadElementList()
            }
        }, [page, loadElementList])

        // UseEffect executes on initial intantiation of useElementList, responsible for loadElementList on initialLoad.
        useEffect(() => {
            if (isInitialMount.current) {
                if (immediate) loadElementList()
                isInitialMount.current = false
            }
        }, [loadElementList])

        /**
         * Handler to reload elements with page === 1.
         */
        const reloadElements = () => {
            if (page === 1) loadElementList()
            else setPage(1)
        }

        /**
         * Set Filters function, to change the filters state with a new filter.
         *
         * @param newFilters New Filters represent the new value of one of the prevFilter or new values for all the previous filters.
         */
        const updateFilters = (newFilters: K) => {
            filters.current = {
                ...filters.current,
                ...newFilters,
            }
            reloadElements()
        }

        // TODO Explain if we need to reload from the Hook (through ) or the component itself.
        /**
         * Add Customer function.
         *
         * @param body N/A.
         * @param body.firstname Potentially the new firstName of the customer.
         * @param body.lastname Potentially the new lastName of the customer.
         * @param body.email  Potentially the new email of the customer.
         * @param body.phone Potentially the new phone of the customer.
         * @param body.address Potentially the new address of the customer.
         * @returns Message Succes or Fail.
         */
        const addElement = async (body: U) => {
            setLoadingInProgress(true)
            try {
                const { data: responseData } = await axios.post<U, AxiosResponse<T>>(`${API_ENDPOINT}`, body, {
                    cancelToken: source.current.token,
                })

                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.addElementSuccess
                        ? snackBarMessage0verride.addElementSuccess(responseData, formatMessage)
                        : formatMessage({
                              id: "Succès lors de l'ajout de l'élément",
                              defaultMessage: "Succès lors de l'ajout de l'élément",
                          }),
                    { variant: 'success' },
                )
                setLoadingInProgress(false)
                return responseData
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.addElementError
                        ? snackBarMessage0verride.addElementError(error, formatMessage)
                        : formatMessage({
                              id: "Erreur lors de l'ajout de l'élément",
                              defaultMessage: "Erreur lors de l'ajout de l'élément",
                          }),
                    { variant: 'error' },
                )
                setLoadingInProgress(false)
                throw catchError(error)
            }
        }

        const useElementListFunctions = {
            reloadElements,
            updateFilters,
            loadingInProgress,
            elementList,
            addElement,
            noMoreElementToLoad,
            totalElementList,
            loadElementList,
            /**
             * LoadMoreElements that represents the function that increments the page state.
             *
             * @returns The function that increments the page state.
             */
            loadMoreElements: () => setPage((prevPage) => prevPage + 1),
        }
        /**
         * UseElementList will return different Functions based on the isPaginationTable.
         * Basically we are fetching data with backend pagination.
         * But in FrontEnd we will have a view for InfiniteScroll (For example we'll find a Button 'LoadMore'), and a different view for PaginationTable (For example, we'll have a table with Icons '>' indicating NextPage).
         *
         * And thus based on the pagination we'll have different returned functions that will be used in our views.
         * Both will have CommonFunctions: (reloadElements, updateFilters, loadingInProgress, elementList, addElement, totalElementList)
         * Infinite Scroll Specific functions: (loadMoreElements, noMoreElementToLoad).
         * Pagination Table specific functions: (loadPage, previousPage, nextPage, page).
         */
        if (isTablePagination) {
            const { loadMoreElements, noMoreElementToLoad, ...commonUseElementListFunctions } = useElementListFunctions
            return {
                ...commonUseElementListFunctions,
                /**
                 * LoadPage function used by TablePagination to load elements at the given page.
                 *
                 * @param page Elements to be loaded from the given page.
                 * @returns LoadPage function.
                 */
                loadPage: (page: number) => setPage(page),
                /**
                 * PrevPage function used by TablePagination to load elements with current state page-1.
                 *
                 * @returns PrevPage.
                 */
                previousPage: () => setPage((prevPage) => prevPage - 1),
                nextPage: loadMoreElements,
                page,
            } as unknown as useElementListFunctionsType<T, U, K, N>
        }
        return useElementListFunctions as unknown as useElementListFunctionsType<T, U, K, N>
    }
    return useElementList
}

/**
 * Builder for implementing useElementDetails.
 *
 * @param props N/A.
 * @param props.API_ENDPOINT Represent the endpoint for all requests of the useElementDetails.
 * @param props.isLoadElementDetailsOnHookInstanciation Boolean indicating if the we load element details when hook is instanciated.
 * @param props.snackBarMessage0verride Function that returns Custom snackbar message for overriding the default useElementDetails messages.
 * @returns Builder for implement useElementDetails hook.
 */
export function BuilderUseElementDetails<T, U, K>({
    API_ENDPOINT,
    isLoadElementDetailsOnHookInstanciation,
    snackBarMessage0verride,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    API_ENDPOINT: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    isLoadElementDetailsOnHookInstanciation?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    snackBarMessage0verride?: elementDetailsSnackBarMessage0verrideType<T, K>
}) {
    /**
    `* Hooks for elementDetails.
     *
     * @returns Hook useElementDetails.
    */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    function useElementDetails() {
        const [elementDetails, setElementDetails] = useState<T | null>(null)
        const [loadingInProgress, setLoadingInProgress] = useState(false)
        const { enqueueSnackbar } = useSnackbar()
        const { formatMessage } = useIntl()
        const isInitialMount = useRef(true)
        const { source, isCancel } = useAxiosCancelToken()

        /**
         * Load Element Details function.
         */
        const loadElementDetails = useCallback(async () => {
            setLoadingInProgress(true)

            try {
                const { data: responseData } = await axios.get<T>(`${API_ENDPOINT}`, {
                    cancelToken: source.current.token,
                })
                setElementDetails(responseData)
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.loadElementDetailsError
                        ? snackBarMessage0verride.loadElementDetailsError(error, formatMessage)
                        : formatMessage({
                              id: "Erreur lors du chargement de l'élément",
                              defaultMessage: "Erreur lors du chargement de l'élément",
                          }),
                    { variant: 'error' },
                )
            }
            setLoadingInProgress(false)
        }, [source, isCancel, enqueueSnackbar, formatMessage])

        // UseEffect executes on initial intantiation of useElementDetails, responsible for loadElementDetails on initial instanciation of hook.
        useEffect(() => {
            if (isInitialMount.current && isLoadElementDetailsOnHookInstanciation) {
                isInitialMount.current = false
                loadElementDetails()
            }
        }, [loadElementDetails])

        /**
         * Edit Element Details function.
         *
         * @param body Updated elementDetails Request body.
         * @returns Updated ElementDetails.
         */
        const editElementDetails = async (body: U) => {
            setLoadingInProgress(true)
            try {
                const { data: responseData } = await axios.put<T, AxiosResponse<T>>(`${API_ENDPOINT}`, body, {
                    cancelToken: source.current.token,
                })

                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.editElementDetailsSuccess
                        ? snackBarMessage0verride.editElementDetailsSuccess(responseData, formatMessage)
                        : formatMessage({
                              id: "Succès lors de la modification de l'élément",
                              defaultMessage: "Succès lors de la modification de l'élément",
                          }),
                    { variant: 'success' },
                )
                setLoadingInProgress(false)
                setElementDetails(responseData)
                return responseData
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.editElementDetailsError
                        ? snackBarMessage0verride.editElementDetailsError(error, formatMessage)
                        : formatMessage({
                              id: "Erreur lors de la modification de l'élément",
                              defaultMessage: "Erreur lors de la modification de l'élément",
                          }),
                    { variant: 'error' },
                )
                setLoadingInProgress(false)
            }
        }

        /**
         * Remove Element Details function.
         *
         * @returns Deleted elementDetails.
         */
        const removeElementDetails = async () => {
            setLoadingInProgress(true)
            try {
                const { data: responseData } = await axios.delete<K, AxiosResponse<K>>(`${API_ENDPOINT}`, {
                    cancelToken: source.current.token,
                })
                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.removeElementDetailsSuccess
                        ? snackBarMessage0verride.removeElementDetailsSuccess(responseData, formatMessage)
                        : formatMessage({
                              id: "Succès lors de la suppression de l'élément",
                              defaultMessage: "Succès lors de la suppression de l'élément",
                          }),
                    { variant: 'success' },
                )
                setLoadingInProgress(false)
                setElementDetails(null)
                return responseData
            } catch (error) {
                if (isCancel(error)) return
                enqueueSnackbar(
                    snackBarMessage0verride && snackBarMessage0verride.removeElementDetailsError
                        ? snackBarMessage0verride.removeElementDetailsError(error, formatMessage)
                        : formatMessage({
                              id: "Erreur lors de la suppression de l'élément",
                              defaultMessage: "Erreur lors de la suppression de l'élément",
                          }),
                    { variant: 'error' },
                )
                setLoadingInProgress(false)
            }
        }

        return {
            loadElementDetails,
            loadingInProgress,
            elementDetails,
            removeElementDetails,
            editElementDetails,
        }
    }
    return useElementDetails
}
