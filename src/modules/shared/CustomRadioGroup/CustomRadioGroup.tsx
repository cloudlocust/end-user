import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import {
    CustomRadioGroupProps,
    CustomRadioButtonAdditionalProps,
} from 'src/modules/shared/CustomRadioGroup/CustomRadioGroup.d'

/**.
 * Custom radio group component.
 *
 * @param root0 N/A.
 * @param root0.defaultValue The default value for the radio group.
 * @param root0.onValueChange Function triggered when the radio group value change.
 * @param root0.children The children components (CustomRadioButton) of the CustomRadioGroup component.
 * @returns CustomRadioGroup component.
 */
const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
    children,
    defaultValue,
    onValueChange,
    ...rest
}: CustomRadioGroupProps): JSX.Element => {
    const [selectedValue, setSelectedValue] = useState(defaultValue || '')

    useEffect(() => {
        if (onValueChange) {
            onValueChange(selectedValue)
        }
    }, [onValueChange, selectedValue])

    return (
        <Box {...rest}>
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? /**
                       * Add the state of the radio group to the props of the CustomRadioButton child.
                       */
                      React.cloneElement(child, {
                          selectedValue,
                          setSelectedValue,
                      } as CustomRadioButtonAdditionalProps)
                    : child,
            )}
        </Box>
    )
}

export default CustomRadioGroup
