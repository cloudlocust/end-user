import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { ENPHASE_OFF_MESSAGE, NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

let mockNrLinkEnedisOff = true
let mockEnphaseOff = true

describe('load ConsumptionPeriod', () => {
    test('Error message if nrLINK, enedis and enphase are Off.', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <ChartErrorMessage
                    nrLinkEnedisOff={mockNrLinkEnedisOff}
                    nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                    linkTo="/my-houses/1256"
                    enphaseOff={mockEnphaseOff}
                    enphaseOffMessage={ENPHASE_OFF_MESSAGE}
                />
            </Router>,
        )
        expect(getByText(NRLINK_ENEDIS_OFF_MESSAGE)).toBeTruthy()
        expect(getByText(ENPHASE_OFF_MESSAGE)).toBeTruthy()
    })
    test('Error message if enphase is Off', async () => {
        mockNrLinkEnedisOff = false
        const { getByText } = reduxedRender(
            <Router>
                <ChartErrorMessage
                    nrLinkEnedisOff={mockNrLinkEnedisOff}
                    enphaseOff={mockEnphaseOff}
                    enphaseOffMessage={ENPHASE_OFF_MESSAGE}
                    linkTo="/my-houses/1256"
                />
            </Router>,
        )
        expect(getByText(ENPHASE_OFF_MESSAGE)).toBeTruthy()
    })
    test('Error message if nrLINK, enedis are Off', async () => {
        mockNrLinkEnedisOff = true
        mockEnphaseOff = false
        const { getByText } = reduxedRender(
            <Router>
                <ChartErrorMessage
                    nrLinkEnedisOff={mockNrLinkEnedisOff}
                    nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                    linkTo="/my-houses/1256"
                    enphaseOff={mockEnphaseOff}
                />
            </Router>,
        )
        expect(getByText(NRLINK_ENEDIS_OFF_MESSAGE)).toBeTruthy()
    })
})
