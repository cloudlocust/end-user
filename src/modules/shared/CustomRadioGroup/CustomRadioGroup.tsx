import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { CustomRadioGroupProps } from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup.d'
import { CustomRadioButton } from 'src/modules/shared/CustomRadioButton/CustomRadioButton'

/**.
 * Custom radio group component.
 *
 * @param root0 N/A.
 * @param root0.elements The parameters of the CustomRadioButton children components.
 * @param root0.onValueChange Function triggered when the radio group value change.
 * @param root0.value The radio group value.
 * @param root0.boxProps Props of the MUI Box component.
 * @param root0.boxClassName The class name of the MUI Box component.
 * @returns CustomRadioGroup component.
 */
export const CustomRadioGroup = ({
    elements,
    onValueChange,
    value,
    boxProps,
    boxClassName,
}: CustomRadioGroupProps): JSX.Element => {
    const [selectedValue, setSelectedValue] = useState(value ?? '')

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

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value)
        }
    }, [value])

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
