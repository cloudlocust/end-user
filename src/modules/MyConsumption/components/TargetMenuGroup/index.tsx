import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useTheme } from '@mui/material'
import { ITargetMenuGroup } from 'src/modules/MyConsumption/myConsumptionTypes'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { isTempPmaxFeatureDisabled } from 'src/modules/MyHouse/MyHouseConfig'
import { Menu, MenuItem, ListItemIcon } from '@mui/material'
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
 * @param root0.removeTargets RemoveTarget.
 * @param root0.addTargets AddTarget.
 * @param root0.hidePmax If hidePmax exists Pmax button will be disabled.
 * @param root0.activeButton Indicate which button is active.
 * @returns TargetButtonGroup.
 */
const TargetMenuGroup = ({ removeTargets, addTargets, hidePmax, activeButton }: ITargetMenuGroup) => {
    const [anchorEl, setAnchorEl] = useState<null | Element>(null)
    const theme = useTheme()

    /**
     * Function to handle Target.
     *
     * @param targets Target value to handle.
     */
    const handleTarget = (targets: metricTargetsEnum[]) => {
        if (targets.includes(metricTargetsEnum.internalTemperature)) {
            addTargets([metricTargetsEnum.internalTemperature, metricTargetsEnum.externalTemperature])
        } else if (targets.includes(metricTargetsEnum.pMax)) {
            addTargets([metricTargetsEnum.pMax])
        } else {
            removeTargets()
        }
    }

    useEffect(() => {
        if (hidePmax && activeButton === 'Pmax') removeTargets()
    }, [hidePmax, activeButton, removeTargets])

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
                // endIcon={}
                className="mx-auto my-0 min-h-auto"
                style={{ color: theme.palette.common.white }}
                aria-label="target-menu"
            >
                <MoreVertIcon />
            </Button>
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
                        const isPmaxOptionExcluded = (isTempPmaxFeatureDisabled || hidePmax) && option.value === 'Pmax'
                        const isTemperatureOptionExcluded = isTempPmaxFeatureDisabled && option.value === 'temperature'

                        if (isPmaxOptionExcluded || isTemperatureOptionExcluded) return null

                        const activeField = activeButton === option.value
                        const BackgroundColor = activeField ? theme.palette.primary.light : theme.palette.common.white
                        const Color = activeField
                            ? theme.palette.primary.contrastText
                            : theme.palette.secondary.contrastText

                        return (
                            <MenuItem
                                key={option.value}
                                onClick={() => {
                                    handleTarget(option.targets)
                                    handleClose()
                                }}
                                style={{
                                    backgroundColor: BackgroundColor,
                                    color: Color,
                                    fontWeight: '500',
                                    cursor: 'pointer',
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
                        )
                    })}
                </Menu>
            )}
        </div>
    )
}

export default TargetMenuGroup
