import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'

describe('MicrowaveMeasurement tests', () => {
    test('renders the MicrowaveMeasurement modal and close it', async () => {
        const onCloseModalMock = jest.fn()
        reduxedRender(
            <MicrowaveMeasurement
                housingEquipmentId={25}
                equipmentsNumber={1}
                measurementModes={['A', 'B']}
                isMeasurementModalOpen={true}
                onCloseMeasurementModal={onCloseModalMock}
            />,
        )

        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(onCloseModalMock).toHaveBeenCalledTimes(1)
        })
    })
})
