import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_FAQ } from 'src/mocks/handlers/faq'
import { useFAQ } from 'src/modules/FAQ/FAQHook/FAQhook'

const mockEnqueueSnackbar = jest.fn()

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

describe('Testing useFAQ hooks', () => {
    test('loadFAQ. Request success', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useFAQ(), { initialState: {} })
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
        expect(result.current.isLoadingInProgress).toBe(false)
        expect(result.current.dataFAQ).toHaveLength(TEST_FAQ.length)
    })
})
