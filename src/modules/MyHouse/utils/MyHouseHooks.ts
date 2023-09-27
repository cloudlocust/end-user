import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'

/**
 * Use Housing redux functions.
 *
 * @returns Hooks.
 */
export const useHousingRedux = () => {
    const dispatch = useDispatch<Dispatch>()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const loadHousingsAndScopes = useCallback(async () => {
        await dispatch.housingModel.loadHousingsList()
        await dispatch.housingModel.loadHousingScopesFromId(currentHousing?.id)
    }, [dispatch.housingModel, currentHousing?.id])

    /**
     * Set housing model to default value.
     */
    const setDefaultHousingModel = () => {
        dispatch.housingModel.setHousingModelState([])
        dispatch.housingModel.setCurrentHousingScopesState([])
    }

    return {
        loadHousingsAndScopes,
        setDefaultHousingModel,
    }
}
