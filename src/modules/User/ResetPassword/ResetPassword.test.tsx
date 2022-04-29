import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Router } from 'react-router-dom'
import { ResetPassword } from 'src/modules/User/ResetPassword/ResetPassword'
import { createMemoryHistory } from 'history'

const MODIFIER_VOTRE_MOT_DE_PASSE_TEXT = 'Modifier votre mot de passe'

describe('Test ResetPassword component', () => {
    test('when ResetPassword component is mounted', () => {
        const history = createMemoryHistory({ initialEntries: ['/reset-password?token=123456ABCD'] })
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <Router history={history}>
                    <ResetPassword />
                </Router>
            </BrowserRouter>,
        )

        expect(history.location.search).toEqual('?token=123456ABCD')
        expect(getByText(MODIFIER_VOTRE_MOT_DE_PASSE_TEXT)).toBeTruthy()
    })
})
