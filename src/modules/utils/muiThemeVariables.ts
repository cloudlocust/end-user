import { CLIENT_ICON_FOLDER } from 'src/configs'
import colorThemes from 'src/common/ui-kit/fuse/configs/colorThemes'

/**
 *  Represent theme.palette.primary.main string used in sx MUI components props (thanks to MUI System).
 */
export const primaryMainColor = 'primary.main'

/**
 *  Represent theme.palette.secondary.main string used in sx MUI components props (thanks to MUI System).
 */
export const secondaryMainColor = 'secondary.main'

/**
 *  Represent theme.palette.primary.contrastText string used in sx MUI components props (thanks to MUI System).
 */
export const primaryContrastTextColor = 'primary.contrastText'

/**
 *  Represent warning hard coded color.
 */
export const warningMainHashColor = '#F5A61D'

/**
 *  Represent error hard coded color.
 */
export const errorMainHashColor = '#FF6600'

/**
 * Color of all links if indicated.
 */
export const linksColor = colorThemes[CLIENT_ICON_FOLDER].extendedColors?.links
