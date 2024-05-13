import { Button, capitalize } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material'
import clsx from 'clsx'
import {
    SwitchConsumptionButtonLabelEnum,
    SwitchConsumptionButtonProps,
    SwitchConsumptionButtonTypeEnum,
    SwitchConsumpytionButtonType,
} from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'

const switchButtons: SwitchConsumpytionButtonType = [
    {
        type: SwitchConsumptionButtonTypeEnum.Consumption,
        label: SwitchConsumptionButtonLabelEnum.General,
    },
    {
        type: SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
        label: SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction,
    },
    {
        type: SwitchConsumptionButtonTypeEnum.Idle,
        label: SwitchConsumptionButtonLabelEnum.Idle,
    },
]

const Container = styled('div')(({ theme }) => ({
    overflowX: 'scroll',
    width: '100%',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    padding: '24px 16px 4px 16px',
    alignItems: 'flex-start',
    gap: 8,
    display: 'inline-flex',
    alignSelf: 'stretch',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        paddingTop: '4px',
    },
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-start',
        paddingLeft: 0,
        paddingRight: 0,
    },
    '& .MuiButton-root': {
        [theme.breakpoints.down('md')]: {
            height: 24,
            fontSize: 12,
            minWidth: 160,
        },
        height: 30,
        minWidth: 200,
        display: 'flex',
        padding: '8px 16px',
        borderRadius: 90,
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        color: theme.palette.primary.main,
        fontWeight: 400,
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        lineHeight: 'normal',
        '&.selected': {
            boxShadow: `0px 2px 4px 0px ${alpha(theme.palette.primary.dark, 0.2)}, 0px 1px 10px 0px ${alpha(
                theme.palette.primary.dark,
                0.12,
            )}, 0px 4px 5px 0px ${alpha(theme.palette.primary.dark, 0.14)}`,
            color: theme.palette.primary.contrastText,
            cursor: 'default',
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.75),
            },
        },
    },
}))

/**
 * Component for idle consumption switch button.
 *
 * @param props N/A.
 * @param props.isIdleShown Boolean indicate if the veille element is shown.
 * @param props.isAutoConsumptionProductionShown Boolean indicate if the autoconsumption-prod element is shown.
 * @returns Switch Consumption button.
 */
export const SwitchConsumptionButton = ({
    isIdleShown,
    isAutoConsumptionProductionShown,
}: SwitchConsumptionButtonProps): JSX.Element => {
    const { consumptionToggleButton, setConsumptionToggleButton } = useMyConsumptionStore()
    const theme = useTheme()

    /**
     * Function handling switch of idleConsumptionButton.
     *
     * @param value SwitchConsumptionButtonProps.
     */
    const onChange = (value: SwitchConsumptionButtonTypeEnum) => {
        if (consumptionToggleButton !== value) {
            setConsumptionToggleButton(value)
        }
    }

    return (
        <Container>
            {switchButtons.map((element, index) => {
                const isIdleElementDisabled = !isIdleShown && element.type === SwitchConsumptionButtonTypeEnum.Idle
                const isProductionElementDisabled =
                    !isAutoConsumptionProductionShown &&
                    element.type === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
                const isElementExcluded = isIdleElementDisabled || isProductionElementDisabled
                if (isElementExcluded) return null
                const isSelected = consumptionToggleButton === element.type
                return (
                    <div key={index}>
                        <Button
                            variant={isSelected ? 'contained' : 'outlined'}
                            disableElevation={true}
                            disableRipple={true}
                            onClick={() => onChange(element.type)}
                            className={clsx({ selected: isSelected })}
                            sx={{
                                backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.75) : 'initial',
                            }}
                        >
                            {capitalize(element.label)}
                        </Button>
                    </div>
                )
            })}
        </Container>
    )
}
