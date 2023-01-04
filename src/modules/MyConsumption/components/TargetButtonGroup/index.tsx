import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { useState } from 'react'
import { useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import { buttonOptions, targetOptions } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { ITargetButtonGroup } from 'src/modules/MyConsumption/myConsumptionTypes'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics'
import { tempPmaxFeatureState } from 'src/modules/MyHouse/MyHouseConfig'

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

    useEffect(() => {
        if (hidePmax && activeButton === 'Pmax') setActiveButton('reset')
    }, [hidePmax, activeButton])

    return (
        <ButtonGroup variant="contained">
            {buttonOptions.map((option) => {
                const disabledField = hidePmax && option.value === 'Pmax'
                const disabledFeature =
                    tempPmaxFeatureState && (option.value === 'Pmax' || option.value === 'temperature')
                const activeField = activeButton === option.value
                const activeBackgroundColor = activeField ? theme.palette.secondary.main : theme.palette.primary.main
                const activeColor = activeField
                    ? theme.palette.secondary.contrastText
                    : theme.palette.primary.contrastText
                return (
                    <Button
                        value={option.value}
                        onClick={() => {
                            setActiveButton(option.value)
                            handleTarget(option.targets)
                        }}
                        style={{
                            backgroundColor:
                                disabledField || disabledFeature ? theme.palette.grey[600] : activeBackgroundColor,
                            color: disabledField ? theme.palette.text.disabled : activeColor,
                            fontWeight: '500',
                        }}
                        disabled={disabledFeature || disabledField}
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
