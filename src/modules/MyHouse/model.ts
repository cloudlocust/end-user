import { IHousing, IHousingState } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { axios, handleErrors } from 'src/common/react-platform-components'
import { createModel } from '@rematch/core'
import { RootModel } from 'src/models'
import { ILoadDataPagination } from 'src/common/react-platform-components/utils/mm'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * Default state of housing state.
 */
export const defaultState = {
    housingList: [],
    currentHousing: null,
} as IHousingState

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
         * @returns List of available housings.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async loadHousingsList() {
            try {
                const { data } = await axios.get<ILoadDataPagination<IHousing[]>>(`${HOUSING_API}?size=100&page=1`)
                dispatch.housingModel.setHousingModelState(data.items)
            } catch (error) {
                // use onError callback to handle the error request in the component
                throw handleErrors(error)
            }
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
            return {
                currentHousing: housingList[0],
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
            return {
                ...state,
                currentHousing: state.housingList.find((housing) => housing.id === selectedHousingId) ?? null,
            }
        },
    },
    state: defaultState as IHousingState,
})

/**
 * TODO Document.Handle errors in response.
 *
 * @param error TODO Document.
 * @returns TODO Document.
 */
export const handleLoginErrors = (error: any) => {
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
