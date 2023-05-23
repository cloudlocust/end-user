import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useTheme } from '@mui/material'
import { targetOptions } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { ITargetMenuGroup } from 'src/modules/MyConsumption/myConsumptionTypes'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { tempPmaxFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { SyntheticEvent } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { SvgIcon } from '@mui/material/'
import { ReactComponent as PmaxIcon } from 'src/assets/images/pmax.svg'
import { DoNotDisturbAlt as NoneIcon, Thermostat as TemperatureIcon, Check } from '@mui/icons-material/'

/**
 *  Button options.
 */
export const buttonOptions = [
    {
        value: 'reset',
        label: 'Aucun',
        targets: [],
        icon: <NoneIcon />,
    },
    {
        value: 'temperature',
        label: 'Températures',
        targets: [metricTargetsEnum.externalTemperature, metricTargetsEnum.internalTemperature],
        icon: <TemperatureIcon />,
    },
    {
        value: 'Pmax',
        label: 'Pmax',
        targets: [metricTargetsEnum.pMax],
        icon: (
            <SvgIcon fontSize="small">
                <PmaxIcon fontSize="0.2rem" />
            </SvgIcon>
        ),
    },
]

/**
 * TargetButtonGroup component.
 *
 * @param root0 N/A.
 * @param root0.removeTarget RemoveTarget.
 * @param root0.addTarget AddTarget.
 * @param root0.hidePmax If hidePmax exists Pmax button will be disabled.
 * @returns TargetButtonGroup.
 */
const TargetMenuGroup = ({ removeTarget, addTarget, hidePmax }: ITargetMenuGroup) => {
    const [activeButton, setActiveButton] = useState('reset')
    const [anchorEl, setAnchorEl] = useState<null | Element>(null)
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

    /**
     * Function called on click.
     *
     * @param event SyntheticEvent.
     */
    const handleClick = (event: SyntheticEvent<Element, Event>) => {
        setAnchorEl(event.currentTarget)
    }

    /**
     * Function that closes menu.
     */
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div className="flex items-center justify-center">
            <Button
                aria-controls="target-menu"
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
                onClick={handleClick}
                endIcon={<MoreVertIcon />}
                className="mx-auto my-0 min-h-auto"
                style={{ color: theme.palette.common.white }}
                aria-label="target-menu"
            />
            {Boolean(anchorEl) && (
                <Menu
                    id="target-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'target-button',
                        sx: { py: 0 },
                    }}
                >
                    <MenuItem className="pointer-events-none cursor-not-allowed border-b-1 border-solid border-grey-400">
                        <TypographyFormatMessage>Ajouter un axe sur le graphique :</TypographyFormatMessage>
                    </MenuItem>
                    {buttonOptions.map((option) => {
                        const disabledPmax = hidePmax && option.value === 'Pmax'
                        const disabledTemperature =
                            tempPmaxFeatureState && (option.value === 'temperature' || option.value === 'Pmax')
                        const disabledField = disabledPmax || disabledTemperature
                        const activeField = activeButton === option.value
                        const activeBackgroundColor = activeField
                            ? theme.palette.primary.light
                            : theme.palette.common.white
                        const activeColor = activeField
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText

                        return (
                            <Tooltip
                                arrow
                                placement="top"
                                disableHoverListener={!disabledField}
                                title={
                                    <TypographyFormatMessage>
                                        {disabledPmax
                                            ? "Cette fonctionnalité n'est pas disponible sur cette période"
                                            : "Cette fonctionnalité n'est pas encore disponible"}
                                    </TypographyFormatMessage>
                                }
                            >
                                <MenuItem
                                    key={option.value}
                                    onClick={() => {
                                        if (disabledField) return
                                        setActiveButton(option.value)
                                        handleTarget(option.targets)
                                        handleClose()
                                    }}
                                    disabled={disabledField}
                                    style={{
                                        backgroundColor: disabledField
                                            ? theme.palette.grey[600]
                                            : activeBackgroundColor,
                                        color: disabledField ? theme.palette.text.disabled : activeColor,
                                        fontWeight: '500',
                                        cursor: disabledField ? 'default' : 'pointer',
                                    }}
                                >
                                    <ListItemIcon>{option.icon}</ListItemIcon>
                                    <TypographyFormatMessage>{option.label}</TypographyFormatMessage>
                                    {activeField && (
                                        <ListItemIcon className="ml-auto">
                                            <Check />
                                        </ListItemIcon>
                                    )}
                                </MenuItem>
                            </Tooltip>
                        )
                    })}
                </Menu>
            )}
        </div>
    )
}

export default TargetMenuGroup
