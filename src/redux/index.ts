import { RootModel } from 'src/models/index'
import createPersistPlugin from '@rematch/persist'

import storage from 'redux-persist/lib/storage'
import { createFilter } from 'redux-persist-transform-filter'
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models } from 'src/models'

/**
 * Overwritten type for TS.
 */
export type Store = typeof store
/**
 * Overwritten type for TS.
 */
export type Dispatch = RematchDispatch<RootModel>
/**
 * Overwritten type for TS.
 */
export type RootState = RematchRootState<RootModel>

// you want to store only a subset of your state of reducer one
const persistUserAttributes = createFilter('userModel', ['user', 'authenticationToken'])
const persistHousingAttributes = createFilter('housingModel', ['housingList', 'currentHousing'])

/**
 * Used to define parts of redux states persisted.
 */
export const persistPlugin = createPersistPlugin<any, RootModel, Record<string, any>>({
    storage,
    key: 'model',
    debug: true,
    whitelist: ['userModel', 'housingModel'],
    transforms: [persistUserAttributes, persistHousingAttributes],
})

/**
 * Redux store. We deactivate detools if not needed and we add rematch models.
 */
export const store = init({
    models,
    plugins: [persistPlugin],
    redux: {
        devtoolOptions: {
            // disable redux devtools extension in the prod and preprod envirenement
            disabled: process.env.NODE_ENV !== 'development',
        },
    },
})
