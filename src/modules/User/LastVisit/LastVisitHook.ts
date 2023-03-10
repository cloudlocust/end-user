import { useCallback } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import useAxios from 'src/hooks/useAxios'

/**
 * Endpoint for last visit.
 *
 * @param userId User's id.
 * @returns Endpoint.
 */
export const LAST_VISIT_ENDPOINT = `${API_RESOURCES_URL}/users/last-visit`

/**
 * Hook that performs request about user's last visit.
 *
 * @param currentTime Current time.
 * @returns UseLastVisit hook.
 */
export const useLastVisit = (currentTime: string) => {
    const { axios, isCancel } = useAxios()

    const updateLastVisitTime = useCallback(async () => {
        try {
            await axios.patch(LAST_VISIT_ENDPOINT, { lastVisitedAt: currentTime })
        } catch (error) {
            if (isCancel(error)) return
            // A snackbar isn't necessary because this request is being performed at every page load.
            throw Error('Erreur during last visit request')
        }
    }, [axios, currentTime, isCancel])

    return { updateLastVisitTime }
}
