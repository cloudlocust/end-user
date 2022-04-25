/**
 * Tracking Listener for PWA install prompt banner.
 */
export const pwaTrackingListeners = () => {
    /**
     * Fire Add to Home Banner.
     */
    const fireAddToHomeScreenImpression = () => {
        // This is to prevent `beforeinstallprompt` event that triggers again on `Add` or `Cancel` click
        window.removeEventListener('beforeinstallprompt', fireAddToHomeScreenImpression)
    }

    // Event listener before install prompt banner.
    window.addEventListener('beforeinstallprompt', fireAddToHomeScreenImpression)

    // Event listener when the app is installed.
    window.addEventListener('appinstalled', () => {})

    // Event listener when the service worker loads.
    window.addEventListener('load', () => {})
}
