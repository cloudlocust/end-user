import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'
import { waitFor } from '@testing-library/react'
import DeleteProfile from 'src/modules/User/DeleteProfile/DeleteProfile'

const DELETE_PROFILE_WARNING_MESSAGE =
    'Vous êtes sur le point de supprimer votre compte utilisateur. Attention, toutes les données relatives à votre compte seront supprimées. Êtes-vous sûr de vouloir continuer ?'
const CONFIRM_BUTTON_TEXT = 'Continuer'
const CANCEL_BUTTON_TEXT = 'Annuler'
const DELETE_ICON_TEXT = 'delete'
const circularProgressClassname = '.MuiCircularProgress-root'
let mockIsLoadingInProgress = false
const mockDeleteProfile = jest.fn()

jest.mock('src/modules/User/ProfileManagement/ProfileManagementHooks', () => ({
    ...jest.requireActual('src/modules/User/ProfileManagement/ProfileManagementHooks'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useProfileManagement: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
        deleteProfile: mockDeleteProfile,
    }),
}))

describe('Test DeleteProfile Component', () => {
    test('When clicking on delete icon warning popup opens', async () => {
        const { getByText } = reduxedRender(
            <ConfirmProvider>
                <DeleteProfile />
            </ConfirmProvider>,
        )

        // Open delete profile warning popoup
        userEvent.click(getByText(DELETE_ICON_TEXT)!.parentElement!)
        // Asset delete profile warning popoup
        expect(getByText(DELETE_PROFILE_WARNING_MESSAGE)).toBeTruthy()
        expect(getByText(CONFIRM_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(CANCEL_BUTTON_TEXT)).toBeTruthy()
    })

    test('When on Confirm of warning popup, mockDeleteProfile should be called', async () => {
        const { getByText } = reduxedRender(
            <ConfirmProvider>
                <DeleteProfile />
            </ConfirmProvider>,
        )
        // Open delete profile warning popoup
        userEvent.click(getByText(DELETE_ICON_TEXT)!.parentElement!)
        // Click on confirm
        userEvent.click(getByText(CONFIRM_BUTTON_TEXT))
        // Wait for popup warning to close.
        await waitFor(() => {
            expect(() => getByText(DELETE_PROFILE_WARNING_MESSAGE)).toThrow()
        })
        // Asset deleteProfile having been called
        expect(mockDeleteProfile).toHaveBeenCalled()
    })
    test('When isContractLoadingInProgress spinner should be shown', async () => {
        mockIsLoadingInProgress = true
        const { container, getByText } = reduxedRender(
            <ConfirmProvider>
                <DeleteProfile />
            </ConfirmProvider>,
        )

        expect(() => getByText(DELETE_ICON_TEXT)).toThrow()
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
