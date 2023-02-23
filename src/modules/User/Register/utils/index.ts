import { IUserRegister } from 'src/modules/User/model'

const mappedKeys = JSON.parse(process.env.REACT_APP_ENERGY_PROVIDER_REGISTER_MAPPING_KEYS as string)

/**
 * Function that convert user registration data to query string.
 *
 * @param data Registration data.
 * @returns Query string.
 */
export function convertUserDataToQueryString(data?: IUserRegister) {
    let url = {}
    // Remaaping const names.
    for (const key in data) {
        switch (key as keyof IUserRegister) {
            case 'civility':
                url = { ...url, [mappedKeys['civility']]: data['civility'] }
                break
            case 'firstName':
                url = { ...url, [mappedKeys['firstName']]: data['firstName'] }
                break
            case 'lastName':
                url = { ...url, [mappedKeys['lastName']]: data['lastName'] }
                break
            case 'email':
                const formattedEmail = data['email'].replace('@', '%40')
                url = { ...url, [mappedKeys['email']]: formattedEmail }
                break
            case 'phone':
                const formattedPhone = data['phone'].replace(/\+33 /, '0').replace(/\s/g, '')
                url = { ...url, [mappedKeys['phone']]: formattedPhone }
                break
            case 'address':
                // Address should be : Lyon Part Dieu, 5 Pl. Charles Béraudier
                const { city, zipCode, name, country } = data['address']
                const formattedAddress = name
                    .replace(city, '')
                    .replace(zipCode, '')
                    .replace(country, '')
                    .replace(/\s*,\s*/g, '')
                    .replace(/\./g, '')
                    // Remove space from the start and end of string
                    .replace(/^\s+|\s+$/g, '')
                url = {
                    ...url,
                    [mappedKeys['address']]: formattedAddress,
                    [mappedKeys['zipCode']]: zipCode,
                    [mappedKeys['city']]: city,
                }
                break
        }
    }

    // If there is an undefined key, it gets deleted.
    Object.keys(url).forEach((key) => {
        if (key === 'undefined') {
            delete url[key as keyof typeof url]
        }
    })

    return `${new URLSearchParams(url).toString()}`
}

/**
 * Siren regex that allow only digits and up to maximum 9.
 */
export const sirenFieldRegex = /^\d{9}$/.source
