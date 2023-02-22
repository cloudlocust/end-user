import { useCallback } from 'react'
import { API_RESOURCES_URL } from 'src/configs'
import useAxios from 'src/hooks/useAxios'

/**
 * Endpoint for last visit.
 *
 * @param userId User's id.
 * @returns Endpoint.
 */
export const LAST_VISIT_ENDPOINT = (userId?: string) => `${API_RESOURCES_URL}/users/${userId}/last-visit`

/**
 * Hook that performs request about user's last visit.
 *
 * @param userId Current id of the connected user.
 * @param currentTime Current time.
 * @returns UseLastVisit hook.
 */
export const useLastVisit = (userId: string | null, currentTime: string) => {
    const { axios, isCancel } = useAxios()

    const updateLastVisitTime = useCallback(async () => {
        try {
            if (!userId) return
            await axios.patch(LAST_VISIT_ENDPOINT(userId), { lastVisitedAt: currentTime })
        } catch (error) {
            if (isCancel(error)) return
        }
    }, [axios, currentTime, isCancel, userId])

    return { updateLastVisitTime }
}
