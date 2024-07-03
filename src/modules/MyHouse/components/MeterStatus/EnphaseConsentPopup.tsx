import { useState, useEffect } from 'react'

/**
 * Function that opens a new window.
 *
 * @param url Url string.
 * @returns New window.
 */
const openWindow = (url: string): Window | null => {
    return window.open(
        url,
        'enphaseConsentWindow',
        `width=640,height=480,left=${window.screen.availWidth / 2 - 200},top=${window.screen.availHeight / 2 - 150}`,
    )
}

/**
 * Component of EnphaseConsentPopup.
 *
 * @param param0 N/A.
 * @param param0.onClose On close function.
 * @param param0.url Url string.
 * @returns EnphaseConsentPopup as a portal window sharing the same DOM as the parent.
 */
export const EnphaseConsentPopup = ({
    onClose,
    url,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClose?: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    url?: string
}) => {
    const [newWindow, setNewWindow] = useState<Window | null>(null)

    useEffect(() => {
        const win = url ? openWindow(url) : openWindow('')
        setNewWindow(win)

        const interval = setInterval(() => {
            if (win && win.closed) {
                if (onClose) onClose()
                clearInterval(interval)
            }
        }, 1000)

        return () => {
            clearInterval(interval)
            if (win) {
                win.close()
            }
        }
    }, [url, onClose])

    useEffect(() => {
        if (newWindow && !url && newWindow.document.readyState === 'complete') {
            newWindow.document.body.innerHTML = `<div id="root"></div>`
            newWindow.document.title = 'Enphase Consent'

            const rootDiv = newWindow.document.getElementById('root')
            if (rootDiv) {
                rootDiv.appendChild(document.createElement('div'))
            }
        }
    }, [newWindow, url])

    return null
}
