import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyHouse } from 'src/modules/MyHouse/MyHouse'
import Equipments from 'src/modules/MyHouse/components/Equipments'
import Accomodation from 'src/modules/MyHouse/components/Accomodation'
import { ReactComponent as HousingIcon } from 'src/assets/images/navbarItems/Housings.svg'
import SvgIcon from '@mui/material/SvgIcon'

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
 * Url for housing accomodation.
 */
export const URL_HOUSING_ACCOMODATION = `${URL_MY_HOUSE_DETAILS}/accomodation`

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
 * Env variable to know if enphase consent feature is enabled.
 */
export const enphaseConsentFeatureState = window._env_.REACT_APP_ENPHASE_CONSENT_FEATURE_STATE === 'enabled'

/**
 * Env variable to know if the feature to manual filling contracts is enabled.
 */
export const manualContractFillingIsEnabled = window._env_.REACT_APP_MANUAL_CONTRACT_FILLING === 'enabled'

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
        path: URL_HOUSING_EQUIPMENTS,
        component: Equipments,
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
                        disabled: equipmentsAccomodationFeatureState,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_ACCOMODATION,
        component: Accomodation,
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
                        url: URL_HOUSING_ACCOMODATION,
                        disabled: equipmentsAccomodationFeatureState,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
]
