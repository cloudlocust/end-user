import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import { CustomRadioButtonProps } from 'src/modules/shared/CustomRadioButton/CustomRadioButton.d'

/**
 * Custom radio button component.
 *
 * @param root0 N/A.
 * @param root0.value The value associated with the radio button.
 * @param root0.label The descriptive text associated with the radio button.
 * @param root0.selectedValue The state that holds the value of the radio group.
 * @param root0.handleRadioBtnClick The radio button click handler function that update the selectedValue.
 * @returns Enedis Sge consent JSX.
 */
export const CustomRadioButton = ({
    value,
    label,
    selectedValue,
    handleRadioBtnClick,
}: CustomRadioButtonProps): JSX.Element => {
    const isSelected = value === selectedValue

    /**
     * Click handler for the Button.
     */
    const handleClick = () => {
        if (handleRadioBtnClick) handleRadioBtnClick(value)
    }

    return (
        <Button
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={handleClick}
            sx={{ borderWidth: '1.5px', borderRadius: '10px', '& label': { margin: 0 } }}
        >
            <FormControlLabel
                label={label}
                control={
                    <Radio
                        checked={isSelected}
                        size="small"
                        color="secondary"
                        sx={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            height: '18px',
                            width: '18px',
                            color: 'inherit',
                            transform: 'scale(0.8)',
                        }}
                    />
                }
                sx={{ padding: '7px 10px' }}
            />
        </Button>
    )
}
