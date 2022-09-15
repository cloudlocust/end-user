import { formatLoadContractResponseToIContract } from 'src/modules/Contracts/utils/contractsFunctions'
import { TEST_CONTRACTS } from 'src/mocks/handlers/contracts'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IContract, loadContractResponse } from '../contractsTypes'

const value = applyCamelCase(TEST_CONTRACTS)[0] as loadContractResponse
const expectedValue: IContract = {
    ...value,
    offer: { id: value.offer.id, name: value.offer.name },
    provider: value.offer.provider,
}
describe('contractFunctions', () => {
    test('formatLoadContractResponseToIContract', async () => {
        const result = formatLoadContractResponseToIContract(value)
        expect(result).toEqual(expectedValue)
    })
})
