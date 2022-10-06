import { useRef } from 'react'

const SHOW_RENDER_COUNTERS = true

/**
 *  Hook that show renderCount.
 *
 * @returns Render count.
 */
export const useRenderCounter = () => {
    const renderCount = useRef(0)
    renderCount.current = renderCount.current + 1

    if (process.env.NODE_ENV === 'development' && SHOW_RENDER_COUNTERS) {
        // eslint-disable-next-line no-console
        return console.log('RENDER COUNT: ', renderCount.current)
    }
    return null
}
