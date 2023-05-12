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
     * Callback to execute when someone click on it.
     */
    clickHandler?: () => void
}

/**
 * Props to pass to @PillSwitcherComponent.
 */
// eslint-disable-next-line
export type IPillSwitcherProps = {
    /**
     * Default Component index,
     * use 0 for the first element to be Toggle.
     */
    activeComponentIndex?: number | undefined
    /**
     * Components to display.
     */
    components: IPillSwitcherComponent[]
}

/**
 * Interface for @StyledComponent to make code more lisible.
 */
export interface IStyledPillCellProps {
    /**
     * The current Component is selected ?
     */
    selected: boolean
}
