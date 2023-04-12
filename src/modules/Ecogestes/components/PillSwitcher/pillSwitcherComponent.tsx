import { useTheme, styled } from '@mui/material'

import './pillSwitcher.scss'
import { useHistory, useParams } from 'react-router-dom'

/**
 * Template used to fetch Params
 * we will use selectedItem everytime for this component.
 */
// eslint-disable-next-line
export type IPillSwitcherParams = {
    /**
     * The @Object that contain the ParamKey for the Switcher.
     */
    selectedItem: string
}

/**
 * Interface for a Component inside the PillSwitch Component.
 */
// eslint-disable-next-line
export type IPillSwitcherComponent = {
    /**
     * Text displayed on Button.
     */
    btnText: string

    /**
     * URL Param Key to use for RouteMatcher.
     * !! Beware : we can set undefined only the default not the @otherComponent !
     */
    paramKey?: string | undefined
}

/**
 * Props to pass to @PillSwitcherComponent.
 */
// eslint-disable-next-line
export type IPillSwitcherProps = {
    /**
     * The Relative URL of the route used atm.
     * Example: for advices we use /advices as actualRoute
     * cause by default browsing /advices will show the @defaultComponent
     * but /advices/${otherComponent.paramKey} will show the @otherComponent.
     */
    actualRoute: string
    /**
     * The default component Displayed
     * See @IPillSwitcherComponent.
     */
    defaultComponent: IPillSwitcherComponent
    /**
     * The other component not displayed by default on the Switch
     * See @IPillSwitcherComponent.
     */
    otherComponent: IPillSwitcherComponent
}
/**
 * Switch Component (look like a Pill).
 *
 * @param root0 Props to use @PillSwitcher.
 * @param root0.defaultComponent Default @JSX.Element to use. (active by Default).
 * @param root0.otherComponent The other @JSX.Element (need to be clicked to be Active).
 * @param root0.actualRoute Relative path to the actual Routes (ex: /advices).
 * @returns JSX.Element.
 */
export const PillSwitcherMenuComponent = ({ actualRoute, defaultComponent, otherComponent }: IPillSwitcherProps) => {
    const { selectedItem } = useParams<IPillSwitcherParams>()
    const theme = useTheme()
    const history = useHistory()

    const PillCell = styled('div')(({ theme }) => ({
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)',
        },
    }))

    const selectedCellStyle = {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        cursor: 'default',
    }
    const defaultStyleCell = { border: `1px solid ${theme.palette.primary.dark}`, cursor: 'pointer' }

    return (
        <div className="pillSwitcherComponent">
            <PillCell
                className="pillCell"
                style={selectedItem !== otherComponent.paramKey ? selectedCellStyle : defaultStyleCell}
                onClick={() => {
                    history.push(actualRoute)
                }}
            >
                {defaultComponent.btnText}
            </PillCell>
            <PillCell
                className="pillCell"
                style={selectedItem === otherComponent.paramKey ? selectedCellStyle : defaultStyleCell}
                onClick={() => {
                    history.push(`${actualRoute}/${otherComponent.paramKey}`)
                }}
            >
                {otherComponent.btnText}
            </PillCell>
        </div>
    )
}
