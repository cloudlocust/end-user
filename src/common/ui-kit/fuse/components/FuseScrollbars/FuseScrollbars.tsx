import { createRef, useCallback, useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles'
import MobileDetect from 'mobile-detect'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { useHistory } from 'react-router-dom'

const Root = styled('div')(() => ({
    overscrollBehavior: 'contain',
}))

const md = new MobileDetect(window.navigator.userAgent)
const isMobile = md.mobile()

/**
 * Props of FuseScrollbars, to implement its own scrollbar using perfect-scrollbar package.
 */
interface IFuseScrollbarsProps {
    /**
     *
     */
    id?: string
    /**
     *
     */
    className?: string
    /**
     * Flag for enabling or disabling FuseScrollbars.
     */
    enable?: boolean
    /**
     *
     */
    children?: JSX.Element | JSX.Element[]
    /**
     *
     */
    onScrollY?: Function
    /**
     *
     */
    onScrollX?: Function
    /**
     *
     */
    onScrollUp?: Function
    /**
     *
     */
    onScrollDown?: Function
    /**
     *
     */
    onScrollLeft?: Function
    /**
     *
     */
    onScrollRight?: Function
    /**
     *
     */
    onYReachStart?: Function
    /**
     *
     */
    onYReachEnd?: Function
    /**
     *
     */
    onXReachStart?: Function
    /**
     *
     */
    onXReachEnd?: Function
    /**
     *
     */
    scrollToTopOnRouteChange?: boolean
    /**
     *
     */
    scrollToTopOnChildChange?: boolean
    /**
     *
     */
    option?: PerfectScrollbar.Options
}

const handlerNameByEvent: /**
 *
 */
{ [name: string]: string } = {
    'ps-scroll-y': 'onScrollY',
    'ps-scroll-x': 'onScrollX',
    'ps-scroll-up': 'onScrollUp',
    'ps-scroll-down': 'onScrollDown',
    'ps-scroll-left': 'onScrollLeft',
    'ps-scroll-right': 'onScrollRight',
    'ps-y-reach-start': 'onYReachStart',
    'ps-y-reach-end': 'onYReachEnd',
    'ps-x-reach-start': 'onXReachStart',
    'ps-x-reach-end': 'onXReachEnd',
}

Object.freeze(handlerNameByEvent)

// TODO Remove
/**
 * A simple PerfectScrollbar react component.
 *
 * @param props IFuseScrollbarsProps.
 * @returns A simple PerfectScrollbar component.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const FuseScrollbars = (props: IFuseScrollbarsProps) => {
    const myRef = createRef<HTMLDivElement>()
    const ps = useRef<PerfectScrollbar | null>(null)
    const history = useHistory()
    const handlerByEvent = useRef(new Map())

    const hookUpEvents = useCallback(() => {
        const handlerPropsByName: /**
         * Selecting all the props handlers such as (onScrollY, onScrollX, ...etc), so that typescript don't call for error when using obj[key].
         */
        { [name: string]: Function | undefined } = {
            onScrollY: props.onScrollY,
            onScrollX: props.onScrollX,
            onScrollUp: props.onScrollUp,
            onScrollDown: props.onScrollDown,
            onScrollLeft: props.onScrollLeft,
            onScrollRight: props.onScrollRight,
            onYReachStart: props.onYReachStart,
            onYReachEnd: props.onYReachEnd,
            onXReachStart: props.onXReachStart,
            onXReachEnd: props.onXReachEnd,
        }
        Object.keys(handlerNameByEvent).forEach((key) => {
            const callback = handlerPropsByName[handlerNameByEvent[key]]
            if (callback) {
                /**
                 * Handler for Scollbars AddEventListener.
                 *
                 * @returns Void.
                 */
                const handler = () => callback(myRef?.current!)
                handlerByEvent.current.set(key, handler)
                myRef?.current!.addEventListener(key, handler, false)
            }
        })
    }, [
        myRef,
        props.onScrollY,
        props.onScrollX,
        props.onScrollUp,
        props.onScrollDown,
        props.onScrollLeft,
        props.onScrollRight,
        props.onYReachStart,
        props.onYReachEnd,
        props.onXReachStart,
        props.onXReachEnd,
    ])

    const unHookUpEvents = useCallback(() => {
        handlerByEvent.current.forEach((value, key) => {
            if (myRef?.current!) {
                myRef?.current!.removeEventListener(key, value, false)
            }
        })
        handlerByEvent.current.clear()
    }, [myRef])

    const destroyPs = useCallback(() => {
        unHookUpEvents()

        if (!ps.current) {
            return
        }
        ps.current.destroy()
        ps.current = null
    }, [unHookUpEvents])

    const createPs = useCallback(() => {
        if (isMobile || !myRef || ps.current) {
            return
        }

        ps.current = new PerfectScrollbar(myRef?.current!, props.option)

        hookUpEvents()
    }, [hookUpEvents, props.option, myRef])

    useEffect(() => {
        /**
         * Overriding Update Scrollbars.
         */
        function updatePs() {
            if (!ps.current) {
                return
            }
            ps.current.update()
        }

        updatePs()
    })

    useEffect(() => {
        createPs()
    }, [createPs, destroyPs])

    const scrollToTop = useCallback(() => {
        if (myRef && myRef?.current && myRef?.current.scrollTop) {
            myRef.current.scrollTop = 0
        }
    }, [myRef])

    useEffect(() => {
        if (props.scrollToTopOnChildChange) {
            scrollToTop()
        }
    }, [scrollToTop, props.children, props.scrollToTopOnChildChange])

    useEffect(
        () =>
            history.listen(() => {
                if (props.scrollToTopOnRouteChange) {
                    scrollToTop()
                }
            }),
        [scrollToTop, history, props.scrollToTopOnRouteChange],
    )

    useEffect(
        () => () => {
            destroyPs()
        },
        [destroyPs],
    )

    // console.info('render::ps');
    return (
        <Root
            id={props.id}
            className={props.className}
            style={
                (props.enable || true) && !isMobile
                    ? {
                          position: 'relative',
                          overflow: 'hidden!important',
                      }
                    : {}
            }
            ref={myRef}
        >
            {props.children}
        </Root>
    )
}

export default FuseScrollbars
