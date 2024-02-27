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
        url: 'https://particuliers.nrlink.fr/services',
    },
    ios: {
        contentInset: 'always',
    },
}

export default config
