import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { IContract } from 'src/modules/Contracts/contractsTypes'
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
 * Contract GUID for success contractDetails request.
 */
export const TEST_SUCCESS_GUID = '17707368031234'

/**
 * Mock of customers/clients list data.
 */
export var TEST_CONTRACTS: SnakeCasedPropertiesDeep<IContract>[] = [
    {
        guid: TEST_SUCCESS_GUID,
        offer: 'Leanne',
        power: '6 kVA',
        provider: 'EDF',
        type: 'Essentielle',
    },
    {
        offer: 'Ervin',
        power: '6 kVA',
        provider: 'EDF',
        type: 'Essentielle',
        guid: '11069265931234',
    },
    {
        offer: 'Clementine',
        power: '6 kVA',
        provider: 'EDF',
        type: 'Base',
        guid: '14631234471234',
    },
    {
        offer: 'Patricia',
        power: '6 kVA',
        provider: 'Eni',
        type: 'Base',
        guid: '49317096231234',
    },
    {
        offer: 'Chelsey',
        power: '6 kVA',
        provider: 'Eni',
        type: 'Premium',
        guid: '25495412891234',
    },
    {
        offer: 'Mrs. Dennis',
        power: '6 kVA',
        provider: 'Planète Oui',
        type: 'Premium',
        guid: '14779354781234',
    },
    {
        offer: 'Kurtis',
        power: '6 kVA',
        provider: 'Total Energies',
        type: 'MaxPower',
        guid: '21006761321234',
    },
    {
        offer: 'Nicholas',
        power: '6 kVA',
        provider: 'Total Energies',
        type: 'MaxPower',
        guid: '58649369431234',
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

    // Remove Housing
    rest.delete(`${MOCK_CONTRACT_ENDPOINT}/:guid`, (req, res, ctx) => {
        const { guid } = req.params
        if (guid === TEST_SUCCESS_GUID) {
            let indexOfContract = TEST_CONTRACTS.findIndex((c) => c.guid === guid)
            let oldContract = TEST_CONTRACTS[indexOfContract]
            TEST_CONTRACTS.splice(indexOfContract, 1)
            return res(ctx.status(200), ctx.delay(2000), ctx.json(oldContract))
        } else {
            return res(ctx.status(401), ctx.delay(2000))
        }
    }),
]
