import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ReplaceNRLinkForm } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup'
import {
    MSG_REPLACE_NRLINK_CLEAR_OLD_DATA,
    MSG_REPLACE_NRLINK_MODAL_TITLE,
} from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkFormPopupConfig'

const mockUseReplaceNRLink = jest.fn()
const mockOnSuccessFn = jest.fn()
const mockCloseModalFn = jest.fn()

const TEST_TXT_FAKE_OLD_NRLINK_ID = '0CA2F400008A4F86'
const TEST_TXT_FAKE_NEW_NRLINK_ID = '0CA2F400008A4F42'

const mockEnqueueSnackbar = jest.fn()

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    /**
     * Mock the notistack useSnackbar hooks.
     *
     * @returns The notistack useSnackbar hook.
     */
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams to get the houseId from url.
     *
     * @returns UseParams containing houseId.
     */
    useParams: () => ({
        houseId: `42`,
    }),
}))

jest.mock('src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkHook'),

    /**
     * Mock the useReplaceNRLinkHook.
     *
     * @returns The hook to Replace NRLink.
     */
    useReplaceNRLinkHook: () => ({
        replaceNRLink: mockUseReplaceNRLink,
        loadingInProgress: false,
    }),
}))

describe('ReplaceNRLinkForm tests', () => {
    test('should render component properly', async () => {
        const { getByRole, getAllByRole, getByText } = reduxedRender(
            <BrowserRouter>
                <ReplaceNRLinkForm
                    meterGuid="42"
                    oldNRLinkGuid="fakeNRLinkGuid"
                    onAfterReplaceNRLink={mockOnSuccessFn}
                    closeModal={mockCloseModalFn}
                />
            </BrowserRouter>,
        )
        expect(getByRole('form')).toBeTruthy()
        expect(getByRole('separator')).toBeTruthy()
        expect(getByRole('textbox')).toBeTruthy()
        expect(getByRole('checkbox')).toBeTruthy()
        expect(getAllByRole('button')).toHaveLength(2)

        expect(getByText(MSG_REPLACE_NRLINK_MODAL_TITLE)).toBeTruthy()
        expect(getByText(MSG_REPLACE_NRLINK_CLEAR_OLD_DATA)).toBeTruthy()
    })
    describe('When interacting, should update correctly', () => {
        test('When just replacing nrLink, should act correctly', async () => {
            const { getByRole, getByText } = reduxedRender(
                <BrowserRouter>
                    <ReplaceNRLinkForm
                        meterGuid="42"
                        oldNRLinkGuid={TEST_TXT_FAKE_OLD_NRLINK_ID}
                        onAfterReplaceNRLink={mockOnSuccessFn}
                        closeModal={mockCloseModalFn}
                    />
                </BrowserRouter>,
            )

            userEvent.type(getByRole('textbox'), TEST_TXT_FAKE_NEW_NRLINK_ID)
            userEvent.click(getByText('Enregistrer'))

            await waitFor(() => {
                expect(mockUseReplaceNRLink).toBeCalledWith({
                    old_nrlink_guid: TEST_TXT_FAKE_OLD_NRLINK_ID,
                    new_nrlink_guid: TEST_TXT_FAKE_NEW_NRLINK_ID,
                    meter_guid: '42',
                })
            })

            await waitFor(() => {
                expect(mockOnSuccessFn).toBeCalled()
            })
        })
        test('When replacing nrLink and clearing old data, should act correctly', async () => {
            const { getByRole, getByText } = reduxedRender(
                <BrowserRouter>
                    <ReplaceNRLinkForm
                        meterGuid="42"
                        oldNRLinkGuid={TEST_TXT_FAKE_OLD_NRLINK_ID}
                        onAfterReplaceNRLink={mockOnSuccessFn}
                        closeModal={mockCloseModalFn}
                    />
                </BrowserRouter>,
            )

            userEvent.type(getByRole('textbox'), TEST_TXT_FAKE_NEW_NRLINK_ID)
            userEvent.click(getByRole('checkbox'))
            userEvent.click(getByText('Enregistrer'))

            await waitFor(() => {
                expect(mockUseReplaceNRLink).toBeCalledWith({
                    old_nrlink_guid: TEST_TXT_FAKE_OLD_NRLINK_ID,
                    new_nrlink_guid: TEST_TXT_FAKE_NEW_NRLINK_ID,
                    meter_guid: '42',
                    clear_data: true,
                })
            })

            await waitFor(() => {
                expect(mockOnSuccessFn).toBeCalled()
            })
        })

        test('When clicking on Cancel, should ask Parent to close Modal', async () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <ReplaceNRLinkForm
                        meterGuid="42"
                        oldNRLinkGuid={TEST_TXT_FAKE_OLD_NRLINK_ID}
                        onAfterReplaceNRLink={mockOnSuccessFn}
                        closeModal={mockCloseModalFn}
                    />
                </BrowserRouter>,
            )

            userEvent.click(getByText('Annuler'))

            await waitFor(() => {
                expect(mockCloseModalFn).toBeCalled()
            })
        })
    })
})
