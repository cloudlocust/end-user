import { makeStyles } from '@mui/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import { CustomRadioButtonProps } from 'src/modules/shared/CustomRadioButton/CustomRadioButton.d'

/**
 * Custom radio button component.
 *
 * @param root0 N/A.
 * @param root0.value The value associated with the radio button.
 * @param root0.label The descriptive text associated with the radio button.
 * @param root0.selectedValue A state holds the value of the currently selected radio button among athegroup of radio buttons.
 * @param root0.setSelectedValue The setter associated to the selected radio button state (selectedValue).
 * @returns Enedis Sge consent JSX.
 */
const CustomRadioButton = ({ value, label, selectedValue, setSelectedValue }: CustomRadioButtonProps): JSX.Element => {
    const theme = useTheme()

    const useStyles = makeStyles({
        radio: {
            position: 'absolute',
            top: '0px',
            right: '0px',
            height: '14px',
            width: '14px',
            overflow: 'hidden',
            color: theme.palette.primary.main,
            '&.Mui-checked': {
                color: theme.palette.secondary.main,
            },
            '& > *': {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            },
            '& .MuiSvgIcon-root': {
                width: '12px',
                height: '12px',
            },
        },

        label: {
            padding: '7px 10px',
            margin: 0,
        },

        button: {
            borderRadius: '9px',
        },
    })

    const classes = useStyles()

    const isSelected = value === selectedValue

    /**
     * A click handler function for the custom radio button.
     */
    const handleClick = () => {
        if (setSelectedValue) {
            setSelectedValue(value)
        }
    }

    return (
        <Button variant={isSelected ? 'contained' : 'outlined'} className={classes.button} onClick={handleClick}>
            <FormControlLabel
                label={label}
                control={<Radio className={classes.radio} checked={isSelected} onChange={handleClick} />}
                classes={{ root: classes.label }}
            />
        </Button>
    )
}

export default CustomRadioButton
