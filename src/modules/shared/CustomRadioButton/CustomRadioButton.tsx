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
 * @param root0.selectedValue A state holds the value of the currently selected radio button among the group of radio buttons.
 * @param root0.setSelectedValue The setter associated to the selected radio button state (selectedValue).
 * @returns Enedis Sge consent JSX.
 */
const CustomRadioButton = ({ value, label, selectedValue, setSelectedValue }: CustomRadioButtonProps): JSX.Element => {
    const theme = useTheme()
    const isSelected = value === selectedValue

    /**
     * A click handler function for the custom radio button.
     */
    const handleClick = () => {
        if (setSelectedValue) setSelectedValue(value)
    }

    return (
        <Button
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={handleClick}
            sx={{ borderRadius: '10px', '& label': { margin: 0 } }}
        >
            <FormControlLabel
                label={label}
                control={
                    <Radio
                        checked={isSelected}
                        onChange={handleClick}
                        size="small"
                        color="secondary"
                        sx={{
                            position: 'absolute',
                            top: '1px',
                            right: '1px',
                            height: '18px',
                            width: '18px',
                            color: theme.palette.primary.main,
                        }}
                    />
                }
                sx={{ padding: '7px 10px' }}
            />
        </Button>
    )
}

export default CustomRadioButton
