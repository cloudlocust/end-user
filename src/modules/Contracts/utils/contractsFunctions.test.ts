import {
    formatLoadContractResponseToIContract,
    getTariffContractUnit,
    isValidDate,
} from 'src/modules/Contracts/utils/contractsFunctions'
import { TEST_DATETIME } from 'src/mocks/handlers/contracts'
import { IContract, frequencyEnum, loadContractResponse } from 'src/modules/Contracts/contractsTypes.d'

const value: loadContractResponse = {
    contract: {
        id: 11069265931234,
        commercialOffer: {
            id: 1,
            name: 'Bleu',
            provider: {
                id: 1,
                name: 'EDF',
            },
        },
        tariffType: {
            id: 1,
            name: 'BASE',
        },
        contractType: {
            id: 1,
            name: 'Particulier',
        },
    },
    power: 6,
    id: 11069265931234,
    endSubscription: TEST_DATETIME,
    startSubscription: TEST_DATETIME,
}

const expectedValue: IContract = {
    id: 11069265931234,
    offer: {
        id: 1,
        name: 'Bleu',
    },
    provider: {
        id: 1,
        name: 'EDF',
    },
    tariffType: {
        id: 1,
        name: 'BASE',
    },
    contractType: {
        id: 1,
        name: 'Particulier',
    },
    power: 6,
    endSubscription: TEST_DATETIME,
    startSubscription: TEST_DATETIME,
}

describe('contractFunctions', () => {
    test('formatLoadContractResponseToIContract', async () => {
        const result = formatLoadContractResponseToIContract(value)
        expect(result).toEqual(expectedValue)
    })

    test('getTariffContractUnit', async () => {
        const cases = [
            {
                tariff: { label: 'abonnement', price: 36.0, freq: frequencyEnum.MONTHLY },
                expectedUnit: '€/mois',
            },
            {
                tariff: { label: 'prix kwh', price: 0.125, freq: frequencyEnum.DAILY },
                expectedUnit: '€/kWh',
            },
        ]
        cases.forEach(({ tariff, expectedUnit }) => {
            const result = getTariffContractUnit(tariff)
            expect(result).toBe(expectedUnit)
        })
    })

    test('isValidDate', async () => {
        const cases = [
            {
                date: '2023-04-07',
                expectedResult: true,
            },
            {
                date: '2023-04-31',
                expectedResult: true,
            },
            {
                date: 'not a date',
                expectedResult: false,
            },
            {
                date: '0',
                expectedResult: false,
            },
        ]
        cases.forEach(({ date, expectedResult }) => {
            const result = isValidDate(date)
            expect(result).toBe(expectedResult)
        })
    })
})
