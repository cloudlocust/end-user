import React from 'react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TargetButtonGroup } from 'src/modules/MyConsumption'
import { buttonOptions } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

const mockRemoveTarget = jest.fn()
const mockAddTarget = jest.fn()
let mockHidePMax = false
const DISABLED_CLASSNAME = 'Mui-disabled'
const pmaxTarget = 'enedis_max_power'
const internalTemperaturTarget = 'nrlink_internal_temperature_metrics'
const externalTemperatureTarget = 'external_temperature_metrics'
describe('<TargetButtonGroup /> props', () => {
    test('Checking that when the button is clicked, the value is saved', async () => {
        const { getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <TargetButtonGroup removeTarget={mockRemoveTarget} addTarget={mockAddTarget} hidePmax={mockHidePMax} />,
        )
        expect(getByText(buttonOptions[2].label)).toBeTruthy()
        userEvent.click(getByText(buttonOptions[2].label))
        expect(mockRemoveTarget).toHaveBeenCalledWith(internalTemperaturTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(externalTemperatureTarget)
        expect(mockAddTarget).toHaveBeenCalledWith(pmaxTarget)
        userEvent.click(getByText(buttonOptions[1].label))
        expect(mockAddTarget).toHaveBeenCalledWith(internalTemperaturTarget)
        expect(mockAddTarget).toHaveBeenCalledWith(externalTemperatureTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(pmaxTarget)
        userEvent.click(getByText(buttonOptions[0].label))
        expect(mockRemoveTarget).toHaveBeenCalledWith(pmaxTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(externalTemperatureTarget)
        expect(mockRemoveTarget).toHaveBeenCalledWith(internalTemperaturTarget)
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
