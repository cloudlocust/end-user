import { IUserRegister } from 'src/modules/User/model'

/**
 * Function that convert user registration data to query string.
 *
 * @param data Registration data.
 * @returns Query string.
 */
export function convertUserDataToQueryString(data: IUserRegister) {
    let url = {}
    // Remaaping const names.
    for (const key in data) {
        switch (key as keyof IUserRegister) {
            case 'civility':
                url = { ...url, civilite: data['civility'] }
                break
            case 'firstName':
                url = { ...url, nom: data['firstName'] }
                break
            case 'lastName':
                url = { ...url, prenom: data['lastName'] }
                break
            case 'email':
                const formattedEmail = data['email'].replace('@', '%40')
                url = { ...url, email: formattedEmail }
                break
            case 'phone':
                const formattedPhone = data['phone'].replace(/\+33 /, '0').replace(/\s/g, '')
                url = { ...url, phone: formattedPhone }
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
                url = { ...url, adresse: formattedAddress, code: zipCode, ville: city }
                break
        }
    }

    return `${new URLSearchParams(url).toString()}`
}

/**
 * Siren regex that allow only digits and up to maximum 9.
 */
export const sirenFieldRegex = /^\d{9}$/.source
