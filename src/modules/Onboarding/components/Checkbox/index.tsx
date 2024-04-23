import { styled } from '@mui/material/styles'
import { Checkbox as NativeCheckbox, CheckboxProps } from 'src/common/ui-kit'

/**
 * The icon when the checkbox is unchecked.
 */
const Icon = styled('span')(({ theme }) => ({
    borderRadius: 3,
    width: 24,
    height: 24,
    backgroundColor: '#f5f8fa',
    '.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
    },
    'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
        boxShadow: 'none',
        background: theme.palette.grey[400],
    },
}))
/**
 * The checked icon when the checkbox is checked.
 */
const CheckedIcon = styled(Icon)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
        display: 'block',
        width: 24,
        height: 24,
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: theme.palette.primary.main,
    },
    'input:disabled ~ &': {
        backgroundColor: theme.palette.grey[400],
    },
}))

/**
 * Represents a styled checkbox component.
 *
 * @param {CheckboxProps} props - The props for the checkbox.
 * @returns  The checkbox component.
 */
export const Checkbox = (props: CheckboxProps) => {
    return <NativeCheckbox checkedIcon={<CheckedIcon />} icon={<Icon />} {...props} />
}
