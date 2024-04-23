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
 * @param root0.initialValue The radio group initial value.
 * @param root0.boxProps Props of the MUI Box component.
 * @param root0.boxClassName The class name of the MUI Box component.
 * @returns CustomRadioGroup component.
 */
export const CustomRadioGroup = ({
    elements,
    onValueChange,
    initialValue,
    boxProps,
    boxClassName,
}: CustomRadioGroupProps): JSX.Element => {
    const [selectedValue, setSelectedValue] = useState(initialValue ?? '')

    /**
     * Click handler for the radio button.
     *
     * @param value The value of the radio button clicked.
     */
    const handleRadioBtnClick = (value: string) => {
        setSelectedValue(value)
        if (onValueChange) {
            onValueChange(value)
        }
    }

    return (
        <Box {...boxProps} className={boxClassName}>
            {elements?.map((element) => (
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
