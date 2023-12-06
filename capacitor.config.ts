import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.myem.myemStaging',
    appName: 'myem-staging',
    webDir: 'public',
    plugins: {
        PushNotifications: {
            presentationOptions: ['badge', 'sound', 'alert'],
        },
    },
    server: {
        cleartext: true,
        androidScheme: 'https',
    },
}

export default config
