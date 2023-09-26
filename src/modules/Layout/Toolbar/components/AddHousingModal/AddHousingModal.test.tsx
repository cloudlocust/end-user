import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { reduxedRender } from 'src/common/react-platform-components/test'
import AddHousingModal from 'src/modules/Layout/Toolbar/components/AddHousingModal'
import { AddHousingModalProps } from 'src/modules/Layout/Toolbar/components/AddHousingModal/AddHousingModal'

const MODAL_HOUSING_TEXT = 'Mon Nouveau Logement'

// Role
const MUI_MODAL_ROLE = 'presentation'

const mockAddHousingModalProps: AddHousingModalProps = {
    modalOpen: true,
    closeModal: jest.fn(),
}

describe('Test AddHousing Modal.', () => {
    test('when modalOpen is true, the Modal is shown.', async () => {
        const { getByText } = reduxedRender(<AddHousingModal {...mockAddHousingModalProps} />)
        expect(getByText(MODAL_HOUSING_TEXT)).toBeTruthy()
    })
    test('when modalOpen is false, the Modal is not shown.', async () => {
        mockAddHousingModalProps.modalOpen = false
        const { queryByText } = reduxedRender(<AddHousingModal {...mockAddHousingModalProps} />)
        expect(queryByText(MODAL_HOUSING_TEXT)).not.toBeTruthy()
    })
    test('when disableBackdropClick is true, and we click in backdrop, the Modal should not be closed.', async () => {
        mockAddHousingModalProps.modalOpen = true
        mockAddHousingModalProps.disableBackdropClick = true
        const { queryByText, getByRole } = reduxedRender(<AddHousingModal {...mockAddHousingModalProps} />)
        act(() => {
            fireEvent.click(getByRole(MUI_MODAL_ROLE).firstChild as HTMLDivElement)
        })
        expect(queryByText(MODAL_HOUSING_TEXT)).toBeTruthy()
    })
})
