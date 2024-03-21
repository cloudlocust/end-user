import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * Custom hook to get the current housing.
 *
 * @returns Current housing in redux store.
 */
export const useCurrentHousing = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    return currentHousing
}
