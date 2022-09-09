import React from 'react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { FAQField } from './FAQField'

const propsFAQField = {
    title: 'Titre de la question',
    content: 'Réponse à la question',
}

describe('<FAQField /> props', () => {
    test('should use correctly by FAQField', async () => {
        const {  getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <FAQField {...propsFAQField} />,
        )

        expect(getByText(propsFAQField.title)).toBeTruthy()
        expect(getByText('add')).toBeTruthy()
        userEvent.click(getByText('add'))
        expect(getByText(propsFAQField.content)).toBeTruthy()
    })
})
