import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Analysis } from './Analysis'

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
 * AnalysisConfig.
 */
export const AnalysisConfig = [
    {
        path: URL_ANALYSIS,
        component: Analysis,
        auth: { authType: authTypes.freeAccess }, // TODO CHANGE
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
        },
    } as IRouteNavigationConfig<AnalysisProps>,
]
