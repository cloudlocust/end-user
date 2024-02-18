import { Card, CardContent, IconButton, Typography } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ConsumptionLabelCardProps } from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard/ConsumptionLabelCard.types'

/**
 * Consumption Label Card Element.
 *
 * @param props N/A.
 * @param props.equipmentName The label equipment name.
 * @param props.day  The day of the label.
 * @param props.startTime The start time of the label time range.
 * @param props.endTime The end time of the label time range.
 * @param props.consumption Total consumption in the label time range (in Wh).
 * @param props.consumptionPrice Price of the total consumption.
 * @param props.useType The type of use for the equipment.
 * @returns JSX Element.
 */
const ConsumptionLabelCard = ({
    equipmentName,
    day,
    startTime,
    endTime,
    consumption,
    consumptionPrice,
    useType,
}: ConsumptionLabelCardProps) => {
    const { value: consumptionValue, unit: consumptionUnit } = consumptionWattUnitConversion(consumption)

    return (
        <div>
            <Card className="rounded-16 border border-slate-600">
                <CardContent className="flex h-full w-full flex-col justify-between gap-8">
                    <div className="flex items-center gap-8 mb-8">
                        <div className="flex-1">
                            <Typography className="text-18 sm:text-20 text-grey-900 font-500">
                                {equipmentName}
                            </Typography>
                            <div className="text-13 text-grey-500">
                                <TypographyFormatMessage className="inline">Le</TypographyFormatMessage>{' '}
                                <span className="italic font-600">{day}</span>{' '}
                                <TypographyFormatMessage className="inline">de</TypographyFormatMessage>&nbsp;
                                <span className="italic font-600">{startTime}</span>&nbsp;
                                <TypographyFormatMessage className="inline">à</TypographyFormatMessage>&nbsp;
                                <span className="italic font-600">{endTime}</span>
                            </div>
                        </div>
                        <IconButton aria-label="delete">
                            <DeleteOutlinedIcon color="error" />
                        </IconButton>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-baseline gap-5 font-600 text-grey-800">
                            <div>
                                <span className="text-20">{consumptionValue}</span>
                                <span className="text-12 ml-2">{consumptionUnit}</span>
                            </div>
                            <div>
                                <span className="text-20">{Number(consumptionPrice.toFixed(2)).toString()}</span>
                                <span className="text-12 ml-2">€</span>
                            </div>
                        </div>
                        {useType && (
                            <div
                                className="flex-1 border-l-1 border-grey-400 pl-10 ml-10 flex items-center"
                                aria-label="useType"
                            >
                                <Typography className="text-14 text-grey-800">{useType}</Typography>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ConsumptionLabelCard
