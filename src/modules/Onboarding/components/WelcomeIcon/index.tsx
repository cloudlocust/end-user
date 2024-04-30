import { useEffect, useState } from 'react'
import Lottie, { Options } from 'react-lottie'
import { WelcomeIconProps } from 'src/modules/Onboarding/components/WelcomeIcon/WelcomeIcon.types'

const defaultOptions: Options = {
    loop: true, // Set to true for continuous looping
    autoplay: true, // Set to true for automatic playback
    animationData: './assets/images/content/onboarding/lottieWelcomeIcon.json',
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice', // Optional aspect ratio control
    },
}

/**
 *  Renders the WelcomeIcon component.
 *
 * @param root0 The props of the WelcomeIcon component.
 * @param root0.width The width of the component.
 * @param root0.style The style object for the component.
 * @param root0.options The options for the Lottie animation.
 * @returns The rendered WelcomeIcon component.
 */
export const WelcomeIcon = ({ width, style, options = defaultOptions }: WelcomeIconProps) => {
    const [animationData, setAnimationData] = useState(null)

    useEffect(() => {
        fetchAnimationData()
    }, [])

    /**
     * Fetches the animation data for the Lottie component.
     */
    const fetchAnimationData = async () => {
        try {
            const response = await fetch('./assets/images/content/onboarding/lottieWelcomeIcon.json')
            setAnimationData(await response.json())
        } catch (error) {
            // if the animation data cannot be fetched, we do nothing
        }
    }
    options.animationData = animationData
    return <Lottie options={options} width={width} style={style} />
}
