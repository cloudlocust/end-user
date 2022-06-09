import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MyConsumptionSelectMeters } from './MyConsumptionSelectMeters'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import { IMeter } from 'src/modules/Meters/Meters'
import userEvent from '@testing-library/user-event'
import { cleanup } from '@testing-library/react'

let mockMeterList: IMeter[] | null = TEST_METERS
let mockSetFilters = jest.fn()
const ALL_METERS = 'Tous les compteurs'
const METER_NAME = 'Leanne'
const SELECTED_CLASSNAME = 'Mui-selected'

jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterList: () => ({
        elementList: mockMeterList,
    }),
}))
describe('Test MyConsumptionSelectMeters', () => {
    afterEach(cleanup)
    test('Сhecking active field change in select', async () => {
        mockMeterList = TEST_METERS
        const { getByText } = reduxedRender(
            <MyConsumptionSelectMeters setFilters={mockSetFilters} metersList={mockMeterList} />,
        )
        expect(getByText(ALL_METERS)).toBeTruthy()
        userEvent.click(getByText(ALL_METERS))
        expect(getByText(METER_NAME)).toBeTruthy()
        userEvent.click(getByText(METER_NAME))
        expect(getByText(ALL_METERS).classList.contains(SELECTED_CLASSNAME)).toBeFalsy()
        userEvent.click(getByText(ALL_METERS))
    })
})
