import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EcowattWidget, ECOWATT_TITLE } from 'src/modules/Ecowatt/EcowattWidget'

const INFO_ICON = 'InfoOutlinedIcon'
const CLOSE_ICON = 'CloseIcon'

describe('Ecowatt Widget tests', () => {
    test('Ecowatt widget should be displayed with a helper icon', async () => {
        const { getByText, getByTestId } = reduxedRender(<EcowattWidget />)
        expect(getByText(ECOWATT_TITLE)).toBeTruthy()
        expect(getByTestId(INFO_ICON)).toBeTruthy()
    })
    test('When clicked on the icon button, a tooltip should open with ecowwatt consumption level', async () => {
        const { getByTestId } = reduxedRender(<EcowattWidget />)
        userEvent.click(getByTestId(INFO_ICON))
        expect(getByTestId(CLOSE_ICON)).toBeTruthy()
        userEvent.click(getByTestId(CLOSE_ICON))
        await waitFor(
            () => {
                expect(() => getByTestId(CLOSE_ICON)).toThrow()
            },
            { timeout: 3000 },
        )
    })
    test.todo('Ecowatt widget shuould have 4 buttons, 1 of the current day , 3 of the next days')
})
