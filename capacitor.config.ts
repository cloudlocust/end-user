import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.myem.myemapp',
    appName: 'myemapp',
    webDir: 'public',
    server: {
        cleartext: true,
        androidScheme: 'https',
    },
}

export default config
