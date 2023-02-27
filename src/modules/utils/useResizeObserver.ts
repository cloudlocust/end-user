import { RefObject, useCallback, useLayoutEffect } from 'react'

/**
 * Use ResizeObserver Hook. This hook fires the callback when the ref object is resized.
 * The callback is fired with the element whose size changed.
 *
 * @param ref The element to observe.
 * @param callback The callback to run when the element's size change.
 */
export const useResizeObserver = (ref: RefObject<HTMLElement>, callback: (entry: ResizeObserverEntry) => void) => {
    const notifyResize = useCallback(
        (entries: ResizeObserverEntry[]) => {
            if (!Array.isArray(entries)) {
                return
            }

            callback(entries[0])
        },
        [callback],
    )

    // Using LayoutEffect because we want our changes to take place after the component is finished rendering.
    useLayoutEffect(() => {
        if (!ref.current) {
            return
        }
        let RO: ResizeObserver | undefined = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            notifyResize(entries)
        })

        RO.observe(ref.current)

        return () => {
            RO!.disconnect()
            RO = undefined
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- false positive
    }, [ref])
}

export default useResizeObserver
