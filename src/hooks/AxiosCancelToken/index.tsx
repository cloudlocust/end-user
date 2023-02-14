import { useEffect, useRef } from 'react'
import { axios } from 'src/common/react-platform-components'

/**
 *  Custom hook that uses axios cancelToken for request cancellation on component unmount.
 *
 * @returns UseAxiosCancelToken hook.
 */
export function useAxiosCancelToken() {
    const source = useRef(axios.CancelToken.source())

    /**
     * Function that cancel the request when hook unmount.
     */
    const cancelPreviousRequest = (): void => {
        source.current.cancel()
    }

    // Cancel request on unmout
    useEffect(() => {
        return () => {
            cancelPreviousRequest()
        }
    }, [])

    return { source, isCancel: axios.isCancel, cancelPreviousRequest }
}
