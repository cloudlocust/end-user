import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyHouse } from 'src/modules/MyHouse/MyHouse'
import ConnectedPlugs from 'src/modules/MyHouse/components/ConnectedPlugs'
import { ReactComponent as HousingIcon } from 'src/assets/images/navbarItems/housing.svg'
import { ReactComponent as HousingSelectedIcon } from 'src/assets/images/navbarItems/housing-selected.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { HousingInformation } from 'src/modules/MyHouse/components/HousingInformation'
import { EquipmentsTab } from 'src/modules/MyHouse/components/Equipments'
import { store } from 'src/redux'
import { ScopesTypesEnum } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'
import { isAccessRightsActive } from 'src/configs'
import EquipmentMeasurements from 'src/modules/MyHouse/components/EquipmentMeasurements'
import EquipmentsDetails from 'src/modules/MyHouse/components/EquipmentsDetails'
import EquipmentsUsage from 'src/modules/MyHouse/components/EquipmentsUsage'

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
 * Url for equipment details.
 */
export const URL_HOUSING_EQUIPMENT_DETAILS = `${URL_HOUSING_EQUIPMENTS}/:housingEquipmentId/details/:equipmentId`

/**
 * Url for equipment usage.
 */
export const URL_HOUSING_EQUIPMENT_USAGE = `${URL_HOUSING_EQUIPMENTS}/:housingEquipmentId/usage/:equipmentId`

/**
 * Url for equipment measurements.
 */
export const URL_HOUSING_EQUIPMENT_MEASUREMENTS = `${URL_HOUSING_EQUIPMENTS}/measurements`
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
export const isEquipmentsAccomodationFeatureDisabled =
    window._env_.REACT_APP_EQUIPMENTS_ACCOMODATION_FEATURE_STATE === 'disabled'

/**
 * Env Variable to know if the temp and pmax features are enabled.
 */
export const isTempPmaxFeatureDisabled = window._env_.REACT_APP_TEMP_PMAX_FEATURE_STATE === 'disabled'

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
 * Env var for equipment measurement feature.
 */
export const isEquipmentMeasurementFeatureState: boolean =
    window._env_.REACT_APP_EQUIPMENT_MEASUREMENT_FEATURE_STATE === 'enabled'

/**
 * Check if global production is active, if so check if we are using access rights, if so then we have to use the production offer rights.
 *
 * @param scopes Scopes of housing to check.
 * @returns Boolean.
 */
export const isProductionActiveAndHousingHasAccess = (scopes: ScopesTypesEnum[]) => {
    // If global production is not active, return false
    if (!globalProductionFeatureState) return false

    // If access rights are not active, return true since global production is active
    if (!isAccessRightsActive) return true

    // Check if scopes include PRODUCTION, if so return true, else return false
    return scopes?.some((scope) => scope === ScopesTypesEnum.PRODUCTION) ?? false
}

/**
 * Are plugs used based on production scope.
 *
 * @param scopes Scopes from housing.
 * @returns Boolean.
 */
export const arePlugsUsedBasedOnProductionStatus = (scopes: ScopesTypesEnum[]) => {
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
                        id: 'Logement',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
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
                        id: 'Logement',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
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
                        id: 'Logement',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_INFORMATION,
                        disabled: isEquipmentsAccomodationFeatureDisabled,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_EQUIPMENTS,
        component: EquipmentsTab,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Logement',
                        label: 'Equipements',
                        labelAbbreviation: 'Equipements',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_EQUIPMENTS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_EQUIPMENT_DETAILS,
        component: EquipmentsDetails,
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
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_EQUIPMENT_DETAILS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_EQUIPMENT_MEASUREMENTS,
        component: EquipmentMeasurements,
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
                        url: URL_HOUSING_EQUIPMENT_MEASUREMENTS,
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
                        id: 'Logement',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
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
    {
        path: URL_HOUSING_EQUIPMENT_USAGE,
        component: EquipmentsUsage,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Logement',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <HousingSelectedIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_EQUIPMENT_USAGE,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
]
