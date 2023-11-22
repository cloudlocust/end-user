import { getMsgFromAxiosError, getQueryParamsFromFiltersObject } from '.'
import { orderListBy } from 'src/modules/utils'
window._env_ = {}

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

describe('Test orderListBy', () => {
    const item1 = { id: 1, value: 'B' }
    const item2 = { id: 3, value: 'D' }
    const item3 = { id: 2, value: 'A' }
    const item4 = { id: 4, value: 'C' }
    const listToOrder = [item1, item2, item3, item4]
    const listOrderedAscById = [item1, item3, item2, item4]
    const listOrderedDescById = [...listOrderedAscById].reverse()
    const listOrderedAscByValue = [item3, item1, item4, item2]
    const listOrderedDescByValue = [...listOrderedAscByValue].reverse()

    test('order by number value', () => {
        const ascOrderedList = orderListBy(listToOrder, (item) => item.id)
        expect(ascOrderedList).toEqual(listOrderedAscById)
        const descOrderedList = orderListBy(listToOrder, (item) => item.id, true)
        expect(descOrderedList).toEqual(listOrderedDescById)
    })

    test('order by string value', () => {
        const ascOrderedList = orderListBy(listToOrder, (item) => item.value)
        expect(ascOrderedList).toEqual(listOrderedAscByValue)
        const descOrderedList = orderListBy(listToOrder, (item) => item.value, true)
        expect(descOrderedList).toEqual(listOrderedDescByValue)
    })
})
