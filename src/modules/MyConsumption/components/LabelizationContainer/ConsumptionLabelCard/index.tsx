import { Card, CardContent, IconButton, Typography } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { ConsumptionLabelDataType } from 'src/modules/MyConsumption/components/LabelizationContainer/labelizaitonTypes.d'

/**
 * Consumption Label Card Element.
 *
 * @param props N/A.
 * @param props.labelData Label Data containing the data to show.
 * @returns JSX Element.
 */
const ConsumptionLabelCard = ({
    labelData,
}: /**
 */
{
    /**
     * Label Data.
     */
    labelData: ConsumptionLabelDataType
}) => {
    const startTime = labelData.startTime.split('T')[1].split('.')[0]
    const endTime = labelData.endTime.split('T')[1].split('.')[0]
    return (
        <div className="h-1/2 sm:w-208 md:w-320">
            <Card className="rounded-16 border border-slate-600 m-8">
                <CardContent className="flex h-full w-full flex-col justify-between">
                    <div className="flex flex-row justify-between items-center mx-10">
                        <Typography className="text-16 md:text-17 font-medium">{labelData.name}</Typography>
                        <IconButton className="ml-4" aria-label="delete">
                            <DeleteOutlinedIcon color="error" />
                        </IconButton>
                    </div>
                    <div className="flex flex-row flex-start mx-5">
                        <Typography className="text-13">{`${startTime.split(':')[0]}:${
                            startTime.split(':')[1]
                        }`}</Typography>
                        <Typography className="text-13 ml-16">{`${endTime.split(':')[0]}:${
                            endTime.split(':')[1]
                        }`}</Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ConsumptionLabelCard
