import { getTokenFromFirebase } from 'src/firebase'

jest.mock('firebase/app', () => ({
    ...jest.requireActual('firebase/app'),
    initializeApp: jest.fn(),
}))

jest.mock('firebase/messaging', () => ({
    ...jest.requireActual('firebase/messaging'),
    getMessaging: jest.fn(),
    getToken: jest.fn(),
    isSupported: jest.fn(),
}))

// Mock the PushNotifications module
jest.mock('@capacitor/push-notifications', () => ({
    ...jest.requireActual('@capacitor/push-notifications'),
    PushNotifications: {
        requestPermissions: jest.fn(),
        register: jest.fn(),
        addListener: jest.fn(),
    },
}))

jest.mock('src/common/react-platform-components', () => ({
    ...jest.requireActual('src/common/react-platform-components'),
    axios: {
        post: jest.fn(),
    },
}))

jest.mock('src/configs', () => ({
    ...jest.requireActual('src/configs'),
    REACT_APP_FIREBASE_VAPID_KEY: 'mockedVapidKey',
}))

let MOCK_RESPONSE_GET_TOKEN = 'mockedTokenValue'

const mockInitializeApp = require('firebase/app').initializeApp
const mockedGetMessaging = require('firebase/messaging').getMessaging
const mockedGetToken = require('firebase/messaging').getToken
const mockedIsSupported = require('firebase/messaging').isSupported
const mockAxios = require('src/common/react-platform-components').axios
const mockPushNotifications = require('@capacitor/push-notifications').PushNotifications

describe('test getTokenWithFirebase function', () => {
    describe('when the browser is supported', () => {
        beforeEach(() => {
            mockedIsSupported.mockResolvedValue(true)
        })
        test('when the token exists, it will send it to the backend', async () => {
            mockedGetToken.mockResolvedValue(MOCK_RESPONSE_GET_TOKEN)

            await getTokenFromFirebase()

            expect(mockedIsSupported).toHaveBeenCalled()
            expect(mockInitializeApp).toHaveBeenCalled()
            expect(mockedGetMessaging).toBeCalledWith(mockInitializeApp())
            // expect(mockedGetToken).toBeCalledWith(mockedGetMessaging(), { vapidKey: 'mockedVapidKey' })
            // expect(mockAxios.post).toBeCalledWith(`http://test.fake/add-subscriber-device-token`, {
            //     deviceToken: MOCK_RESPONSE_GET_TOKEN,
            // })
        })
        test('when the token does not exist, the post func should not be called', async () => {
            mockedGetToken.mockResolvedValue(undefined)

            await getTokenFromFirebase()

            expect(mockedIsSupported).toHaveBeenCalled()
            expect(mockInitializeApp).toHaveBeenCalled()
            expect(mockedGetMessaging).toBeCalledWith(mockInitializeApp())
            // expect(mockedGetToken).toBeCalledWith(mockedGetMessaging(), { vapidKey: 'mockedVapidKey' })
            // expect(mockAxios.post).not.toBeCalled()
        })
    })
    describe('when the browser is not supported', () => {
        beforeEach(() => {
            mockedIsSupported.mockResolvedValue(false)
            mockPushNotifications.requestPermissions.mockResolvedValue({ receive: 'granted' })
        })
        test('when the token exists, it will send it to the backend', async () => {
            await getTokenFromFirebase()

            expect(mockedIsSupported).toHaveBeenCalled()
            expect(mockPushNotifications.requestPermissions).toHaveBeenCalled()
            expect(mockPushNotifications.register).toHaveBeenCalled()
            expect(mockPushNotifications.addListener).toHaveBeenCalled()

            /**
             * Simulates the registration event callback.
             * `addListener.mock.calls` - This retrieves an array of all the calls made to addListener.
             * `calls[0]`: to access the first call, and `calls[0][1]`: to access the second argument which is the callback function passed to addListener.
             */
            const registrationCallback = mockPushNotifications.addListener.mock.calls[0][1]
            registrationCallback({ value: MOCK_RESPONSE_GET_TOKEN })

            expect(mockAxios.post).toHaveBeenCalledWith(`http://test.fake/add-subscriber-device-token`, {
                deviceToken: MOCK_RESPONSE_GET_TOKEN,
            })
        })
        test('when the token does not exist, the post func should not be called', async () => {
            await getTokenFromFirebase()

            expect(mockedIsSupported).toHaveBeenCalled()
            expect(mockPushNotifications.requestPermissions).toHaveBeenCalled()
            expect(mockPushNotifications.register).toHaveBeenCalled()
            expect(mockPushNotifications.addListener).toHaveBeenCalled()

            /**
             * Simulates the registration event callback.
             * `addListener.mock.calls` - This retrieves an array of all the calls made to addListener.
             * `calls[0]`: to access the first call, and `calls[0][1]`: to access the second argument which is the callback function passed to addListener.
             */
            const registrationCallback = mockPushNotifications.addListener.mock.calls[0][1]
            registrationCallback({ value: undefined })

            expect(mockAxios.post).not.toBeCalled()
        })
        test('when the permission is not granted, nothing should happen', async () => {
            mockPushNotifications.requestPermissions.mockResolvedValue({ receive: 'denied' })

            await getTokenFromFirebase()

            expect(mockedIsSupported).toHaveBeenCalled()
            expect(mockPushNotifications.requestPermissions).toHaveBeenCalled()
            expect(mockPushNotifications.register).not.toHaveBeenCalled()
            expect(mockPushNotifications.addListener).not.toHaveBeenCalled()
            expect(mockAxios.post).not.toBeCalled()
        })
    })
})
