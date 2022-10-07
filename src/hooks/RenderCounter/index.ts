import { useRef } from 'react'

/**
 * Hook that show renderCount.
 *
 * In order to get the component name dynamically.
 * Let's suppose the component is named Home, you pass Home.name as an argument to the hook.
 * Then, the hook will console log the component name followed by the renderCount.
 *
 * @example
 * const Home = () => {
 *  renderCount = useRenderCounter(Home.name)
 *  // output: Home: 1
 *  return (
 *      // JSX
 *      {renderCount} // This will be ran every time the component is re-rendered.
 *  )
 * }
 * @param componentName Component name to be passed as arg.
 * @returns Render count.
 */
export const useRenderCounter = (componentName: string) => {
    const renderCount = useRef(0)
    renderCount.current = renderCount.current + 1

    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        return console.log(`${componentName}`, renderCount.current)
    }
    return null
}
