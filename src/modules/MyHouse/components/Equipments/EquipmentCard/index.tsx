import { useModal } from 'src/hooks/useModal'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import {
    Card,
    CardContent,
    Button,
    useTheme,
    Typography,
    Icon,
    Tooltip,
    IconButton,
    CircularProgress,
} from '@mui/material'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseVariables'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { isEquipmentMeasurementFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { FEATURE_COMMING_SOON_TEXT } from 'src/modules/shared'
import DefaultEquipmentIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import SettingsIcon from '@mui/icons-material/Settings'

/**
 * Equipment Card component.
 *
 * @description Equipment Card component that displays individual card for each type of equipment.
 * @param root0 N/A.
 * @param root0.equipment The equipment details object.
 * @param root0.title Equipment title represent the label the user give to its equipment.
 * @param root0.onEquipmentChange Function that handle the equipment number.
 * @param root0.addingEquipmentInProgress Boolean indicating if adding equipment is in progress.
 * @param root0.iconComponent Icon component.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({
    equipment,
    title,
    onEquipmentChange,
    addingEquipmentInProgress,
    iconComponent,
}: EquipmentCardProps) => {
    const theme = useTheme()
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const history = useHistory()

    /**
     * Function for navigating to the equipment details page.
     */
    const navigateToEquipmentMeasurementsPage = useCallback(() => {
        if (currentHousing?.id)
            history.replace(`${URL_MY_HOUSE}/${currentHousing.id}/equipments/measurements`, {
                equipment: {
                    id: equipment.id,
                    housingEquipmentId: equipment.housingEquipmentId,
                    name: equipment.name,
                    equipmentLabel: equipment.equipmentLabel,
                    allowedType: equipment.allowedType,
                    number: equipment.number,
                    isNumber: equipment.isNumber,
                    measurementModes: equipment.measurementModes,
                    customerId: equipment.customerId,
                },
            })
    }, [
        currentHousing?.id,
        equipment.allowedType,
        equipment.customerId,
        equipment.equipmentLabel,
        equipment.housingEquipmentId,
        equipment.id,
        equipment.isNumber,
        equipment.measurementModes,
        equipment.name,
        equipment.number,
        history,
    ])

    const isMicrowaveMeasurementButtonShown = Boolean(
        equipment.number && equipment.number > 0 && equipment.name === 'microwave',
    )

    const equipementId = equipment.equipmentId

    return (
        <>
            <Card className="rounded-16 border border-slate-600 w-full" data-testid="equipment-item">
                <CardContent
                    className="flex self-stretch space-x-14"
                    sx={{ p: '1rem', '&:last-child': { pb: '1rem' } }}
                >
                    <div
                        className="flex justify-center items-center rounded-16 border-2"
                        style={{ borderColor: theme.palette.primary.main, width: '75px', minHeight: '75px' }}
                    >
                        {iconComponent ? (
                            iconComponent(theme)
                        ) : (
                            <DefaultEquipmentIcon color="primary" fontSize="large" />
                        )}
                    </div>

                    <div className="flex w-full flex-col justify-between items-end gap-10">
                        <div className="flex w-full justify-between">
                            <Typography className="text-16 md:text-17 font-medium">
                                {title || equipment.name}
                            </Typography>
                            <div className="flex flex-row items-center gap-4">
                                <IconButton
                                    color="inherit"
                                    className="p-5"
                                    onClick={() => {
                                        if (equipment.number && equipment.number > 0) {
                                            onEquipmentChange([
                                                {
                                                    equipmentId: equipment.id,
                                                    equipmentNumber: equipment.number - 1,
                                                },
                                            ])
                                        }
                                    }}
                                    disabled={addingEquipmentInProgress}
                                >
                                    <Icon>remove_circle_outlined</Icon>
                                </IconButton>
                                <div className="w-20 flex items-center justify-center">
                                    {addingEquipmentInProgress ? (
                                        <CircularProgress className="text-gray-400" size={15} />
                                    ) : (
                                        <Typography className="text-15 font-medium">{equipment.number}</Typography>
                                    )}
                                </div>
                                <IconButton
                                    color="inherit"
                                    className="p-5"
                                    onClick={() => {
                                        if (equipment.number) {
                                            onEquipmentChange([
                                                {
                                                    equipmentId: equipment.id,
                                                    equipmentNumber: equipment.number + 1,
                                                },
                                            ])
                                        }
                                    }}
                                    disabled={addingEquipmentInProgress}
                                >
                                    <Icon>add_circle_outlined</Icon>
                                </IconButton>
                                <SettingsIcon
                                    color="disabled"
                                    className="mr-6 cursor-pointer"
                                    onClick={() => {
                                        if (currentHousing?.id) {
                                            history.push(
                                                `${URL_MY_HOUSE}/${currentHousing.id}/equipments/${equipment.housingEquipmentId}/details/${equipementId}`,
                                            )
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <Button
                                sx={{
                                    width: '115px',
                                    paddingY: '3px',
                                    paddingX: '6px',
                                    bgcolor: theme.palette.common.white,
                                    color: theme.palette.primary.main,
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                    },
                                }}
                                variant="contained"
                                onClick={() => {
                                    if (currentHousing?.id) {
                                        history.push(
                                            `${URL_MY_HOUSE}/${currentHousing.id}/equipments/${equipment.housingEquipmentId}/usage/${equipementId}`,
                                            {
                                                equipment: {
                                                    title: title || equipment.name,
                                                },
                                            },
                                        )
                                    }
                                }}
                            >
                                Mon usage
                            </Button>
                            {/* In order to get the tooltip to show you need to wrap the disabled Button in a inline-block div */}
                            {isMicrowaveMeasurementButtonShown ? (
                                <Tooltip
                                    disableHoverListener={isEquipmentMeasurementFeatureState}
                                    title={
                                        <TypographyFormatMessage>{FEATURE_COMMING_SOON_TEXT}</TypographyFormatMessage>
                                    }
                                    placement="top"
                                    arrow
                                >
                                    <div className="flex justify-end gap-7 flex-wrap-reverse">
                                        <Button
                                            sx={{ width: '115px', paddingY: '3px', paddingX: '6px' }}
                                            variant="contained"
                                            onClick={navigateToEquipmentMeasurementsPage}
                                            disabled={!isEquipmentMeasurementFeatureState}
                                        >
                                            Mes mesures
                                        </Button>
                                        <Button
                                            sx={{ width: '115px', paddingY: '3px', paddingX: '6px' }}
                                            variant="contained"
                                            onClick={onOpenMeasurementModal}
                                            disabled={!isEquipmentMeasurementFeatureState}
                                        >
                                            Mesurer
                                        </Button>
                                    </div>
                                </Tooltip>
                            ) : null}
                        </div>
                    </div>
                </CardContent>
            </Card>
            {isMicrowaveMeasurementButtonShown && equipment.number && (
                <MicrowaveMeasurement
                    housingEquipmentId={equipment.housingEquipmentId!}
                    equipmentsNumber={equipment.number}
                    measurementModes={equipment.measurementModes!}
                    isMeasurementModalOpen={isMeasurementModalOpen}
                    onCloseMeasurementModal={onCloseMeasurementModal}
                    navigateToEquipmentMeasurementsPage={navigateToEquipmentMeasurementsPage}
                />
            )}
        </>
    )
}
