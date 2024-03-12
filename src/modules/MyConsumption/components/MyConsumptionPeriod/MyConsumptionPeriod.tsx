import { useTheme, alpha } from '@mui/material'
import {
    dataConsumptionPeriod,
    dataConsumptionPeriodValueList,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { IMyConsumptionPeriod, PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'

/**
 * MyConsumptionPeriod Component.
 *
 * @param param0 N/A.
 * @param param0.setPeriod SetPeriod function.
 * @param param0.setRange SetRange function.
 * @param param0.setMetricsInterval SetMetricsInterval function.
 * @returns  MyConsumptionPeriod.
 */
export const MyConsumptionPeriod = ({ setRange, setPeriod, setMetricsInterval }: IMyConsumptionPeriod) => {
    const theme = useTheme()
    /**
     * Handle select of the period.
     *
     * @param value Period (daily, weekly, monthly, yearly).
     */
    const handleClick = (value: PeriodEnum) => {
        const valueIndex = dataConsumptionPeriodValueList.indexOf(value)
        setRange(getRangeV2(dataConsumptionPeriod[valueIndex].period))
        setMetricsInterval(dataConsumptionPeriod[valueIndex].interval)
        setPeriod(dataConsumptionPeriod[valueIndex].period)
    }

    const activeButtonStyle = {
        color: theme.palette.grey['900'],
        backgroundColor: theme.palette.common.white,
        boxShadow: `0px 2px 4px 0px ${alpha(theme.palette.primary.dark, 0.2)}, 0px 1px 10px 0px ${alpha(
            theme.palette.primary.dark,
            0.12,
        )}, 0px 4px 5px 0px ${alpha(theme.palette.primary.dark, 0.14)}`,
        zIndex: 2,
        cursor: 'default',
        borderRadius: '1px',
        '&:hover': {
            backgroundColor: theme.palette.common.white,
        },
    }

    return (
        <ButtonsSwitcher
            buttonsSwitcherParams={dataConsumptionPeriod.map((item) => ({
                buttonText: item.name,
                /**
                 * Handle click event.
                 *
                 * @returns Void.
                 */
                clickHandler: () => handleClick(item.period),
            }))}
            buttonProps={(isSelected) => ({
                sx: {
                    boxShadow: 'none',
                    padding: '8px 16px',
                    color: theme.palette.grey['500'],
                    fontSize: '12px !important',
                    fontWeight: 400,
                    fontHeight: 'normal',
                    fontStyle: 'normal',
                    fontFamily: 'Poppins',
                    zIndex: 1,
                    height: 24,
                    '&:hover': {
                        backgroundColor: theme.palette.grey[200],
                    },
                    ...(isSelected && activeButtonStyle),
                },
            })}
            containerProps={{
                style: { height: 'inherit', borderRadius: 3 },
            }}
        />
    )
}
