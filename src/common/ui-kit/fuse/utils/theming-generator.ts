import { createTheme, ThemeOptions, getContrastRatio } from '@mui/material/styles'
import _ from 'lodash'
import {
    extendThemeWithMixins,
    mustHaveThemeOptions,
    defaultThemeOptions,
} from 'src/common/ui-kit/fuse/configs/defaultThemeConfigs'
import colorThemes from 'src/common/ui-kit/fuse/configs/colorThemes'
import { CLIENT_ICON_FOLDER } from 'src/configs'

const idColorTheme = CLIENT_ICON_FOLDER

/**
 * Utility function to createTheme (MUI function) from colorThemes and default-settings.
 *
 * @param id Represent the theme name to generate.
 * @param direction Direction of the text.
 * @param contrast If there is need to generate a contrast of the current theme.
 * @returns MUI complete theme object based on idColorTheme.
 */
export function generateMuiTheme(id = idColorTheme, direction = 'ltr', contrast = null) {
    let colorTheme: ThemeOptions = colorThemes[id].MUI
    if (contrast) {
        colorTheme = _.merge({}, colorTheme, colorThemes[contrast])
    }
    const uncompleteTheme = _.merge({}, defaultThemeOptions, colorTheme, mustHaveThemeOptions)
    return createTheme(
        _.merge({}, uncompleteTheme, {
            mixins: extendThemeWithMixins(uncompleteTheme as ThemeOptions),
            direction,
        }) as ThemeOptions,
    )
}

/**
 * Function to create a contrast Theme based on the already applied main theme, this has the purpose of balancing colors and contrast based on the main theme.
 *
 * Example: if we have a dark1 main theme, then in Navbar we should have WHITE TEXT CONTRAST.
 *
 * @param bgColor Represent the bgColor of the Current Main Theme usually found in theme.palette.primary.main color.
 * @returns Theme Object of generateMuiTheme based on the Current Main Theme applied (if it's dark or light).
 */
export const selectContrastMainTheme = (bgColor: string) => {
    /**
     * This is function uses getConstrastRatio Function of MUI, to indicate the contrast of a color compared to a white background, it's helpful to know if the text is going to be more visible when it's dark or light compared to the primary color, Example color=blue then contrast to "FFFFFF" is 8.59, which means MainThemeLight gives white text is visible in the blue background.
     *
     * @param color The color for comparing its contrast level to white.
     * @returns Contrast level (1: being very bad, 21 Perfect, >= 3 is decent ...Etc).
     */
    function isDark(color: string) {
        return getContrastRatio(color, '#ffffff') >= 3
    }
    return isDark(bgColor) ? selectMainThemeDark() : selectMainThemeLight()
}

/**
 * Utility function to call the generateMuiTheme function.
 *
 * @returns Theme Object of generateMuiTheme.
 */
export const selectTheme = () => generateMuiTheme()

/**
 * Utility function to call the generateMuiTheme function with mainThemeDark (those who have dark bg colors).
 *
 * @returns Theme Object of generateMuiTheme.
 */
export const selectMainThemeDark = () => generateMuiTheme('mainThemeDark')

/**.
 * Utility function to call the generateMuiTheme function with mainThemeDark (those who have light bg colors).
 *
 *
 * @returns Theme Object of generateMuiTheme.
 */
export const selectMainThemeLight = () => generateMuiTheme('mainThemeLight')
