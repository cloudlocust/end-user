import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Router } from 'react-router-dom'
import { ResetPassword } from 'src/modules/User/ResetPassword/ResetPassword'
import { createMemoryHistory } from 'history'
import { URL_RESET_PASSWORD, URL_SET_PASSWORD } from './ResetPasswordConfig'
import { waitFor } from '@testing-library/react'
import { URL_LOGIN } from '../Login/LoginConfig'

const MODIFIER_VOTRE_MOT_DE_PASSE_TEXT = 'Modifier votre mot de passe'
const CREATE_PASSWORD = "Création d'un mot de passe"

describe('Test ResetPassword component', () => {
    test('ResetPassword and SetPassword cases, title should be shown accordingly', () => {
        const tokenQueryParam = '?token=123456ABCD'
        const resetPasswordCases = [
            {
                route: URL_RESET_PASSWORD,
                title: MODIFIER_VOTRE_MOT_DE_PASSE_TEXT,
            },
            {
                route: URL_SET_PASSWORD,
                title: CREATE_PASSWORD,
            },
        ]

        resetPasswordCases.forEach(({ route, title }) => {
            const history = createMemoryHistory({ initialEntries: [`${route}${tokenQueryParam}`] })
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <Router history={history}>
                        <ResetPassword />
                    </Router>
                </BrowserRouter>,
            )

            expect(history.location.search).toEqual(tokenQueryParam)
            expect(getByText(title)).toBeTruthy()
        })
    })

    test('Token not given ResetPassword and SetPassword cases, history push should be called', () => {
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

        const resetPasswordCases = [
            {
                route: URL_RESET_PASSWORD,
            },
            {
                route: URL_SET_PASSWORD,
            },
        ]

        resetPasswordCases.forEach(async ({ route }) => {
            mockPathname = route
            reduxedRender(
                <BrowserRouter>
                    <ResetPassword />
                </BrowserRouter>,
            )

            await waitFor(() => {
                expect(mockHistoryPush).toHaveBeenCalledWith(URL_LOGIN)
            })
        })
    })
})
