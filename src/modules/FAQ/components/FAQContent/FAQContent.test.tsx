import React from 'react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { FAQContent } from 'src/modules/FAQ/components/FAQContent/FAQContent'
import { waitFor } from '@testing-library/react'

const propsFAQContent = {
    title: 'Titre de la question',
    content: 'Réponse à la question',
}
let mockIsLoadingInProgress = true
const POPUP_TITLE = 'Changer mon mot de passe'

jest.mock('src/modules/FAQ/FAQHook/FAQhook', () => ({
    ...jest.requireActual('src/modules/FAQ/FAQHook/FAQhook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useFAQ: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
    }),
}))
const BUTTON_TEXT_CONTACT = 'Contacter le Support Technique'
describe('<FAQContent />', () => {
    test('displaying the title and content passed to the field', async () => {
        const { getByText, getByRole } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <FAQContent />,
        )
        expect(getByRole('progressbar')).toBeTruthy()
        // // Open content
        // userEvent.click(getByText('add'))
        // expect(getByText(propsFAQContent.content)).toBeTruthy()
        // // Close Content
        // userEvent.click(getByText('add'))
        // await waitFor(() => {
        //     expect(() => getByText(propsFAQContent.content)).toThrow()
        // })
    })
    test('changedisplaying the title and content passed to the field', async () => {
        mockIsLoadingInProgress = false
        const { getByText, getByRole } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <FAQContent />,
        )
        expect(getByText(BUTTON_TEXT_CONTACT)).toBeTruthy()
        // // Close Content
        // userEvent.click(getByText('add'))
        // await waitFor(() => {
        //     expect(() => getByText(propsFAQContent.content)).toThrow()
        // })
    })
})
