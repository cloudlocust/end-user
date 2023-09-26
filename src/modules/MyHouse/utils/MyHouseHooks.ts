import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isAccessRightsActive } from 'src/configs'
import { Dispatch, RootState } from 'src/redux'
import { connectedPlugsFeatureState, globalProductionFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { ScopesTypesEnum } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'

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

/**
 * Check if global production is active, if so check if we are using access rights, if so then we have to use the production offer rights.
 *
 * @param scopes Scopes of housing to check.
 * @returns Boolean.
 */
export const isProductionActiveAndHousingHasAccess = (scopes: ScopesTypesEnum[] | undefined) => {
    if (globalProductionFeatureState) {
        if (isAccessRightsActive) {
            if (scopes?.find((scope) => scope === ScopesTypesEnum.PRODUCTION)) return true
            return false
        }
        return true
    }
    return false
}

/**
 * Are plugs used based on production scope.
 *
 * @param scopes Scopes from housing.
 * @returns Boolean.
 */
export const arePlugsUsedBasedOnProductionStatus = (scopes: ScopesTypesEnum[] | undefined) => {
    // check if we are using the production offer ( if rights are activated then we are using it)
    if (isAccessRightsActive) {
        if (isProductionActiveAndHousingHasAccess(scopes) && connectedPlugsFeatureState) return true
        return false
    }
    return connectedPlugsFeatureState
}
