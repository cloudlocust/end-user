import { IHousing, IHousingState } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { axios } from 'src/common/react-platform-components'
import { createModel } from '@rematch/core'
import { RootModel } from 'src/models'
import { ILoadDataPagination } from 'src/common/react-platform-components/utils/mm'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { ScopesAccessRightsType, ScopesTypesEnum } from './utils/MyHouseCommonTypes'
import { isAccessRightsActive } from 'src/configs'
import { ACCESS_RIGHTS_API } from './utils/MyHouseVariables'
// import { store } from 'src/redux'

/**
 * Default state of housing state.
 */
export const defaultState: IHousingState = {
    housingList: [],
    currentHousing: null,
    currentHousingScopes: [],
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const defaultRequestErrorMessage = 'Impossible de charger vos logements.'

/**
 * Rematch housings Model, it contains states, reducers and effects (treatment with side effects).
 */
export const housingModel = createModel<RootModel>()({
    /**
     * Effects of the housing model.
     *
     * @param dispatch Dispatch to call dispatch of other models.
     * @returns List of effects.
     */
    effects: (dispatch) => ({
        /**
         * LoadHousingsList function.
         *
         */
        async loadHousingsList() {
            try {
                const { data } = await axios.get<ILoadDataPagination<IHousing[]>>(`${HOUSING_API}?size=100&page=1`)
                dispatch.housingModel.setHousingModelState(data.items)
            } catch (error) {
                // use onError callback to handle the error request in the component
                throw handleHousingEffectsErrors(error)
            }
        },
        /**
         * Load current housing scopes.
         *
         * @param housingId Housing id that will have the scopes set on state.
         */
        async loadHousingScopesFromId(housingId: number | undefined) {
            let housingScopes: ScopesTypesEnum[] = []
            try {
                // const { housingModel } = store.getState()
                if (housingId && isAccessRightsActive) {
                    const { data: responseData } = await axios.get<ScopesAccessRightsType>(ACCESS_RIGHTS_API(housingId))
                    housingScopes = responseData.scopes
                }
                dispatch.housingModel.setCurrentHousingScopesState(housingScopes)
            } catch (err) {}
        },
    }),
    reducers: {
        /**
         * Set the housing model state.
         *
         * @param state Current state.
         * @param housingList Housing list data.
         * @returns New state with user data.
         */
        setHousingModelState(state: IHousingState, housingList: IHousing[]): IHousingState {
            // TODO - take off the function getCurrentHousingOnLoad and put it in the effect
            return {
                ...state,
                currentHousing: getCurrentHousingOnLoad(state, housingList),
                housingList,
            }
        },
        /**
         * Set the housing model state.
         *
         * @param state Current state.
         * @param selectedHousingId The Id of the current Housing selected.
         * @returns New state with user data.
         */
        setCurrentHousingState(state: IHousingState, selectedHousingId: number): IHousingState {
            const currentHousing = state.housingList.find((housing) => housing.id === selectedHousingId) ?? null
            return {
                ...state,
                currentHousing,
            }
        },
        /**
         * Set the housing model state.
         *
         * @param state Current state.
         * @param currentHousingScopes The scopes of the current housing.
         * @returns New state with user data.
         */
        setCurrentHousingScopesState(state: IHousingState, currentHousingScopes: ScopesTypesEnum[]): IHousingState {
            return {
                ...state,
                currentHousingScopes: currentHousingScopes,
            }
        },
    },
    state: defaultState,
})

/**
 * This function handles the cases for updating the current housing when calling load housings.
 *
 * @param state Current Housing State.
 * @param housingList Housing List that we get from fetching data when onLoad.
 * @returns Current Hsouing value based on the behaviour of the app and prece.
 */
const getCurrentHousingOnLoad = (state: IHousingState, housingList: IHousing[]) => {
    if (!state.currentHousing) {
        // if the current housing is null this mean that we just loged in and no state has been saved yet.
        if (housingList![0]) {
            // if the fetched housing list is not empty then give it the first value.
            return housingList![0]
        } else {
            // if the fetched housing list is empty then the user has no housings so give it null
            return null
        }
    } else if (
        typeof housingList.find((housing: IHousing) => housing.id === state.currentHousing?.id) !== 'undefined'
    ) {
        // if the current housing has a value and it exist in the new fetched house list then return it
        return housingList.find((housing: IHousing) => housing.id === state.currentHousing?.id) as IHousing
    } else if (housingList![0]) {
        // if it does not exist in the new fetched array then it has been deleted, if the housingList is not empty then return the first value by default
        return housingList[0]
    } else {
        // if the new fetched housingList is empty then the user has no housings so give it null
        return null
    }
}

/**
 * TODO Document.Handle errors in response.
 *
 * @param error TODO Document.
 * @returns TODO Document.
 */
export const handleHousingEffectsErrors = (error: any) => {
    if (error.response && error.response.status) {
        switch (error.response.status) {
            case 400:
                return "Erreur chargement des logements - utilisateur n'existe pas."
            case 401:
                // Handle unauthorized error
                return "Vous n'avez pas le droit d'effectuer cette opération."

            default:
                return defaultRequestErrorMessage
        }
    } else {
        // If error has no response return the message of error
        return error.message
    }
}
