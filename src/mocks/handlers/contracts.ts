import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { addContractDataType, IContract, loadContractResponse } from 'src/modules/Contracts/contractsTypes'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { TEST_OFFERS, TEST_CONTRACT_TYPES, TEST_PROVIDERS, TEST_TARIFF_TYPES } from 'src/mocks/handlers/commercialOffer'
/**
 * Endpoint for contracts mock.
 */
const MOCK_CONTRACT_ENDPOINT = `${HOUSING_API}/:houseId/housing_contracts`
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
export const TEST_ERROR_OFFER = -1
/**
 * TEST DATE TIME.
 */
export const TEST_DATETIME = '2021-12-15T14:07:38.138000'

/**
 * MOCK Success Add Contract Object.
 */
export const TEST_SUCCESS_ADD_CONTRACT: SnakeCasedPropertiesDeep<addContractDataType> = {
    offer_id: 7,
    power: 5,
    contract_type_id: 1,
    tariff_type_id: 2,
    end_subscription: TEST_DATETIME,
    start_subscription: TEST_DATETIME,
}
/**
 * Mock of customers/clients list data.
 */
export var TEST_CONTRACTS: SnakeCasedPropertiesDeep<loadContractResponse>[] = [
    {
        id: TEST_SUCCESS_ID,
        contract: {
            id: TEST_SUCCESS_ID,
            commercial_offer: { ...TEST_OFFERS[0], provider: TEST_PROVIDERS[0] },
            tariff_type: TEST_TARIFF_TYPES[0],
            contract_type: TEST_CONTRACT_TYPES[0],
        },
        power: 6,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 11069265931234,
            commercial_offer: { ...TEST_OFFERS[0], provider: TEST_PROVIDERS[1] },
            tariff_type: TEST_TARIFF_TYPES[0],
            contract_type: TEST_CONTRACT_TYPES[0],
        },
        power: 6,
        id: 11069265931234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 14631234471234,
            commercial_offer: { ...TEST_OFFERS[1], provider: TEST_PROVIDERS[2] },
            tariff_type: TEST_TARIFF_TYPES[1],
            contract_type: TEST_CONTRACT_TYPES[0],
        },
        power: 6,
        id: 14631234471234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 49317096231234,
            commercial_offer: { ...TEST_OFFERS[1], provider: TEST_PROVIDERS[3] },
            tariff_type: TEST_TARIFF_TYPES[1],
            contract_type: TEST_CONTRACT_TYPES[1],
        },
        power: 6,
        id: 49317096231234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 25495412891234,
            commercial_offer: { ...TEST_OFFERS[2], provider: TEST_PROVIDERS[4] },
            tariff_type: TEST_TARIFF_TYPES[2],
            contract_type: TEST_CONTRACT_TYPES[1],
        },
        power: 6,
        id: 25495412891234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 14779354781234,
            commercial_offer: { ...TEST_OFFERS[2], provider: TEST_PROVIDERS[5] },
            tariff_type: TEST_TARIFF_TYPES[2],
            contract_type: TEST_CONTRACT_TYPES[1],
        },
        power: 6,
        id: 14779354781234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 21006761321234,
            commercial_offer: { ...TEST_OFFERS[3], provider: TEST_PROVIDERS[6] },
            tariff_type: TEST_TARIFF_TYPES[1],
            contract_type: TEST_CONTRACT_TYPES[0],
        },
        power: 6,
        id: 21006761321234,
        end_subscription: TEST_DATETIME,
        start_subscription: TEST_DATETIME,
    },
    {
        contract: {
            id: 58649369431234,
            commercial_offer: { ...TEST_OFFERS[3], provider: TEST_PROVIDERS[7] },
            tariff_type: TEST_TARIFF_TYPES[0],
            contract_type: TEST_CONTRACT_TYPES[1],
        },
        power: 6,
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
        const { offer_id: offerId, contract_type_id: contractTypeId, tariff_type_id: tariffTypeId } = req.body
        // Detail Offer Error
        if (offerId === TEST_ERROR_OFFER) {
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: "L'offre est invalide" }))
        }
        // ContractType Error
        if (contractTypeId === TEST_ERROR_OFFER) {
            return res(ctx.status(400), ctx.delay(1000))
        }
        // SUCCESS
        const lengthBefore = TEST_CONTRACTS.length
        const power = req.body.power
        const newContract = {
            id: lengthBefore + 1,
            power,
            contract: {
                id: lengthBefore + 1,
                commercial_offer: { ...TEST_OFFERS[offerId - 1], provider: TEST_PROVIDERS[0] },
                contract_type: TEST_CONTRACT_TYPES[contractTypeId - 1],
                tariff_type: TEST_TARIFF_TYPES[tariffTypeId - 1],
            },
            end_subscription: TEST_DATETIME,
            start_subscription: TEST_DATETIME,
        }
        TEST_CONTRACTS.push(newContract)
        return res(ctx.status(200), ctx.delay(1000), ctx.json(newContract))
    }),

    // Edit Contract
    rest.put<SnakeCasedPropertiesDeep<addContractDataType>>(`${MOCK_CONTRACT_ENDPOINT}/:id`, (req, res, ctx) => {
        const { offer_id: offerId, contract_type_id: contractTypeId, tariff_type_id: tariffTypeId } = req.body
        const { id } = req.params

        // SUCCESS
        if (parseInt(id)) {
            const lengthBefore = TEST_CONTRACTS.length
            const power = req.body.power
            const newContract = {
                id: lengthBefore + 1,
                power,
                contract: {
                    id: lengthBefore + 1,
                    commercial_offer: { ...TEST_OFFERS[offerId - 1], provider: TEST_PROVIDERS[0] },
                    contract_type: TEST_CONTRACT_TYPES[contractTypeId - 1],
                    tariff_type: TEST_TARIFF_TYPES[tariffTypeId - 1],
                },
                end_subscription: TEST_DATETIME,
                start_subscription: TEST_DATETIME,
            }
            TEST_CONTRACTS.push(newContract)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(newContract))
        }
        // Detail Offer Error
        if (offerId === TEST_ERROR_OFFER) {
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: "L'offre est invalide" }))
        }
        // Edit Error
        return res(ctx.status(400), ctx.delay(1000))
    }),
]
