import React from 'react'
import { cleanup } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import { requiredBuilder, Form } from 'src/common/react-platform-components'
import { PhoneNumber } from './PhoneNumber'
import { reduxedRender } from 'src/common/react-platform-components/test'

afterEach(cleanup)

const selectCountryButtonSelector = '.MuiButtonBase-root'
const phoneInputSelector = 'input[name="phone"]'

describe('<PhoneInput /> countries props', () => {
    test('must pass a name into the input', () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" />
            </Form>,
        )
        expect(container.querySelector('input')?.name).toBe('phone')
    })

    test('has not "us" country in the dropdown', () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" excludeCountries={['us']} />
            </Form>,
        )

        userEvent.click(container.querySelector(selectCountryButtonSelector) as HTMLButtonElement)

        expect(document.querySelectorAll('li.country[data-country-code="us"]').length).toBe(0)
        expect(document.querySelectorAll('li.country[data-country-code="fr"]').length).toBe(1)
    })

    test('has only "us" country in the dropdown', () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" onlyCountries={['us']} defaultCountry="us" />
            </Form>,
        )

        userEvent.click(container.querySelector(selectCountryButtonSelector) as HTMLButtonElement)

        expect(document.querySelectorAll('li[data-country-code="us"]').length).toBeGreaterThan(0)
        expect(document.querySelectorAll('li[data-country-code="fr"]').length).toBe(0)
    })

    test('has "es" in the preferred countries section', () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" preferredCountries={['es']} />
            </Form>,
        )

        userEvent.click(container.querySelector(selectCountryButtonSelector) as HTMLButtonElement)
        expect(document?.querySelector('#country-menu li.country')?.getAttribute('data-country-code')).toBe('es')
    })

    test("filter european countries with the regions={'europe'} prop", () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" regions={'europe'} />
            </Form>,
        )

        userEvent.click(container.querySelector(selectCountryButtonSelector) as HTMLButtonElement)
        expect(document.querySelectorAll('li[data-country-code="us"]').length).toBe(0)
        expect(document.querySelectorAll('li[data-country-code="ca"]').length).toBe(0)
        expect(document.querySelectorAll('li[data-country-code="ua"]').length).toBe(1)
        expect(document.querySelectorAll('li[data-country-code="fr"]').length).toBe(1)
    })

    test('has "es" as the default/highlighted country', () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" defaultCountry="es" />
            </Form>,
        )

        userEvent.click(container.querySelector(selectCountryButtonSelector) as HTMLButtonElement)
        expect(document.querySelector('li[data-country-code="es"]')?.classList).toContain('Mui-selected')
    })

    test('receive formatted value', () => {
        const { container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" value={'+33525256632'} />
            </Form>,
        )
        expect((container.querySelector(phoneInputSelector) as HTMLInputElement)?.value).toBe('+33 5 25 25 66 32')
    })

    test('should rerender without crashing', () => {
        const { container, rerender } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" value={undefined} />
            </Form>,
        )

        rerender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" value={'+33525256632'} />
            </Form>,
        )

        rerender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" value={''} />
            </Form>,
        )

        rerender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" value={null} />
            </Form>,
        )
        expect(container.querySelector(selectCountryButtonSelector)?.children.length).toBeGreaterThanOrEqual(1)
    })

    test('should to be required', async () => {
        const { findByText, getByTestId } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" validateFunctions={[requiredBuilder()]} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        await act(async () => {
            userEvent.click(getByTestId('submit'))
        })

        expect(await findByText('Champ obligatoire non renseigné')).toBeDefined()
    })

    test('should show Le numéro de téléphone indiqué est invalide.', async () => {
        const { findByText, container } = reduxedRender(
            <Form onSubmit={() => {}}>
                <PhoneNumber name="phone" label="Telephone" />
            </Form>,
        )

        userEvent.type(container.querySelector(phoneInputSelector) as HTMLInputElement, '5252')

        expect(await findByText('Le numéro de téléphone indiqué est invalide.')).toBeDefined()
    })

    test('should use correctly by react-hook-form', async () => {
        const handleSubmit = jest.fn()

        const { container, getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data: { phone: string }) => handleSubmit(data)}>
                <PhoneNumber name="phone" label="Telephone" validateFunctions={[requiredBuilder()]} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        userEvent.type(container.querySelector(phoneInputSelector) as HTMLInputElement, '652526235')

        await act(async () => {
            userEvent.click(getByTestId('submit'))
        })

        expect(handleSubmit).toHaveBeenCalledWith({ phone: '+33 6 52 52 62 35' })
    })
})
