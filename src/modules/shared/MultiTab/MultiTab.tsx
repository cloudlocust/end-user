import { SyntheticEvent, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { styled } from '@mui/material/styles'
import { useIntl } from 'src/common/react-platform-translation'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { keyBy, mapValues } from 'lodash'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { IMultiTab } from 'src/common/ui-kit/components/MultiTab/MultiTab'

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {
        minHeight: 136,
        height: 136,
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            minHeight: 32,
            height: 32,
        },
    },
    '& .FusePageCarded-content': {
        display: 'flex',
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
        borderRadius: '20px',
        flex: 'none',
    },
    '& .FusePageCarded-topBg': {
        [theme.breakpoints.down('md')]: {
            background: 'transparent',
        },
    },
    '& .FusePageCarded-toolbar': {
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'center',
            borderBottom: 'none',
        },
        '& .multitabs': {
            height: '64px',
            [theme.breakpoints.down('md')]: {
                height: '44px',
                background: theme.palette.primary.contrastText,
                outline: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '40px',
                '& .Mui-selected': {
                    color: `${theme.palette.background.paper} !important`,
                    zIndex: 1,
                },
            },
            '& .tabs': {
                height: '64px',
                [theme.breakpoints.down('md')]: {
                    height: '44px',
                },
            },
        },
        '& .indicator': {
            [theme.breakpoints.down('md')]: {
                height: '48px',
                borderRadius: '30px',
            },
        },
    },
}))

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
                    classes={{ root: 'multitabs', indicator: 'indicator' }}
                >
                    {content.map((element, index) => (
                        <Tab
                            key={index}
                            value={element.tabSlug}
                            label={formatMessage({ id: element.tabTitle, defaultMessage: element.tabTitle })}
                            classes={{ root: 'tabs' }}
                        />
                    ))}
                </Tabs>
            }
            content={<div className="p-16 sm:p-24 w-full">{keyedContent[tabSlug as string]}</div>}
            innerScroll={innerScroll}
            isToolbarOutside
        />
    )
}

export default MultiTab
