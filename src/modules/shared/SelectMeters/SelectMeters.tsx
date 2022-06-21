import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'src/common/react-platform-translation'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { IMeter } from 'src/modules/Meters/Meters'
import { styled } from '@mui/material/styles'
import { ISelectMeters } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Select Input that displays all the meters.
 *
 * @param root0 N/A.
 * @param root0.metersList List of meters.
 * @param root0.handleOnChange Handling function when we change values.
 * @param root0.inputColor Color for input: borders and svg.
 * @param root0.inputTextColor Text color.
 * @returns SelectMeters component.
 */
export const SelectMeters = ({ metersList, handleOnChange, inputColor, inputTextColor }: ISelectMeters) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const [selectedMeter, setSelectedMeter] = useState('allMeters')
    /**
     * Set color for select.
     *
     * @param color Color to set.
     * @returns Select input color.
     */
    const setColor = (color?: string) => {
        return color || theme.palette.primary.main
    }

    const Root = styled('div')(() => ({
        '& .MuiOutlinedInput-root': {
            '& svg': {
                color: setColor(inputColor),
            },
            '& fieldset': {
                borderColor: setColor(inputColor),
                '& legend': {
                    fontSize: '1.35rem',
                },
            },
        },
        '& .MuiOutlinedInput-root:hover': {
            '& fieldset': {
                borderColor: setColor(inputColor),
                borderWidth: '2px',
            },
        },
        '& .Mui-focused': {
            '& fieldset': {
                borderColor: ` ${setColor(inputColor)} !important`,
            },
        },
    }))
    return (
        <Root>
            <div style={{ minWidth: '220px' }} className="container flex flex-row items-center">
                <FormControl fullWidth className="rounded-md">
                    <InputLabel
                        shrink
                        id="input-label"
                        style={{
                            color: setColor(inputTextColor),
                        }}
                        className="rounded-md text-lg leading-6"
                    >
                        {formatMessage({ id: 'Compteur', defaultMessage: 'Compteur' })}
                    </InputLabel>
                    <Select
                        labelId="input-label"
                        label="Compteur"
                        value={selectedMeter}
                        onChange={(event) => handleOnChange(event, setSelectedMeter)}
                        displayEmpty
                        style={{
                            color: setColor(inputTextColor),
                            stroke: setColor(inputColor),
                        }}
                    >
                        <MenuItem value="allMeters">
                            {formatMessage({ id: 'Tous les compteurs', defaultMessage: 'Tous les compteurs' })}
                        </MenuItem>
                        {metersList.map((meter: IMeter) => {
                            return <MenuItem value={meter.guid}>{meter.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </div>
        </Root>
    )
}
