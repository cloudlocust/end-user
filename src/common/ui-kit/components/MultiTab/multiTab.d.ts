import { TabTypeMap, TabsTypeMap } from '@mui/material'

/**
 * MuiTabProps.
 */
export interface IMultiTab {
    /**
     * Tab title.
     */
    tabTitle: string
    /**
     * Tab slug.
     *
     * @example "/this-is-a-slug"
     */
    tabSlug: string
    /**
     * Tab content.
     */
    tabContent: JSX.Element
    /**
     * Tab icon.
     */
    icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

/**
 * MultiTabProps.
 */
export interface MultiTabProps {
    /**
     * The header above the tabs.
     */
    header?: JSX.Element
    /**
     *  All components supposed to be in the tabs (with there title, slug, content).
     */
    content: IMultiTab[]
    /**
     * Boolean for innerScroll.
     */
    innerScroll?: boolean
    /**
     * Rest of tabs props.
     */
    TabsProps?: TabsTypeMap['props']
    /**
     * Rest of tab props.
     */
    TabProps?: TabTypeMap['props']
    /**
     * Css targeting the root component.
     */
    rootCss?: CSSProperties
    /**
     * Indicates whether to use routing for tab selection.
     */
    isUseRouting?: boolean
    /**
     * Initial slug value of the selected tab.
     */
    initialTabSlug?: string
}
