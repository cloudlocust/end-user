import { CSSProperties, SyntheticEvent, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { styled, Theme } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { useIntl } from 'src/common/react-platform-translation'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { keyBy, mapValues } from 'lodash'
import { MultiTabProps } from 'src/common/ui-kit/components/MultiTab/multiTab.d'

const Root = styled(FusePageCarded)(
    ({
        theme,
        rootCss,
    }: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        theme?: Theme
        // eslint-disable-next-line jsdoc/require-jsdoc
        rootCss: CSSProperties
    }) => ({
        '& .FusePageCarded-header': {
            minHeight: rootCss['minHeight'] || 136,
            height: rootCss['height'] || 136,
            alignItems: 'center',
            [theme!.breakpoints.up('sm')]: {
                minHeight: 136,
                height: 136,
            },
            margin: rootCss['margin'],
        },
        '& .FusePageCarded-content': {
            display: 'flex',
        },
        '& .FusePageCarded-contentCard': {
            overflow: 'hidden',
        },
    }),
)

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
 * @param props.rootCss Root component css.
 * @param props.isUseRouting Indicates whether to use routing for tab selection.
 * @returns  Element Details Tabs.
 */
const MultiTab = ({
    header,
    content,
    innerScroll,
    TabsProps,
    TabProps,
    rootCss,
    isUseRouting = true,
}: MultiTabProps) => {
    const { formatMessage } = useIntl()

    // Add KeyContent to access slugs more easly
    let keyedContent = mapValues(keyBy(content, 'tabSlug'), 'tabContent')

    // Get Location from URL.
    const { pathname, ...restLocationState } = useLocation()
    const location = pathname.split('/')

    let basePath = location.join('/')
    let entryTab = location.pop()

    const tabSlugList = content.filter((item) => item.tabSlug === entryTab)
    const isInvalidValue = !tabSlugList.length || !entryTab?.length

    // UseHistory, and tab Handle
    const history = useHistory()
    const [tabSlug, setTabSlug] = useState(isInvalidValue ? content[0].tabSlug : entryTab)

    /**
     * Handler for tab change.
     *
     * @param _event Event of the onChange.
     * @param newTabSlug Slug tab selected.
     */
    const handleTabChange = (_event: SyntheticEvent, newTabSlug: string) => {
        setTabSlug(newTabSlug)

        if (isUseRouting) {
            history.replace({ pathname: `${basePath}/${newTabSlug}`, ...restLocationState })
        }
    }

    return (
        <Root
            rootCss={rootCss!}
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
