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

/**
 * Custom hook to get the current housing scopes.
 *
 * @returns Current housing scopes in redux store.
 */
export const useCurrentHousingScopes = () => {
    const { currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    return currentHousingScopes
}
