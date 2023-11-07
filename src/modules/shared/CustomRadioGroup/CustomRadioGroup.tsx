import { useState } from 'react'
import Box from '@mui/material/Box'
import { CustomRadioGroupProps } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup.d'
import { CustomRadioButton } from 'src/modules/shared/CustomRadioButton/CustomRadioButton'

/**.
 * Custom radio group component.
 *
 * @param root0 N/A.
 * @param root0.elements The parameters of the CustomRadioButton children components.
 * @param root0.onValueChange Function triggered when the radio group value change.
 * @param root0.boxProps Props of the MUI Box component.
 * @returns CustomRadioGroup component.
 */
export const CustomRadioGroup = ({ elements, onValueChange, ...boxProps }: CustomRadioGroupProps): JSX.Element => {
    const [selectedValue, setSelectedValue] = useState('')

    /**
     * Click handler for the radio button.
     *
     * @param v The value of the radio button clicked.
     */
    const handleRadioBtnClick = (v: string) => {
        setSelectedValue(v)
        if (onValueChange) {
            onValueChange(v)
        }
    }

    return (
        <Box {...boxProps}>
            {elements.map((element) => (
                <CustomRadioButton
                    key={element.label}
                    value={element.value}
                    label={element.label}
                    selectedValue={selectedValue}
                    handleRadioBtnClick={handleRadioBtnClick}
                />
            ))}
        </Box>
    )
}
