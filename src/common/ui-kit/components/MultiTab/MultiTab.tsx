import React, { SyntheticEvent, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { styled } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { useIntl } from 'src/common/react-platform-translation'
import Tabs from '@mui/material/Tabs'
import Tab, { TabTypeMap } from '@mui/material/Tab'
import { keyBy, mapValues } from 'lodash'
import { TabsTypeMap } from '@mui/material/Tabs'

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .FusePageCarded-content': {
        display: 'flex',
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

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
 *  The Element Details let you control tabs.
 *  To Use this component, you have to passe in these props..
 *
 * @param props N/A.
 * @param props.header The Header Component of the Tab.
 * @param props.content Content that will be displayed (format : IMultiTab).
 * @param props.innerScroll Indicates if there is an innerScroll inside the tabs.
 * @param props.TabsProps Rest of Tabs props.
 * @param props.TabProps Rest of Tab props.
 * @returns  Element Details Tabs.
 */
const MultiTab = ({
    header,
    content,
    innerScroll,
    TabsProps,
    TabProps,
}: /**
 *
 */
{
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
}) => {
    const { formatMessage } = useIntl()

    // Add KeyContent to access slugs more easly
    let keyedContent = mapValues(keyBy(content, 'tabSlug'), 'tabContent')

    // Get Location from URL.
    const { pathname, ...restLocationState } = useLocation()
    const location = pathname.split('/')

    // Initialise Base path and entry Tab.
    let entryTab = location.pop()
    let basePath = location.join('/')

    /**
     * @description With this modification, if the location array is empty after the split() method,
     * the entryTab variable will be set to the tabSlug of the first tab in the content array,
     * and the basePath variable will be set to the original pathname.
     * This will allow the component to handle the /route/child-route URL as well
     * instead of handling only /route/first-child/second-child.
     */
    if (!entryTab) {
        entryTab = content[0].tabSlug
        basePath = pathname
    }

    // UseHistory, and tab Handle
    const tabSlugList = content.filter((item) => item.tabSlug === entryTab)
    const isInvalidValue = !tabSlugList.length || !entryTab?.length
    const [tabSlug, setTabSlug] = useState(isInvalidValue ? content[0].tabSlug : entryTab)
    const history = useHistory()
    isInvalidValue && history.replace({ pathname: `${basePath}/${content[0].tabSlug}`, ...restLocationState })
    /**
     * Handler for tab change.
     *
     * @param event Event of the onChange.
     * @param newTabSlug Slug tab selected.
     */
    const handleTabChange = (event: SyntheticEvent, newTabSlug: string) => {
        setTabSlug(newTabSlug)
        history.replace({ pathname: `${basePath}/${newTabSlug}`, ...restLocationState })
    }

    return (
        <Root
            header={header}
            contentToolbar={
                <Tabs
                    value={tabSlug}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    classes={{ root: 'w-full h-64' }}
                    {...TabsProps}
                >
                    {content.map((element, index) => (
                        <Tab
                            key={index}
                            value={element.tabSlug}
                            label={formatMessage({ id: element.tabTitle, defaultMessage: element.tabTitle })}
                            className="h-64"
                            icon={element.icon}
                            {...TabProps}
                        />
                    ))}
                </Tabs>
            }
            content={<div className="p-16 sm:p-24 w-full">{keyedContent[tabSlug!]}</div>}
            innerScroll={innerScroll}
        />
    )
}

export default MultiTab
