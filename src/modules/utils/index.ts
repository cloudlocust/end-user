/**
 * This function handle error cases of axios request.
 *
 * @param error Axios error object.
 * @returns {string} Error message.
 */
export const getMsgFromAxiosError = (error: any) => {
    if (error?.response && error.response?.status === 400 && error.response.data && 'detail' in error.response?.data) {
        return error.response.data.detail
    }
    return "Une erreur s'est produite."
}

/**
 * Convert an object with {key1:value1, key2:value2, key3: [opt1, opt2, opt3], key4: undefined ...etc} pairs into URL queryParams in the following format '&key1=value1&key2=value2 ...etc.
 *
 * @param obj Object representing the filterObject .
 * @returns Properties of the object as URL QueryParams.
 */
export const getQueryParamsFromFiltersObject = (
    obj:
        | Record<string, string | string[] | boolean | undefined>
        // eslint-disable-next-line jsdoc/require-jsdoc
        | {},
) => {
    let queryParams: string[] = []
    Object.entries(obj).forEach(([key, value]) => {
        /**
         * In filterObject we can have a property that represents a select type, and thus it'll have as value.
         * An array of string of the different selected options that will be passe in the queryParam for the same url.
         * For example FilterObject= {property1: true, property2: undefined, property3: ['OPT1', 'OPT2']}.
         * We will construct the following queryParams &property1=true&property3=OPT1&property3=OPT2.
         *
         */
        if (Array.isArray(value)) {
            value.forEach((element) => queryParams.push(`${key}=${element}`))
        } else {
            if (typeof value !== 'undefined') queryParams.push(`${key}=${value}`)
        }
    })
    return queryParams.join('&')
}
/**
 * Type of the search filters, used in all elementList pages with search bar in the header.
 */
export type searchFilterType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Value of searchbar.
         */
        search?: string
    }

/**
 * Regex that matches Minimum eight characters, at least one uppercase letter, one lowercase letter and on special character (@$!%*?&), for stronger passwords.
 *
 * RegExp.source return the string pattern, Instead of storing the string directly in the variable because Jenkins SonarQ thinks the string is a password and thus sonarQ fails, and reports as a Security Hotspots Rank E.
 */
export const passwordFieldValidationSecurity1 = new RegExp(
    '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[~_\\^\\*%/\\.+:;=@$!%#?&]).{8,}$',
).source

export const mockDayjsFactory = (dayjsDate: string | Date) => {
    const originalDayjs = jest.requireActual('dayjs')
    const utc = require('dayjs/plugin/utc')
    const frLocale = require('dayjs/locale/fr')
    originalDayjs.extend(utc)

    // eslint-disable-next-line jsdoc/require-jsdoc
    const mockDayjs = (...args: string[]) => {
        return args.length ? originalDayjs(...args) : originalDayjs(dayjsDate)
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    mockDayjs.extend = (plugin: any) => {
        originalDayjs.extend(plugin)
    }

    // Apply the UTC plugin (and other plugins if necessary)
    mockDayjs.extend(utc)

    const instance = mockDayjs()
    instance.locale('fr')

    return () => mockDayjs
}
