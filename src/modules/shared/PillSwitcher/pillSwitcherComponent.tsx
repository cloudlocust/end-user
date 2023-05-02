import { styled } from '@mui/material'

import './pillSwitcher.scss'
import { IPillSwitcherComponent, IPillSwitcherProps } from './pillSwitcher'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { primaryMainColor } from 'src/modules/utils/muiThemeVariables'

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
export const PillSwitcherMenuComponent = ({ activeComponentIndex, components }: IPillSwitcherProps) => {
    const [selectedComponent, selectComponent] = useState<IPillSwitcherComponent | undefined>(undefined)

    /**
     * Better than ternary for Lisibility.
     *
     * @param _component Component to check.
     * @returns Boolean.
     */
    const componentIsSelected = (_component: IPillSwitcherComponent) => {
        return _component.btnText === selectedComponent?.btnText
    }
    /**
     * This will only setup Dynamic StyleSheet, like Selected / Not Selected attributs,
     * the most of Style Sheet are inside the pillSwitcher.scss.
     */
    const PillCell = styled('button')<IStyledPillCellProps>(({ theme, selected }) => ({
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

    useEffect(() => {
        if (!selectedComponent && components) {
            let idx: number = activeComponentIndex ? activeComponentIndex : 0
            let component: IPillSwitcherComponent = components[idx] as IPillSwitcherComponent
            if (component) {
                cellClickHandler(component)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeComponentIndex, components, selectedComponent])

    /**
     * Handle a click on a Cell of this Component.
     *
     * @param currentComponent The current component clicked.
     */
    const cellClickHandler = (currentComponent: IPillSwitcherComponent) => {
        if (!componentIsSelected(currentComponent) && currentComponent.clickHandler !== undefined) {
            selectComponent(currentComponent)
            currentComponent.clickHandler()
        }
    }

    if (!components || (components && !selectedComponent))
        return <TypographyFormatMessage>Une erreur est survenue</TypographyFormatMessage>

    return (
        <div className="pillSwitcherComponent">
            {components.length > 0 ? (
                components.map((component: IPillSwitcherComponent, index: number) => (
                    <PillCell
                        key={index}
                        className="pillCell"
                        aria-label={`${componentIsSelected(component) ? 'active-cell' : 'clickable-cell'}`}
                        selected={componentIsSelected(component)}
                        onClick={() => {
                            cellClickHandler(component)
                        }}
                    >
                        <TypographyFormatMessage>{component.btnText}</TypographyFormatMessage>
                    </PillCell>
                ))
            ) : (
                <CircularProgress sx={{ color: primaryMainColor }} />
            )}
        </div>
    )
}
