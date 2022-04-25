// import { userModel } from 'src/modules/User'
import { translationModel } from 'src/common/react-platform-translation'
import { Models } from '@rematch/core'

/**
 * Rematch models.
 */
export interface RootModel extends Models<RootModel> {
    /**
     * Model of users.
     */
    // userModel: typeof userModel
    /**
     * Model of translation.
     */
    translationModel: typeof translationModel
}

/**
 * Models constant to inject into redux.
 */
export const models: RootModel = {
    // userModel,
    translationModel,
}
