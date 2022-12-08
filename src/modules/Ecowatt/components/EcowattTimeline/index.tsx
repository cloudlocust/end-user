import { EcowattConsumptionValue, IHourlyValues } from 'src/modules/Ecowatt/ecowatt.d'
import { useTheme } from '@mui/material'
import { isUndefined } from 'lodash'
import 'src/modules/Ecowatt/components/EcowattTimeline/ecowattTimeline.scss'

/**
 * Function that return every 4 values number.
 *
 * @param pas Pas d'heure. Represents every hour of the day.
 * @returns Every 4 values number.
 */
function filterHourlyPas(pas: IHourlyValues['readingAt']) {
    let pasPlusOne = pas + 1
    if (pasPlusOne % 4 === 0) {
        return pasPlusOne
    } else {
        return
    }
}

/**
 * EcowattTimeline component.
 *
 * @param param0 N/A.
 * @param param0.hourlyValues Hourly values of the day.
 * @param param0.showHourReadingAt Boolean state to show or not readingAt values below timeline.
 * @returns EcowattTimeline JSX.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const EcowattTimeline = ({
    hourlyValues,
    showHourReadingAt,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    hourlyValues?: IHourlyValues[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    showHourReadingAt?: boolean
}) => {
    const theme = useTheme()

    /**
     * Function that gets background color according to hourly value of the hourly value.
     *
     * @param hourlyValues Hourly value.
     * @returns Color according to the value.
     */
    function getBackgroundColor(hourlyValues: IHourlyValues['reading']) {
        switch (hourlyValues) {
            case EcowattConsumptionValue.OK:
                return theme.palette.success.main
            case EcowattConsumptionValue.SEVERE:
                return theme.palette.warning.main
            case EcowattConsumptionValue.CRITICAL:
                return theme.palette.error.main
            default:
                throw new Error('No hourly value')
        }
    }

    return (
        <div className="px-8 py-6 flex w-full flex-col" data-testid="timeline">
            <div className="flex flex-row w-full justify-center items-center">
                {hourlyValues?.map((hour) => (
                    <div
                        key={hour.readingAt}
                        style={{ backgroundColor: getBackgroundColor(hour.reading) }}
                        className="flex-1 hour h-20"
                    ></div>
                ))}
            </div>
            {showHourReadingAt && (
                <div className="flex flex-row w-full justify-center items-center">
                    {hourlyValues?.map((hour) => (
                        <div className="flex-1 h-20" key={hour.readingAt}>
                            {isUndefined(filterHourlyPas(hour.readingAt)) ? '' : `${filterHourlyPas(hour.readingAt)}h`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
