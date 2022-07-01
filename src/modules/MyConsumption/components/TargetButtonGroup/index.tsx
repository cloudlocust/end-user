import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { useState } from 'react'
import { useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import { buttonOptions, targetOptions } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { ITargetButtonGroup } from 'src/modules/MyConsumption/myConsumptionTypes'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics'

/**
 * TargetButtonGroup component.
 *
 * @param root0 N/A.
 * @param root0.removeTarget RemoveTarget.
 * @param root0.addTarget AddTarget.
 * @param root0.hidePmax If hidePmax exists Pmax button will be disabled.
 * @returns TargetButtonGroup.
 */
const TargetButtonGroup = ({ removeTarget, addTarget, hidePmax }: ITargetButtonGroup) => {
    const [activeButton, setActiveButton] = useState('reset')
    const { formatMessage } = useIntl()
    const theme = useTheme()
    /**
     * Function to handle Target.
     *
     * @param targets Target value to handle.
     */
    const handleTarget = (targets: metricTargetsEnum[]) => {
        targetOptions.forEach((target) => {
            targets.includes(target) ? addTarget(target) : removeTarget(target)
        })
    }
    return (
        <ButtonGroup variant="contained">
            {buttonOptions.map((option) => {
                const disabledField = hidePmax && option.value === 'Pmax'
                const activeField = activeButton === option.value
                const activeBackgroundColor = activeField ? theme.palette.primary.light : theme.palette.primary.dark
                const activeColor = activeField ? theme.palette.primary.dark : theme.palette.primary.contrastText
                return (
                    <Button
                        value={option.value}
                        onClick={() => {
                            setActiveButton(option.value)
                            handleTarget(option.targets)
                        }}
                        style={{
                            backgroundColor: disabledField ? theme.palette.grey[600] : activeBackgroundColor,
                            color: disabledField ? theme.palette.text.disabled : activeColor,
                            fontWeight: option.value === 'reset' ? '600' : '500',
                        }}
                        disabled={disabledField}
                    >
                        {formatMessage({
                            id: option.label,
                            defaultMessage: option.label,
                        })}
                    </Button>
                )
            })}
        </ButtonGroup>
    )
}

export default TargetButtonGroup
