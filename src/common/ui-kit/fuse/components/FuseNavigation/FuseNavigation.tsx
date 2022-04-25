import _ from 'lodash'
import GlobalStyles from '@mui/material/GlobalStyles'
import FuseNavVerticalLayout2 from 'src/common/ui-kit/fuse/components/FuseNavigation/vertical/FuseNavVerticalLayout2'
import FuseNavVerticalLayout1 from './vertical/FuseNavVerticalLayout1'
import { registerComponent } from './FuseNavItem'
import FuseNavVerticalCollapse from './vertical/types/FuseNavVerticalCollapse'
import FuseNavVerticalItem from './vertical/types/FuseNavVerticalItem'
import FuseNavVerticalGroup from './vertical/types/FuseNavVerticalGroup'

/*
 * Type represent some specific values ['item', 'group', 'collapse', 'divider'], that Fuse uses for handling navbar with different levels and handling UI for navbar.
 * For example in https://react-material.fusetheme.com/apps/dashboards/analytics.
 * When you see the navbar, you'll find Application (as a first section in the navbar ) , this represent a navbarLink he doesn't have a url that's why he is not clickbale and he doesn't redirect.
 * Besides he has type of group so it means he he'll group other links.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type navbarItemTypePropertyT = 'item' | 'group' | 'collapse' | 'divider'
/**
 * Type of the item that will be placed in the navbar (it is an object with properties, such as the potential url, id, label, icon associated with it ...etc).
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type navbarItemType = {
    /**
     * Id string, to separate it from ths others.
     */
    id?: string
    /**
     * Label of the link, that will be shown in the navbar.
     */
    label?: string
    /**
     * If the labl is too long for bottom navigation mobile display, add an abbreviation.
     */
    labelAbbreviation?: string
    /**
     * Type represent some specific values ['item', 'group', 'collapse', 'divider'], that Fuse uses for handling navbar with different levels and handling UI for navbar.
     */
    type?: navbarItemTypePropertyT
    /**
     * Label of the icon that will be shown with the label, using MUI Icon Component to have something like <Icon>{iconLabel}</Icon>.
     */
    iconLabel?: string
    /**
     * Additional ClassName for the Icon.
     */
    iconClassName?: string
    /**
     * Url of the redirection when clicking on the link.
     */
    url?: string
    /**
     * Using exact of react-router.
     */
    exact?: boolean
    /**
     * Represent other navbarLink that are children of the current navbarLink in a UI sense the same as the Application navbarLink example has children [dashboard, Calendar, ...etc].
     */
    children?: navbarItemType[]
}
/**
 * Interface IFuseNavigationProps, represents all the props possible to be passed a navigation Element in the navbar.
 */
export interface IFuseNavigationComponentProps {
    /**
     *
     */
    layout?: string
    /**
     *
     */
    active?: boolean
    /**
     *
     */
    dense?: boolean
    /**
     *
     */
    className?: string
    /**
     *
     */
    onItemClick?: Function
    /**
     *
     */
    firstLevel?: boolean
    /**
     *
     */
    selectedId?: string
    /**
     *
     */
    type?: string
    /**
     *
     */
    nestedLevel?: number
    /**
     *
     */
    item?: navbarItemType
}
/**
 * Interface IFuseNavigationProps, represents all the props possible to be passed to the Navigation Wrapper Component in the navbar.
 */
export interface IFuseNavigationProps {
    /**
     *
     */
    navigation: navbarItemType[]
    /**
     *
     */
    layout?: string
    /**
     *
     */
    active?: boolean
    /**
     *
     */
    dense?: boolean
    /**
     *
     */
    className?: string
    /**
     *
     */
    onItemClick?: Function
    /**
     *
     */
    firstLevel?: boolean
    /**
     *
     */
    selectedId?: string
}

const inputGlobalStyles = (
    <GlobalStyles
        styles={(theme) => ({
            '.popper-navigation-list': {
                '& .fuse-list-item': {
                    padding: '8px 12px 8px 12px',
                    height: 40,
                    minHeight: 40,
                    '& .fuse-list-item-text': {
                        padding: '0 0 0 8px',
                    },
                },
                '&.dense': {
                    '& .fuse-list-item': {
                        minHeight: 32,
                        height: 32,
                        '& .fuse-list-item-text': {
                            padding: '0 0 0 8px',
                        },
                    },
                },
            },
        })}
    />
)
/**
 * Register Fuse Navigation Components.
 */
registerComponent('vertical-collapse', FuseNavVerticalCollapse)
registerComponent('vertical-item', FuseNavVerticalItem)
registerComponent('vertical-group', FuseNavVerticalGroup)

/**
 * Component for rendering the correct vertical navbar layout (if it's tabbed it'll have 2 layouts, first layout responsible for parent and 2 for children).
 *
 * @param props FuseNavigation Layout.
 * @returns Navigation Component in the Navbra.
 */
function FuseNavigation(props: IFuseNavigationProps) {
    const options = _.pick(props, [
        'navigation',
        'layout',
        'active',
        'dense',
        'className',
        'onItemClick',
        'firstLevel',
        'selectedId',
    ])

    if (props.navigation.length > 0) {
        return (
            <>
                {inputGlobalStyles}
                {props.layout === 'vertical' && <FuseNavVerticalLayout1 {...options} />}
                {props.layout === 'vertical-2' && <FuseNavVerticalLayout2 {...options} />}
            </>
        )
    }
    return null
}

FuseNavigation.defaultProps = {
    layout: 'vertical',
}

export default FuseNavigation
