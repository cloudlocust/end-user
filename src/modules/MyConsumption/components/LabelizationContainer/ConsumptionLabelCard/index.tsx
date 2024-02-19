import { Card, CardContent, IconButton, Typography } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useTheme } from '@mui/material/styles'
import { useConfirm } from 'material-ui-confirm'
import { useIntl } from 'src/common/react-platform-translation'
import { ConsumptionLabelCardProps } from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard/ConsumptionLabelCard.types'

/**
 * Consumption Label Card Element.
 *
 * @param props N/A.
 * @param props.labelData Label card data.
 * @param props.deleteLabel Function to delete the label.
 * @returns JSX Element.
 */
const ConsumptionLabelCard = ({ labelData, deleteLabel }: ConsumptionLabelCardProps) => {
    const { labelId, equipmentName, day, startTime, endTime, consumption, consumptionPrice, useType } = labelData
    const { value: consumptionValue, unit: consumptionUnit } = consumptionWattUnitConversion(consumption)
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const openMuiDialog = useConfirm()

    /**
     * Function for deleting the label.
     */
    const handleDeleteLabel = async () => {
        await openMuiDialog({
            title: '',
            dialogProps: {
                PaperProps: {
                    style: {
                        background: theme.palette.error.main,
                    },
                },
            },
            description: (
                <TypographyFormatMessage className="text-16 md:text-20 text-center text-white">
                    Vous êtes sur le point de supprimer le label. Êtes-vous sûr de vouloir continuer ?
                </TypographyFormatMessage>
            ),
            confirmationText: formatMessage({
                id: 'Continuer',
                defaultMessage: 'Continuer',
            }),
            confirmationButtonProps: {
                className: 'text-13 md:text-16 font-medium text-white',
            },
            cancellationText: formatMessage({
                id: 'Annuler',
                defaultMessage: 'Annuler',
            }),
            cancellationButtonProps: {
                className: 'text-13 md:text-16 font-medium text-white',
            },
        })
        await deleteLabel(labelId)
    }

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
                        <IconButton aria-label="delete" onClick={handleDeleteLabel}>
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
