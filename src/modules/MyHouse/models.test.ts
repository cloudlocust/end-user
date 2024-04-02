import { init } from '@rematch/core'
import { models } from 'src/models'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IHousing, IHousingState } from 'src/modules/MyHouse/components/HousingList/housing'
import { applyCamelCase } from 'src/common/react-platform-components'
import { housingModel } from './model'
import { ScopesTypesEnum } from './utils/MyHouseCommonTypes.d'

let mockInitialState: IHousingState = {
    housingList: [],
    currentHousing: null,
    currentHousingScopes: [],
    alpiqSubscriptionSpecs: null,
}

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
// mock store.
const store = init({
    models,
})

describe('test housing model', () => {
    afterEach(() => {
        mockInitialState.currentHousing = null
        mockInitialState.housingList = []
    })

    test('when initial state is empty, set Housing model State fill the state correctly', () => {
        // we have the initial state when empty and we set it to a new one (give it the new list of housings)
        const result = housingModel.reducers.setHousingModelState(mockInitialState, LIST_OF_HOUSES)

        // result after setting
        expect(result.housingList).toBe(LIST_OF_HOUSES)
        // because the current housing was initially null, it should be the first one by default
        expect(result.currentHousing).toBe(LIST_OF_HOUSES[0])
    })
    test('set current housing state should update currentHousing', () => {
        // the initial state before calling the function
        mockInitialState.housingList = LIST_OF_HOUSES
        mockInitialState.currentHousing = LIST_OF_HOUSES[0]

        const result = housingModel.reducers.setCurrentHousingState(mockInitialState, LIST_OF_HOUSES[1].id)

        expect(result.currentHousing).toBe(LIST_OF_HOUSES[1])
    })

    test('load housing list, first time load', async () => {
        // load the new houses
        await store.dispatch.housingModel.loadHousingsList()

        const { housingModel: mockedHousingModel } = store.getState()

        // check if the state changed with correct values
        expect(mockedHousingModel.housingList.length).toBe(LIST_OF_HOUSES.length)
        expect(mockedHousingModel.currentHousing?.id).toBe(LIST_OF_HOUSES[0].id)
    })

    test('set housing scopes for the current id', async () => {
        // get scopes for the housing id
        await store.dispatch.housingModel.loadHousingScopesFromId(LIST_OF_HOUSES[0].id)

        const { housingModel: mockedHousingModel } = store.getState()

        // check that the correct values of the housing id is set in the state.

        expect(mockedHousingModel?.currentHousingScopes.length).toBe(1)
        expect(mockedHousingModel?.currentHousingScopes[0]).toBe(ScopesTypesEnum.PRODUCTION)
    })
})
