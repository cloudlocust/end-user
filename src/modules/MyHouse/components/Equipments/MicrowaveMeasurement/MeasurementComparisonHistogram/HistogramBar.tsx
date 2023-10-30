import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import {
    HistogramBarProps,
    HistogramBarIconProps,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementComparisonHistogram/MeasurementComparisonHistogram'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'

/**
 * The histogram bar icon component (I only use this component in the HistogramBar component,
 * so I've defined it in the same file).
 *
 * @param root0 N/A.
 * @param root0.icon The icon element to use.
 * @returns The component HistogramBarIcon.
 */
export const HistogramBarIcon = ({ icon }: HistogramBarIconProps) => {
    const theme = useTheme()

    return (
        <div
            className="h-32 w-32 flex justify-center items-center text-white rounded-full border-2 border-white absolute top-0 right-0"
            style={{ backgroundColor: theme.palette.secondary.main, transform: 'translate(40%, -40%)' }}
            data-testid="histogram-bar-icon"
        >
            {icon}
        </div>
    )
}

/**
 * Component HistogramBar.
 *
 * @param root0 N/A.
 * @param root0.isAverageConsumption Boolean indicate if the histogram bar is for the average consumption or not (for the user consumption).
 * @param root0.consumptionValue The value of the consumption.
 * @param root0.otherConsumptionValue The other consumption value (if isAverageConsumption is true it's the user consumption, else it's the average consumption).
 * @returns The component HistogramBar.
 */
export const HistogramBar = ({ isAverageConsumption, consumptionValue, otherConsumptionValue }: HistogramBarProps) => {
    const theme = useTheme()

    return (
        <div className="h-full flex flex-col items-center justify-end flex-1">
            <div
                className="w-1/2 min-h-44 relative border-2"
                style={{
                    /**
                     * The height of the bar is 100 % if consumptionValue >= otherConsumptionValue
                     * else the height is the percentage of the consumptionValue relative to the otherConsumptionValue.
                     */
                    height: `${
                        consumptionValue >= otherConsumptionValue
                            ? 100
                            : (100 * consumptionValue) / otherConsumptionValue
                    }%`,
                    backgroundColor: isAverageConsumption ? 'transparent' : theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                }}
                data-testid="histogram-bar"
            >
                {/* The consumption value */}
                <Typography color={isAverageConsumption ? 'primary' : 'white'} className="text-center mt-20">
                    {consumptionValue} W
                </Typography>

                {/* The histogram bar icon */}
                <HistogramBarIcon
                    icon={isAverageConsumption ? <GroupsOutlinedIcon /> : <PersonOutlineOutlinedIcon />}
                />
            </div>
        </div>
    )
}
