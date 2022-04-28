import { getMsgFromAxiosError, getQueryParamsFromFiltersObject } from '.'
if (process.env.NODE_ENV === 'test') {
    window._env_ = {}
}

describe('Test get msg from axios error function', () => {
    test('formatted case', () => {
        const error = {
            response: {
                status: 400,
                data: { detail: 'test case error' },
            },
        }
        expect(getMsgFromAxiosError(error)).toBe('test case error')
    })
    test('other cases', () => {
        const errorCases = [{}, { response: { status: 500 } }, { response: { status: 400 } }]
        for (const element of errorCases) {
            expect(getMsgFromAxiosError(element)).toBe("Une erreur s'est produite.")
        }
    })
})

describe('Test getQueryParamsFromFiltersObject', () => {
    test('Giving object with properties that can have null value', () => {
        const obj = {
            search: 'firstname',
            status: undefined,
            property: ['opt1', 'opt2'],
            is_active: true,
        }
        const obj2 = {}
        expect(getQueryParamsFromFiltersObject(obj)).toBe('search=firstname&property=opt1&property=opt2&is_active=true')

        // Case empty object
        expect(getQueryParamsFromFiltersObject(obj2)).toBe('')
    })
})
