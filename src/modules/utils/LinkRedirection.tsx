import React from 'react'
import { useIntl } from 'react-intl'
import MuiLink from '@mui/material/Link'

/**
 * Function getLinkRedirection.
 *
 * @param param0 N/A.
 * @param param0.url Url to redirect.
 * @param param0.label Label name.
 * @param param0.color Color.
 * @returns Link to redirect.
 */
export const LinkRedirection = ({
    url,
    label,
    color,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    url: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    label: string
    // eslint-disable-next-line jsdoc/require-jsdoc
    color?: string
}) => {
    const { formatMessage } = useIntl()
    return (
        // eslint-disable-next-line react/jsx-no-undef
        <MuiLink
            sx={{
                color: color || 'primary.main',
                pointerEvents: 'auto',
            }}
            onClick={(e: React.SyntheticEvent) => {
                // Handling onClick with (preventDefault and window.open) because we're using FormControlLabel, which when you click the label (even if it has link inside) it'll behave as if we clicked on the control
                // In our case the checkbox, it means when if we click on the label even if we have a link in the label and we click on it, it will check the checkbox instead of redirecting
                // That's why i handle the onClick on the link itself, so that i prevent the default of checkbox clicking through the label
                e.preventDefault()
                window.open(url, '_blank')
            }}
        >
            {formatMessage({
                id: label,
                defaultMessage: label,
            })}
        </MuiLink>
    )
}
