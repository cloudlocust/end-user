import { useEffect } from 'react'
import { NovuProvider, useNotifications, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center'
import {
    REACT_APP_NOVU_APPLICATION_IDENTIFIER,
    REACT_APP_NOVU_BACKEND_URL,
    REACT_APP_NOVU_SOCKET_URL,
} from 'src/configs'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import EmptyTableMessage from 'src/common/ui-kit/components/Table/EmptyTableMessage'
import './Notification.scss'
import { useIntl } from 'src/common/react-platform-translation'
import { getTokenFromFirebase } from 'src/firebase'

/**
 * Notification Component using novu library.
 *
 * @returns Notification Component.
 */
const Notification = () => {
    const { user } = useSelector(({ userModel }: RootState) => userModel)

    useEffect(() => {
        // Send the device token to the backend
        getTokenFromFirebase()
    }, [])

    return (
        <NovuProvider
            subscriberId={user?.id}
            applicationIdentifier={REACT_APP_NOVU_APPLICATION_IDENTIFIER}
            backendUrl={REACT_APP_NOVU_BACKEND_URL}
            socketUrl={REACT_APP_NOVU_SOCKET_URL}
            i18n="fr"
        >
            <CustomNotification />
        </NovuProvider>
    )
}
export default Notification

/**
 * Customer Notification Footer component when notifications empty it shows an empty message, otherwise it hides the default "power by novu".
 *
 * @returns CustomNotification component.
 */
const CustomNotification = () => {
    const { notifications, fetching } = useNotifications()
    const { formatMessage } = useIntl()

    return (
        <div className="flex justify-center items-center mr-6 md:mr-0">
            <PopoverNotificationCenter
                onNotificationClick={() => {}}
                colorScheme="light"
                showUserPreferences={false}
                footer={() =>
                    fetching || notifications.length ? (
                        <></>
                    ) : (
                        <EmptyTableMessage
                            message={formatMessage({
                                id: 'La liste est vide',
                                defaultMessage: 'La liste est vide',
                            })}
                        />
                    )
                }
            >
                {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
            </PopoverNotificationCenter>
        </div>
    )
}
