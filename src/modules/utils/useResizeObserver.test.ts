import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import useResizeObserver from 'src/modules/utils/useResizeObserver'

describe('useResizeObserver', () => {
    beforeEach(() => {
        // Mock ResizeObserver
        window.ResizeObserver = jest.fn((_callback: ResizeObserverCallback) => ({
            observe: jest.fn(),
            disconnect: jest.fn(),
        })) as unknown as typeof ResizeObserver
    })

    it('should observe resize changes and call the callback', () => {
        const callback = jest.fn()
        const ref = { current: document.createElement('div') as HTMLElement }

        reduxedRenderHook(() => useResizeObserver(ref, callback))

        // Simulate resize
        const resizeObserverEntry = { target: ref.current }
        ;(window.ResizeObserver as jest.Mock).mock.calls[0][0]([resizeObserverEntry])

        expect(callback).toHaveBeenCalledWith(resizeObserverEntry)
    })
    it('should not observe resize changes if the ref is not available', () => {
        const callback = jest.fn()
        const ref = { current: null }

        reduxedRenderHook(() => useResizeObserver(ref, callback))

        expect(callback).not.toHaveBeenCalled()
    })
})
