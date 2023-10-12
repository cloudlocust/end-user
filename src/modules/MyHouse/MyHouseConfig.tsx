import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyHouse } from 'src/modules/MyHouse/MyHouse'
import ConnectedPlugs from 'src/modules/MyHouse/components/ConnectedPlugs'
import { ReactComponent as HousingIcon } from 'src/assets/images/navbarItems/Housings.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { HousingInformation } from 'src/modules/MyHouse/components/HousingInformation'
import { Equipments } from 'src/modules/MyHouse/components/Equipments'
import { store } from 'src/redux'
import { ScopesTypesEnum } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'
import { isAccessRightsActive } from 'src/configs'

/**
 * Url for myHouse.
 */
export const URL_MY_HOUSE = '/my-houses'
/**
 * Url for myHouse Details.
 */
export const URL_MY_HOUSE_DETAILS = URL_MY_HOUSE + '/:houseId'
/**
 * Url for housing equipments.
 */
export const URL_HOUSING_EQUIPMENTS = `${URL_MY_HOUSE_DETAILS}/equipments`
/**
 * Url for housing connected plugs.
 */
export const URL_HOUSING_CONNECTED_PLUGS = `${URL_MY_HOUSE_DETAILS}/connected-plugs`

/**
 * Url for housing information.
 */
export const URL_HOUSING_INFORMATION = `${URL_MY_HOUSE_DETAILS}/information`

/**
 * Interface .
 *
 */
export interface MyHouseProps {
    /**
     * Logo to dislay.
     */
    logo?: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Url of the logo.
         */
        url: string
    }
}

/**
 * Env Variable to know if the delete and add housing feature is enabled.
 */
export const deleteAddFeatureState = window._env_.REACT_APP_ADD_DELETE_HOUSING_FEATURE_STATE === 'disabled'

/**
 * Env Variable to know if the equipments and accomodation feature is enabled.
 */
export const equipmentsAccomodationFeatureState =
    window._env_.REACT_APP_EQUIPMENTS_ACCOMODATION_FEATURE_STATE === 'disabled'

/**
 * Env Variable to know if the temp and pmax features are enabled.
 */
export const tempPmaxFeatureState = window._env_.REACT_APP_TEMP_PMAX_FEATURE_STATE === 'disabled'

/**
 * Env Variable to know if SGE consent feature is enabled.
 */
export const sgeConsentFeatureState = window._env_.REACT_APP_SGE_CONSENT_FEATURE_STATE === 'enabled'
/**
 * Env Variable to know which message that shown in sge consent popup.
 */
export const sgeConsentMessage = window._env_.REACT_APP_SGE_CONSENT_POPUP_MESSAGE

/**
 * Env variable to know if global production feature is enabled.
 */
export const globalProductionFeatureState = window._env_.REACT_APP_GLOBAL_PRODUCTION_FEATURE_STATE === 'enabled'

/**
 * Env variable to know if connected plugs feature is enabled.
 */
export const connectedPlugsFeatureState = window._env_.REACT_APP_CONNECTED_PLUGS_FEATURE_STATE === 'enabled'

/**
 * Env variable to know if the feature to manual filling contracts is enabled.
 */
export const manualContractFillingIsEnabled = window._env_.REACT_APP_MANUAL_CONTRACT_FILLING === 'enabled'

/**
 * Env var for custom SGE consent custom popup message.
 */
export const sgeConsentFeatureStatePopup: string = window._env_.REACT_APP_SGE_CONSENT_FEATURE_STATE_POPUP_MESSAGE

/**
 * Check if global production is active, if so check if we are using access rights, if so then we have to use the production offer rights.
 *
 * @param scopes Scopes of housing to check.
 * @returns Boolean.
 */
// TODO: refactor this for more readibility readability and reduced redundancy.
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

/**
 * MyHouseConfig.
 */
export const MyHouseConfig = [
    {
        path: URL_MY_HOUSE,
        component: MyHouse,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_MY_HOUSE,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_MY_HOUSE_DETAILS,
        component: MyHouse,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_MY_HOUSE_DETAILS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_INFORMATION,
        component: HousingInformation,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_INFORMATION,
                        disabled: equipmentsAccomodationFeatureState,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_EQUIPMENTS,
        component: Equipments,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Equipements',
                        labelAbbreviation: 'Equipements',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_EQUIPMENTS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_CONNECTED_PLUGS,
        component: ConnectedPlugs,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_EQUIPMENTS,
                        disabled: arePlugsUsedBasedOnProductionStatus(
                            store.getState().housingModel.currentHousingScopes,
                        ),
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
]
