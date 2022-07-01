import React from 'react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { buttonOptions } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import TargetButtonGroup from 'src/modules/MyConsumption/components/TargetButtonGroup'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

const mockRemoveTarget = jest.fn()
const mockAddTarget = jest.fn()
let mockHidePMax = false
const DISABLED_CLASSNAME = 'Mui-disabled'
const pmaxTarget = metricTargetsEnum.pMax
const internalTemperatureTarget = metricTargetsEnum.internalTemperatur
const externalTemperatureTarget = metricTargetsEnum.externalTemperatur
describe('<TargetButtonGroup /> props', () => {
    test('Checking that when the button is clicked, the value is saved', async () => {
        const { getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <TargetButtonGroup removeTarget={mockRemoveTarget} addTarget={mockAddTarget} hidePmax={mockHidePMax} />,
        )
        expect(getByText(buttonOptions[2].label)).toBeTruthy()
        userEvent.click(getByText(buttonOptions[2].label))
        expect(mockRemoveTarget).toHaveBeenCalledWith(internalTemperatureTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(externalTemperatureTarget)
        expect(mockAddTarget).toHaveBeenCalledWith(pmaxTarget)
        userEvent.click(getByText(buttonOptions[1].label))
        expect(mockAddTarget).toHaveBeenCalledWith(internalTemperatureTarget)
        expect(mockAddTarget).toHaveBeenCalledWith(externalTemperatureTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(pmaxTarget)
        userEvent.click(getByText(buttonOptions[0].label))
        expect(mockRemoveTarget).toHaveBeenCalledWith(pmaxTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(externalTemperatureTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(internalTemperatureTarget)
    })
    test('Сhecking if a day is selected, Pmax should be disabled', async () => {
        mockHidePMax = true
        const { getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <TargetButtonGroup removeTarget={mockRemoveTarget} addTarget={mockAddTarget} hidePmax={mockHidePMax} />,
        )
        expect(getByText(buttonOptions[2].label).classList.contains(DISABLED_CLASSNAME)).toBeTruthy()
    })
})
