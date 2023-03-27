import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { AnalysisMaxPower } from 'src/modules/Analysis/components/AnalysisMaxPower'
import { AnalysisMaxPowerProps } from 'src/modules/Analysis/components/AnalysisMaxPower/props'
import { IContract, loadContractResponse } from 'src/modules/Contracts/contractsTypes'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_CONTRACTS as MOCK_CONTRACTS } from 'src/mocks/handlers/contracts'
import { formatLoadContractResponseToIContract } from 'src/modules/Contracts/utils/contractsFunctions'

const TEST_CONTRACTS: IContract[] = applyCamelCase(MOCK_CONTRACTS).map((contract: loadContractResponse) =>
    formatLoadContractResponseToIContract(contract),
)
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
let mockContractList = [TEST_CONTRACTS[0]]

let mockData: IMetric[] = [
    {
        datapoints: [
            [4170, 1677456000000],
            [4920, 1677542400000],
            [4457, 1677628800000],
            [4508, 1677715200000],
            [4983, 1677801600000],
            [4164, 1677888000000],
            [4804, 1677974400000],
            [4712, 1678060800000],
            [4620, 1678147200000],
            [4675, 1678233600000],
            [4800, 1678320000000],
            [4651, 1678406400000],
            [4536, 1678492800000],
            [4536, 1678579200000],
            [4536, 1678665600000],
            [4700, 1678752000000],
            [4923, 1678838400000],
            [4343, 1678924800000],
            [4955, 1679011200000],
            [4227, 1679097600000],
            [4227, 1679184000000],
            [4883, 1679270400000],
            [4094, 1679356800000],
            [4106, 1679443200000],
            [4366, 1679529600000],
            [4481, 1679616000000],
            [4032, 1679702400000],
            [4571, 1679788800000],
            [4329, 1679875200000],
        ],
        target: metricTargetsEnum.pMax,
    },
]

let mockAnalysiMaxPowerProps: AnalysisMaxPowerProps = {
    data: mockData,
    housingId: LIST_OF_HOUSES[0].id,
}

/**
 * Mocking the useContractList.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useContractList: () => ({
        elementList: mockContractList,
    }),
}))

const MAX_ATTEINTE_MESSAGE = `${TEST_CONTRACTS[0].power} kVa`

describe('test AnalysisMaxPower', () => {
    test('When the max value is shown with contract in progress', async () => {
        const { getByText, getByTestId } = reduxedRender(<AnalysisMaxPower {...mockAnalysiMaxPowerProps} />)

        // Max is [4983, 1677801600000].
        expect(mockAnalysiMaxPowerProps.data).toBe(mockData)
        expect(getByTestId('pmax-svg')).toBeTruthy()
        expect(getByText('Pmax :')).toBeTruthy()
        expect(getByText('Souscrite :')).toBeTruthy()
        expect(getByText(MAX_ATTEINTE_MESSAGE)).toBeTruthy()
        expect(getByText('Max atteinte :')).toBeTruthy()
        expect(getByText('4.98 kVa le vendredi 3')).toBeTruthy()
    })
})
