import { styled } from '@mui/material/styles'
import { TextField as DefaultTextField } from 'src/common/ui-kit'

/**
 * TextField component is a wrapper & customize around the default TextField component from MUI.
 */
export const TextField = styled(DefaultTextField)(({ theme }) => ({
    '& .MuiInputBase-formControl': {
        borderRadius: 12,
        '& .MuiInputBase-input': {
            borderRadius: 12,
            position: 'relative',
            backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
            fontSize: 16,
            width: 'auto',
            padding: '10px 12px',
        },
    },
}))
