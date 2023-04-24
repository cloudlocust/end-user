import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { FAQField } from 'src/modules/FAQ/components/FAQFileld/FAQField'
import { waitFor } from '@testing-library/react'

const propsFAQField = {
    title: 'Titre de la question',
    content: 'Réponse à la question',
}

describe('<FAQField />', () => {
    test('displaying the title and content passed to the field', async () => {
        const { getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <FAQField {...propsFAQField} />,
        )
        expect(getByText(propsFAQField.title)).toBeTruthy()
        // Open content
        userEvent.click(getByText('add'))
        expect(getByText(propsFAQField.content)).toBeTruthy()
        // Close Content
        userEvent.click(getByText('add'))
        await waitFor(() => {
            expect(() => getByText(propsFAQField.content)).toThrow()
        })
    })
})
