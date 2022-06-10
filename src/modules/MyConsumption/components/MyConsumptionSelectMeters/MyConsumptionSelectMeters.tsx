import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useIntl } from 'src/common/react-platform-translation'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { IMeter } from 'src/modules/Meters/Meters'
import { styled } from '@mui/material/styles'
import { formatMetricFilter, formatMetricFilterList } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
/**
 * Select Input that displays all the meters.
 *
 * @param root0 N/A.
 * @param root0.metersList List of meters.
 * @param root0.setFilters SetFilters function.
 * @returns MyConsumptionSelectMeters component.
 */
export const MyConsumptionSelectMeters = ({ metersList, setFilters }: IMyConsumptionSelectMeters) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const [selectedMeter, setSelectedMeter] = useState('allMeters')
    /**
     * HandleOnChange function.
     *
     * @param event HandleOnChange event.
     */
    const handleOnChange = (event: SelectChangeEvent) => {
        setSelectedMeter(event.target.value)
        if (!event.target.value) {
            setFilters(formatMetricFilterList(metersList))
        } else {
            setFilters(formatMetricFilter(event.target.value))
        }
    }

    const Root = styled('div')(({ theme }) => ({
        '& .MuiOutlinedInput-root': {
            '& svg': {
                color: theme.palette.primary.light,
            },
            '& fieldset': {
                borderColor: theme.palette.primary.light,
                '& legend': {
                    fontSize: '1.35rem',
                },
            },
        },
        '& .MuiOutlinedInput-root:hover': {
            '& fieldset': {
                borderColor: theme.palette.primary.main,
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
                            color: theme.palette.primary.light,
                        }}
                        className="rounded-md text-lg leading-6"
                    >
                        {formatMessage({ id: 'Compteur', defaultMessage: 'Compteur' })}
                    </InputLabel>
                    <Select
                        labelId="input-label"
                        label="Compteur"
                        value={selectedMeter}
                        onChange={handleOnChange}
                        displayEmpty
                        style={{
                            color: theme.palette.primary.light,
                            stroke: theme.palette.primary.light,
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
