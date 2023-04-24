import { SyntheticEvent, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { styled } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { useIntl } from 'src/common/react-platform-translation'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { keyBy, mapValues } from 'lodash'

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

//eslint-disable-next-line jsdoc/require-jsdoc
export interface IMultiTab {
    //eslint-disable-next-line jsdoc/require-jsdoc
    tabTitle: string
    //eslint-disable-next-line jsdoc/require-jsdoc
    tabSlug: string
    //eslint-disable-next-line jsdoc/require-jsdoc
    tabContent: JSX.Element
}

/**
 *  The Element Details let you control tabs.
 *  To Use this component, you have to passe in these props..
 *
 * @param props N/A.
 * @param props.header The Header Component of the Tab.
 * @param props.content Content that will be displayed (format : IMultiTab).
 * @param props.innerScroll Indicates if there is an innerScroll inside the tabs.
 * @returns  Element Details Tabs.
 */
const MultiTab = ({
    /**
     * The header above the tabs.
     */
    header,
    /**
     *  All components supposed to be in the tabs (with there title, slug, content).
     */
    content,
    // eslint-disable-next-line jsdoc/require-jsdoc
    innerScroll,
}: /**
 *
 */
{
    //eslint-disable-next-line jsdoc/require-jsdoc
    header?: JSX.Element
    //eslint-disable-next-line jsdoc/require-jsdoc
    content: Array<IMultiTab>
    //eslint-disable-next-line jsdoc/require-jsdoc
    innerScroll?: boolean
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
    // UseHistory, and tab Handle
    const tabSlugList = content.filter((item) => item.tabSlug === entryTab)
    const isInvalidValue = !tabSlugList.length || !entryTab?.length
    const [tabSlug, setTabSlug] = useState(isInvalidValue ? content[0].tabSlug : entryTab)
    const history = useHistory()
    isInvalidValue && history.replace({ pathname: `${basePath}/${content[0].tabSlug}`, ...restLocationState })
    /**
     * Handler for tab change.
     *
     * @param _event Event of the onChange.
     * @param newTabSlug Slug tab selected.
     */
    const handleTabChange = (_event: SyntheticEvent, newTabSlug: string) => {
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
                >
                    {content.map((element, index) => (
                        <Tab
                            key={index}
                            value={element.tabSlug}
                            label={formatMessage({ id: element.tabTitle, defaultMessage: element.tabTitle })}
                            className="h-64"
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
