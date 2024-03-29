import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

/**
 * Title component.
 */
export const Title = styled(Typography)(({ theme }) => ({
    fontStyle: 'normal',
    lineHeight: 'normal',
    fontSize: 18,
    [theme.breakpoints.down('md')]: {
        fontSize: 12,
        fontWeight: 400,
    },
}))
