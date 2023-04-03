import { render } from '@testing-library/react'

import NavbarLogo from 'src/common/ui-kit/fuse/layouts/layout1/components/navbar/logo/NavbarLogo'

var MOCKED_CLIENT_WEBSITE_URL: string | undefined = undefined

jest.mock('src/configs', () => ({
    ...jest.requireActual('src/configs'),
    CLIENT_LOGO_REDIRECT_LINK: MOCKED_CLIENT_WEBSITE_URL,
}))

describe('NavbarLogo', () => {
    test('should not have an href', async () => {
        const { getByRole } = render(<NavbarLogo />)

        expect(() => getByRole('link')).toThrow()
    })
})
