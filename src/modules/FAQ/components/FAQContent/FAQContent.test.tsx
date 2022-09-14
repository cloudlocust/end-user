import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { FAQContent } from 'src/modules/FAQ/components/FAQContent/FAQContent'
import { TEST_FAQ } from 'src/mocks/handlers/faq'
import { userInfo } from 'os'
import userEvent from '@testing-library/user-event'

let mockIsLoadingInProgress = true
const mockDataFAQ = TEST_FAQ

jest.mock('src/modules/FAQ/FAQHook/FAQhook', () => ({
    ...jest.requireActual('src/modules/FAQ/FAQHook/FAQhook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useFAQ: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
        dataFAQ: mockDataFAQ,
    }),
}))
const BUTTON_TEXT_CONTACT = 'Contacter le Support Technique'
describe('<FAQContent />', () => {
    test('displaying loading', async () => {
        const { getByRole } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <FAQContent />,
        )
        expect(getByRole('progressbar')).toBeTruthy()
    })
    test('displaying fields and button', async () => {
        mockIsLoadingInProgress = false
        const { getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <FAQContent />,
        )
        TEST_FAQ.forEach((item) => {
            expect(getByText(item.title)).toBeTruthy()
        })
        expect(getByText(BUTTON_TEXT_CONTACT)).toBeTruthy()
        userEvent.click(getByText(BUTTON_TEXT_CONTACT))
        expect(getByText(BUTTON_TEXT_CONTACT)).toHaveAttribute('href', 'mailto:laurence@myem.fr')
    })
})
