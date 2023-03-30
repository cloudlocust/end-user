import { render } from '@testing-library/react'

import NavbarLogoComponent from './NavbarLogoComponent'

const MOCKED_CLIENT_WEBSITE_URL = 'https://www.myem.fr'

jest.mock('src/configs', () => ({
    ...jest.requireActual('src/configs'),
    CLIENT_WEBSITE_URL: 'https://www.myem.fr',
}))

describe('NavbarLogoComponent', () => {
    test('should have a valid href', async () => {
        const { getByRole } = render(<NavbarLogoComponent />)

        const logoImage = getByRole('link')
        expect(logoImage).toHaveAttribute('href', MOCKED_CLIENT_WEBSITE_URL)
    })
})
