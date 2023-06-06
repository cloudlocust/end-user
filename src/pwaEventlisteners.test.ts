import { pwaTrackingListeners } from 'src/pwaEventlisteners'

describe('pwaTrackingListeners', () => {
    let originalAddEventListener: typeof window.addEventListener
    let originalRemoveEventListener: typeof window.removeEventListener
    let eventListeners: { [event: string]: EventListener | EventListenerObject }

    beforeEach(() => {
        // Mock addEventListener and removeEventListener methods
        originalAddEventListener = window.addEventListener
        originalRemoveEventListener = window.removeEventListener
        window.addEventListener = jest.fn((event, listener) => {
            eventListeners[event] = listener
        })
        window.removeEventListener = jest.fn((event, listener) => {
            delete eventListeners[event]
        })

        // Initialize eventListeners object
        eventListeners = {}
    })

    afterEach(() => {
        // Restore original addEventListener and removeEventListener methods
        window.addEventListener = originalAddEventListener
        window.removeEventListener = originalRemoveEventListener
    })

    it('should remove beforeinstallprompt event listener when fired', () => {
        pwaTrackingListeners()

        // Trigger beforeinstallprompt event
        const beforeInstallPromptEvent = new Event('beforeinstallprompt')
        const listener = eventListeners.beforeinstallprompt
        if (typeof listener === 'function') {
            listener(beforeInstallPromptEvent)
        } else if (typeof listener === 'object' && listener.handleEvent) {
            listener.handleEvent(beforeInstallPromptEvent)
        }

        expect(window.removeEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function))
    })

    it('should add event listener for appinstalled', () => {
        pwaTrackingListeners()

        expect(window.addEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function))
    })

    it('should add event listener for load', () => {
        pwaTrackingListeners()

        expect(window.addEventListener).toHaveBeenCalledWith('load', expect.any(Function))
    })
})
