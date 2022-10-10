import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import Analysis from 'src/modules/Analysis'

/**
 * Url for analysis.
 */
export const URL_ANALYSIS = '/analysis'
/**
 * Interface .
 *
 */
export interface AnalysisProps {
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
 * Env Variable to know if the feature is enabled.
 */
export const analysisFeatureState = window._env_.REACT_APP_ANALYSIS_STATE

/**
 * AnalysisConfig.
 */
export const AnalysisConfig = [
    {
        path: URL_ANALYSIS,
        component: Analysis,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Analyse',
                        label: 'Analyse',
                        labelAbbreviation: 'Analyse',
                        type: 'item',
                        iconLabel: 'search',
                        url: URL_ANALYSIS,
                    },
                },
            },
            disabled: analysisFeatureState === 'disabled' ?? false,
        },
    } as IRouteNavigationConfig<AnalysisProps>,
]
