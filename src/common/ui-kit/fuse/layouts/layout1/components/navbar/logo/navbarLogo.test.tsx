/* eslint-disable jsdoc/require-jsdoc */
import { render } from '@testing-library/react'
import * as config from 'src/configs'
import NavbarLogo from 'src/common/ui-kit/fuse/layouts/layout1/components/navbar/logo/NavbarLogo'

const mockConfig = config as { CLIENT_LOGO_REDIRECT_LINK: string }
const mockLogoLinkURL = 'https://myem.fr'

jest.mock('src/configs', () => ({
    __esModule: true,
    CLIENT_LOGO_REDIRECT_LINK: null,
}))
describe('NavbarLogo', () => {
    describe('should not have a Link', () => {
        test('when env var is undefined', async () => {
            const { getByRole } = render(<NavbarLogo />)

            expect(() => getByRole('link')).toThrow()
        })

        test('when env var is not a link', async () => {
            mockConfig.CLIENT_LOGO_REDIRECT_LINK = 'heya'
            const { getByRole } = render(<NavbarLogo />)

            expect(() => getByRole('link')).toThrow()
        })
    })

    test('should have an href inside Logo', async () => {
        mockConfig.CLIENT_LOGO_REDIRECT_LINK = mockLogoLinkURL

        const { getByRole } = render(<NavbarLogo />)

        expect(getByRole('link')).toHaveAttribute('href', mockLogoLinkURL)
    })
})
