import FuseScrollbars from 'src/common/ui-kit/fuse/components/FuseScrollbars'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { forwardRef, useImperativeHandle, memo, useRef } from 'react'
import GlobalStyles from '@mui/material/GlobalStyles'
import PageSimpleHeader from './PageSimpleHeader'

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: '100%',
    position: 'relative',
    flex: '1 1 auto',
    width: '100%',
    height: 'auto',
    backgroundColor: theme.palette.background.default,
    marginBottom: '8rem',

    '& .PageSimple-innerScroll': {
        height: '100%',
    },

    '& .PageSimple-wrapper': {
        display: 'flex',
        flexDirection: 'row',
        flex: '1 1 auto',
        zIndex: 2,
        maxWidth: '100%',
        minWidth: 0,
        height: '100%',
        backgroundColor: theme.palette.background.default,
    },

    '& .PageSimple-header': {
        height: headerHeight,
        minHeight: headerHeight,
        display: 'flex',
        background: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.primary.contrastText,
        backgroundSize: 'cover',
        backgroundColor: theme.palette.primary.dark,
    },

    '& .PageSimple-topBg': {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: headerHeight,
        pointerEvents: 'none',
    },

    '& .PageSimple-contentWrapper': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        '-webkit-overflow-scrolling': 'touch',
        zIndex: 9999,
    },

    '& .PageSimple-toolbar': {
        height: toolbarHeight,
        minHeight: toolbarHeight,
        display: 'flex',
        alignItems: 'center',
    },

    '& .PageSimple-content': {
        flex: '1 0 auto',
    },

    '& .PageSimple-sidebarWrapper': {
        overflow: 'hidden',
        backgroundColor: 'transparent',
        position: 'absolute',
        '&.permanent': {
            [theme.breakpoints.up('lg')]: {
                position: 'relative',
            },
        },
    },

    '& .PageSimple-sidebar': {
        position: 'absolute',
        '&.permanent': {
            [theme.breakpoints.up('lg')]: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                position: 'relative',
            },
        },
        width: drawerWidth,
        height: '100%',
    },

    '& .PageSimple-leftSidebar': {
        [theme.breakpoints.up('lg')]: {
            borderRight: `1px solid ${theme.palette.divider}`,
            borderLeft: 0,
        },
    },

    '& .PageSimple-rightSidebar': {
        [theme.breakpoints.up('lg')]: {
            borderLeft: `1px solid ${theme.palette.divider}`,
            borderRight: 0,
        },
    },

    '& .PageSimple-sidebarHeader': {
        height: headerHeight,
        minHeight: headerHeight,
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },

    '& .PageSimple-sidebarHeaderInnerSidebar': {
        backgroundColor: 'transparent',
        color: 'inherit',
        height: 'auto',
        minHeight: 'auto',
    },

    '& .PageSimple-sidebarContent': {},

    '& .PageSimple-backdrop': {
        position: 'absolute',
    },
}))

/**
 *
 */
export interface IPageSimpleProps {
    /**
     *
     */
    className?: string
    /**
     *
     */
    innerScroll?: boolean
    /**
     *
     */
    contentToolbar?: JSX.Element
    /**
     *
     */
    content?: JSX.Element
    /**
     *
     */
    header?: JSX.Element
    /**
     *
     */
    onScrollY?: Function
}
const headerHeight = 120
const toolbarHeight = 64
const drawerWidth = 240

const PageSimple = forwardRef((props: IPageSimpleProps, ref) => {
    // console.info("render::PageSimple");
    const rootRef = useRef<HTMLDivElement | null>(null)

    useImperativeHandle(ref, () => ({
        rootRef,
    }))

    return (
        <>
            <GlobalStyles
                styles={() => {
                    return {
                        '#fuse-main': {
                            height: props.innerScroll ? '100vh' : '',
                        },
                    }
                }}
            />
            <Root
                className={clsx('PageSimple-root', props.innerScroll && 'PageSimple-innerScroll', props.className)}
                ref={rootRef}
            >
                <div className={clsx('PageSimple-header', 'PageSimple-topBg')} />

                <div className="flex flex-auto flex-col container z-10 h-full">
                    <div className="PageSimple-wrapper">
                        <FuseScrollbars
                            className="PageSimple-contentWrapper"
                            enable={props.innerScroll}
                            onScrollY={props.onScrollY}
                        >
                            {props.header ? <PageSimpleHeader header={props.header} /> : <></>}

                            {props.contentToolbar ? (
                                <div className={clsx('PageSimple-toolbar')}>{props.contentToolbar}</div>
                            ) : (
                                <></>
                            )}

                            {props.content ? <div className={clsx('PageSimple-content')}>{props.content}</div> : <></>}
                        </FuseScrollbars>
                    </div>
                </div>
            </Root>
        </>
    )
})

export default memo(styled(PageSimple)``)
