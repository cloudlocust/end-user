import { renderHook } from '@testing-library/react-hooks'
import { useRenderCounter } from 'src/hooks/RenderCounter'

describe('useRenderCounter', () => {
    test('should increment renderCount on each render', () => {
        const componentName = 'TestComponent'
        const { result, rerender } = renderHook(() => useRenderCounter(componentName))

        // Initial render
        expect(result.current).toBe(1)

        // Re-render
        rerender()
        expect(result.current).toBe(2)

        // Multiple re-renders
        rerender()
        rerender()
        rerender()
        expect(result.current).toBe(5)
    })
})
