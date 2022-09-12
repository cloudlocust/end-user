import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { addContractDataType, IContract } from 'src/modules/Contracts/contractsTypes'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * Endpoint for contracts mock.
 */
const MOCK_CONTRACT_ENDPOINT = `${HOUSING_API}/:houseId/contracts`
/**
 * HouseId for contract mock requests.
 */
export const TEST_HOUSE_ID = 1234

/**
 * Contract ID for success contractDetails request.
 */
export const TEST_SUCCESS_ID = 17707368031234

/**
 * Offer for error mock add contract.
 */
export const TEST_ERROR_OFFER = 'Mrs. Dennis'
/**
 * TEST DATE TIME.
 */
export const TEST_DATETIME = '2021-12-15T14:07:38.138000'

/**
 * MOCK Success Add Contract Object.
 */
export const TEST_SUCCESS_ADD_CONTRACT = {
    offer: 'TEST',
    power: 5,
    provider: 'EDF',
    tariff_type: 'Base',
    end_subscription: TEST_DATETIME,
    start_subscription: TEST_DATETIME,
}
/**
 * Mock of customers/clients list data.
 */
export var TEST_CONTRACTS: SnakeCasedPropertiesDeep<IContract>[] = [
    {
        id: TEST_SUCCESS_ID,
        offer: 'Leanne',
        power: 6,
        provider: 'EDF',
        tariff_type: 'Essentielle',
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Ervin',
        power: 6,
        provider: 'EDF',
        tariff_type: 'Essentielle',
        id: 11069265931234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Clementine',
        power: 6,
        provider: 'EDF',
        tariff_type: 'Base',
        id: 14631234471234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Patricia',
        power: 6,
        provider: 'Eni',
        tariff_type: 'Base',
        id: 49317096231234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Chelsey',
        power: 6,
        provider: 'Eni',
        tariff_type: 'Premium',
        id: 25495412891234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Mrs. Dennis',
        power: 6,
        provider: 'Planète Oui',
        tariff_type: 'Premium',
        id: 14779354781234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Kurtis',
        power: 6,
        provider: 'Total Energies',
        tariff_type: 'MaxPower',
        id: 21006761321234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        offer: 'Nicholas',
        power: 6,
        provider: 'Total Energies',
        tariff_type: 'MaxPower',
        id: 58649369431234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const contractsEndpoints = [
    // Get All Contracts
    rest.get(MOCK_CONTRACT_ENDPOINT, (req, res, ctx) => {
        const CONTRACTS_REPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<IContract>>(
            req,
            TEST_CONTRACTS as [],
        )
        if (CONTRACTS_REPONSE !== null) return res(ctx.status(200), ctx.delay(1000), ctx.json(CONTRACTS_REPONSE))
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),

    // Remove Contract
    rest.delete(`${MOCK_CONTRACT_ENDPOINT}/:id`, (req, res, ctx) => {
        const { id } = req.params
        if (parseInt(id) === TEST_SUCCESS_ID) {
            let indexOfContract = TEST_CONTRACTS.findIndex((c) => c.id === id)
            let oldContract = TEST_CONTRACTS[indexOfContract]
            TEST_CONTRACTS.splice(indexOfContract, 1)
            return res(ctx.status(200), ctx.delay(2000), ctx.json(oldContract))
        } else {
            return res(ctx.status(401), ctx.delay(2000))
        }
    }),

    // Add Contract
    rest.post<SnakeCasedPropertiesDeep<addContractDataType>>(MOCK_CONTRACT_ENDPOINT, (req, res, ctx) => {
        // Offer Error
        if (req.body.offer === TEST_ERROR_OFFER) {
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: 'Le numéro de compteur existe déjà' }))
        }
        // SUCCESS
        const lengthBefore = TEST_CONTRACTS.length
        const newContract = {
            ...req.body,
            provider: 'EDF',
            id: lengthBefore + 1,
        }
        TEST_CONTRACTS.push(newContract)
        return res(ctx.status(200), ctx.delay(1000), ctx.json(newContract))
    }),
]
