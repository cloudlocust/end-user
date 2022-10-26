import { ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Function that opens a new window.
 *
 * @param url Url string.
 * @returns New window.
 */
const openWindow = (url: string) => {
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
 * @param param0.children Children.
 * @returns EnphaseConsentPopup as a portal window sharing the same DOM as the parent.
 */
export const EnphaseConsentPopup = ({
    onClose,
    url,
    children,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClose: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    url?: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    children?: ReactNode
}) => {
    const [newWindow] = useState(url ? openWindow(url) : openWindow(''))

    /**
     * Close the window when it's unloaded.
     */
    newWindow!.onbeforeunload = () => {
        onClose()
    }

    return createPortal(<>{!url ? 'Chargement...' : children}</>, newWindow!.document.body)
}
