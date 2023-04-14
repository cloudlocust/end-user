import { useTheme, styled } from '@mui/material'

import './pillSwitcher.scss'
import { useParams } from 'react-router-dom'
import { IPillSwitcherComponent, IPillSwitcherParams, IPillSwitcherProps } from './pillSwitcher'

/**
 * Switch Component (look like a Pill).
 *
 * @param root0 Props to use PillSwitcher.
 * @param root0.defaultComponent Default @JSX.Element to use. (active by Default).
 * @param root0.otherComponent The other @JSX.Element (need to be clicked to be Active).
 * @returns JSX.Element.
 */
const PillSwitcherMenuComponent = ({ defaultComponent, otherComponent }: IPillSwitcherProps) => {
    const { selectedItem } = useParams<IPillSwitcherParams>()
    const theme = useTheme()

    const PillCell = styled('div')(({ theme }) => ({
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)',
        },
    }))

    /**
     * TODO: need to refactor this to disable state, support a List of components, handle click, change style.
     */

    const selectedCellStyle = {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        cursor: 'default',
    }
    const defaultStyleCell = { border: `1px solid ${theme.palette.primary.dark}`, cursor: 'pointer' }

    /**
     * Handle a click on a Cell of this Component.
     *
     * @param currentComponent The current component clicked.
     */
    const cellClickHandler = (currentComponent: IPillSwitcherComponent) => {
        if (!currentComponent.disabled && currentComponent.clickHandler !== undefined) {
            currentComponent.clickHandler()
        }
    }

    return (
        <div className="pillSwitcherComponent">
            <PillCell
                className="pillCell"
                style={selectedItem !== otherComponent.paramKey ? selectedCellStyle : defaultStyleCell}
                onClick={() => {
                    cellClickHandler(defaultComponent)
                }}
            >
                {defaultComponent.btnText}
            </PillCell>
            <PillCell
                className="pillCell"
                style={selectedItem === otherComponent.paramKey ? selectedCellStyle : defaultStyleCell}
                onClick={() => {
                    cellClickHandler(otherComponent)
                    // history.push(`${actualRoute}/${otherComponent.paramKey}`)
                }}
            >
                {otherComponent.btnText}
            </PillCell>
        </div>
    )
}

export default PillSwitcherMenuComponent
