import React from 'react'
import { NovuProvider, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center'
import {
    REACT_APP_NOVU_APPLICATION_IDENTIFIER,
    REACT_APP_NOVU_BACKEND_URL,
    REACT_APP_NOVU_SOCKET_URL,
} from 'src/configs'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * Notification Component using novu library.
 *
 * @returns Notification Component.
 */
const Notification = () => {
    const { user } = useSelector(({ userModel }: RootState) => userModel)

    return (
        <NovuProvider
            subscriberId={user?.id}
            applicationIdentifier={REACT_APP_NOVU_APPLICATION_IDENTIFIER}
            backendUrl={REACT_APP_NOVU_BACKEND_URL}
            socketUrl={REACT_APP_NOVU_SOCKET_URL}
            i18n="fr"
        >
            <PopoverNotificationCenter onNotificationClick={() => {}} colorScheme="light" showUserPreferences={false}>
                {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
            </PopoverNotificationCenter>
        </NovuProvider>
    )
}

export default Notification
