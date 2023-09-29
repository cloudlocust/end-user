import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'

describe('MicrowaveMeasurement tests', () => {
    test('renders the MicrowaveMeasurement modal and close it', async () => {
        const onCloseModelMock = jest.fn()
        reduxedRender(<MicrowaveMeasurement equipmentsNumber={1} isModalOpen={true} onCloseModal={onCloseModelMock} />)

        userEvent.click(screen.getByRole('button', { name: 'close' }))
        await waitFor(() => {
            expect(onCloseModelMock).toHaveBeenCalledTimes(1)
        })
    })
})
