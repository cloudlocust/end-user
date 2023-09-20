import { renderHook, act } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react'
import useModal from 'src/hooks/useModal'

describe('useModal custom hook', () => {
    test('should initialize the state isOpen as false', () => {
        const { result } = renderHook(() => useModal())
        expect(result.current.isOpen).toBe(false)
    })

    test('should set isOpen to true when calling openModal', async () => {
        const { result } = renderHook(() => useModal())
        act(() => {
            result.current.openModal()
        })
        await waitFor(() => {
            expect(result.current.isOpen).toBe(true)
        })
    })

    test('should set isOpen to false when calling closeModal', async () => {
        const { result } = renderHook(() => useModal())
        act(() => {
            result.current.closeModal()
        })
        await waitFor(() => {
            expect(result.current.isOpen).toBe(false)
        })
    })
})
