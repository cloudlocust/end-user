import { reduxedRender } from 'src/common/react-platform-components/test'
import AddHousingModal from 'src/modules/Layout/Toolbar/components/AddHousingModal'

const MODAL_HOUSING_TEXT = 'Mon Nouveau Logement'

describe('Test AddHousing Modal.', () => {
    test('when modalOpen is true, the Modal is shown.', async () => {
        const { getByText } = reduxedRender(<AddHousingModal modalOpen={true} closeModal={jest.fn()} />)
        expect(getByText(MODAL_HOUSING_TEXT)).toBeTruthy()
    })
    test('when modalOpen is false, the Modal is not shown.', async () => {
        const { queryByText } = reduxedRender(<AddHousingModal modalOpen={false} closeModal={jest.fn()} />)
        expect(queryByText(MODAL_HOUSING_TEXT)).not.toBeTruthy()
    })
})
