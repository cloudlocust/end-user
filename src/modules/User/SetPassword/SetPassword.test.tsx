import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Router } from 'react-router-dom'
import { SetPassword } from 'src/modules/User/SetPassword/SetPassword'
import { createMemoryHistory } from 'history'
import { URL_SET_PASSWORD } from 'src/modules/User/SetPassword/SetPasswordConfig'
import { waitFor } from '@testing-library/react'
import { URL_LOGIN } from '../Login/LoginConfig'

const VERIFY_PASSWORD_TITLE_TEXT = 'Vérification de vos informations'
const CREATE_PASSWORD_TITLE_TEXT = "Création d'un mot de passe"

const mockHistoryPush = jest.fn()
let mockPathname = ''

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
        location: {
            pathname: mockPathname,
        },
    }),
}))

// UserInfo decoded object.
// const TEST_USER_INFO = {
//     email: 'mehdi+nedEnduser@myem.fr',
//     first_name: 'nedEnduser',
//     has_sensor: true,
//     interests: ['installation', 'supplier'],
//     last_name: 'mehdi',
//     phone: '1111111111',
//     address: {
//         city: 'Lyon',
//         country: 'France',
//         lat: 45.7570246,
//         lng: 4.856518599999999,
//         zip_code: '69003',
//         name: 'Part Dieu - Bir Hakeim, 69003 Lyon, France',
//     },
// }

const tokenQueryParam = 'token=123456ABCD'
const userInfoQueryParam =
    'userInfo=eyJlbWFpbCI6Im1laGRpK25lZEVuZHVzZXJAbXllbS5mciIsImZpcnN0X25hbWUiOiJuZWRFbmR1c2VyIiwiaGFzX3NlbnNvciI6dHJ1ZSwiaW50ZXJlc3RzIjpbImluc3RhbGxhdGlvbiIsInN1cHBsaWVyIl0sImxhc3RfbmFtZSI6Im1laGRpIiwicGhvbmUiOiIxMTExMTExMTExIiwiYWRkcmVzcyI6eyJjaXR5IjoiTHlvbiIsImNvdW50cnkiOiJGcmFuY2UiLCJsYXQiOjQ1Ljc1NzAyNDYsImxuZyI6NC44NTY1MTg1OTk5OTk5OTksInppcF9jb2RlIjoiNjkwMDMiLCJuYW1lIjoiUGFydCBEaWV1IC0gQmlyIEhha2VpbSwgNjkwMDMgTHlvbiwgRnJhbmNlIn19'

describe('Test SetPassword component', () => {
    test('SetPassword cases, title should be shown accordingly', async () => {
        const history = createMemoryHistory({
            initialEntries: [`${URL_SET_PASSWORD}?${tokenQueryParam}&${userInfoQueryParam}`],
        })
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Router history={history}>
                    <SetPassword />
                </Router>
            </BrowserRouter>,
        )

        expect(getByText(CREATE_PASSWORD_TITLE_TEXT)).toBeTruthy()
        expect(getByText(VERIFY_PASSWORD_TITLE_TEXT)).toBeTruthy()
    })

    test('Token not given, history push should be called', async () => {
        reduxedRender(
            <BrowserRouter>
                <SetPassword />
            </BrowserRouter>,
        )

        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith(URL_LOGIN)
        })
    })
    test('UserInfo not given, history push should be called', async () => {
        const history = createMemoryHistory({
            initialEntries: [`${URL_SET_PASSWORD}?${tokenQueryParam}`],
        })
        reduxedRender(
            <BrowserRouter>
                <Router history={history}>
                    <SetPassword />
                </Router>
            </BrowserRouter>,
        )

        await waitFor(() => {
            expect(mockHistoryPush).toHaveBeenCalledWith(URL_LOGIN)
        })
    })
})
