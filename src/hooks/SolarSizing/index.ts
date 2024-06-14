import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * This hook is used to get the current solar sizing fron redux.
 *
 * @returns Current solar sizing.
 */
export function useCurrentSolarSizing() {
    const { solarSizing: reduxSolarSizing } = useSelector(({ housingModel }: RootState) => housingModel)

    return reduxSolarSizing
}
