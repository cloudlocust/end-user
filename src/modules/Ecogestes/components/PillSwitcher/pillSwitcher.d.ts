/**
 * Template used to fetch Params
 * we will use selectedItem everytime for this component.
 */
// eslint-disable-next-line
export type IPillSwitcherParams = {
    /**
     * The @Object that contain the ParamKey for the Switcher.
     */
    selectedItem?: string | undefined
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

    /**
     * The component is enabled or not?
     */
    disabled?: Boolean

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
