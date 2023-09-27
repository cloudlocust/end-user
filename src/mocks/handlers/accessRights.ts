import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import { ScopesAccessRightsType, ScopesTypesEnum } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'

// eslint-disable-next-line jsdoc/require-jsdoc
export const accessRightsEndpoints = [
    // Get AlAccess rights for housing
    rest.get<ScopesAccessRightsType>(`${API_RESOURCES_URL}/access-rights/:housingId`, (_req, res, ctx) => {
        const { housingId } = _req.params
        let housingScopes: ScopesTypesEnum[] = []

        if (parseInt(housingId) !== 2) {
            housingScopes = [ScopesTypesEnum.PRODUCTION]
        }

        return res(ctx.status(200), ctx.delay(1000), ctx.json({ scopes: housingScopes }))
    }),
]
