import { styled } from '@mui/material'

import './pillSwitcher.scss'
import { IPillSwitcherComponent, IPillSwitcherProps } from './pillSwitcher'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useState } from 'react'

/**
 * Interface for @StyledComponent to make code more lisible.
 */
interface IStyledPillCellProps {
    /**
     * The current Component is selected ?
     */
    selected: boolean
}
/**
 * Switch Component (look like a Pill).
 *
 * @param root0 Props to use PillSwitcher.
 * @param root0.activeComponentIndex Actual index of default Selected Component (use 0 as default).
 * @param root0.components List of IPillSwitcherComponent.
 * @returns JSX.Element.
 */
const PillSwitcherMenuComponent = ({ activeComponentIndex, components }: IPillSwitcherProps) => {
    const [selectedComponent, selectComponent] = useState<IPillSwitcherComponent>(
        components[activeComponentIndex ? activeComponentIndex : 0],
    )

    /**
     * This will only setup Dynamic StyleSheet, like Selected / Not Selected attributs,
     * the most of Style Sheet are inside the pillSwitcher.scss.
     */
    const PillCell = styled('div')<IStyledPillCellProps>(({ theme, selected }) => ({
        backgroundColor: selected ? theme.palette.primary.dark : '',
        color: selected ? theme.palette.primary.contrastText : '',
        cursor: selected ? 'default' : 'pointer',
        border: selected ? '' : `1px solid ${theme.palette.primary.dark}`,
        '&:hover': {
            backgroundColor: selected
                ? ''
                : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0,0,0,.04)',
        },
    }))

    /**
     * Handle a click on a Cell of this Component.
     *
     * @param currentComponent The current component clicked.
     */
    const cellClickHandler = (currentComponent: IPillSwitcherComponent) => {
        if (currentComponent.clickHandler !== undefined) {
            selectComponent(currentComponent)
            currentComponent.clickHandler()
        }
    }

    return (
        <div className="pillSwitcherComponent">
            {components.map((component: IPillSwitcherComponent) => (
                <PillCell
                    className="pillCell"
                    selected={selectedComponent.btnText === component.btnText}
                    onClick={() => {
                        cellClickHandler(component)
                    }}
                >
                    <TypographyFormatMessage>{component.btnText}</TypographyFormatMessage>
                </PillCell>
            ))}
        </div>
    )
}

export default PillSwitcherMenuComponent
