import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import { useFAQ } from 'src/modules/FAQ/FAQHook/FAQhook'

const mockEnqueueSnackbar = jest.fn()

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

describe('Testing useAccomodation hooks', () => {
    test('loadAccomodation. Request success', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useFAQ(), { initialState: {} })
        act(() => {
            result.current.loadFAQ()
        })
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
        expect(result.current.isLoadingInProgress).toBe(false)
    })
})
