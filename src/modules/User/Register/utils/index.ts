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
                    .replaceAll(',', '')
                    .replaceAll('.', '')
                    // Remove space from the start and end of string
                    .replaceAll(/^\s+|\s+$/g, '')
                    .replaceAll(' ', '%20')
                const formattedCity = city.replaceAll(/\s/g, '%20')
                url = { ...url, adresse: formattedAddress, code: zipCode, ville: formattedCity }
                break
        }
    }
    return `${new URLSearchParams(url).toString()}`
}
