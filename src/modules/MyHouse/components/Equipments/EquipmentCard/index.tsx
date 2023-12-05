import { useModal } from 'src/hooks/useModal'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { Card, CardContent, Button, useTheme, Typography, Icon, Tooltip } from '@mui/material'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { useIntl } from 'src/common/react-platform-translation'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { isEquipmentMeasurementFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { FEATURE_COMMING_SOON_TEXT } from 'src/modules/shared'
import { DashboardCustomizeOutlined } from '@mui/icons-material'

/**
 * Equipment Card component.
 *
 * @description Equipment Card component that displays individual card for each type of equipment.
 * @param root0 N/A.
 * @param root0.equipment The equipment details object.
 * @param root0.label Equipment label.
 * @param root0.onEquipmentChange Function that handle the equipment number.
 * @param root0.iconComponent Icon component.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({ equipment, label, onEquipmentChange, iconComponent }: EquipmentCardProps) => {
    const theme = useTheme()
    const [equipmentNumber, setEquipmentNumber] = useState<number>(equipment.number || 0)
    const { formatMessage } = useIntl()
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
    const navigateToEquipmentDetailsPage = useCallback(() => {
        if (currentHousing?.id)
            history.push(`${URL_MY_HOUSE}/${currentHousing.id}/equipments/details`, {
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

    const isMicrowaveMeasurementButtonShown = equipment.number && equipment.number > 0 && equipment.name === 'microwave'

    return (
        <>
            <Card className="rounded-16 border border-slate-600 w-full" data-testid="equipment-item">
                <CardContent className="flex flex-row space-x-14" sx={{ p: '1rem', '&:last-child': { pb: '1rem' } }}>
                    <div
                        className="flex justify-center items-center rounded-16 border-2 cursor-pointer"
                        style={{ borderColor: theme.palette.primary.main, width: '75px', height: '75px' }}
                        onClick={navigateToEquipmentDetailsPage}
                    >
                        {iconComponent ? (
                            iconComponent(theme)
                        ) : (
                            <DashboardCustomizeOutlined color="primary" fontSize="large" />
                        )}
                    </div>

                    <div className="flex flex-row w-full justify-between">
                        <Typography className="text-16 md:text-17 font-medium">
                            {formatMessage({
                                id: label,
                                defaultMessage: label,
                            })}
                        </Typography>
                        <div className="flex flex-col justify-between items-end">
                            <div className="flex flex-row items-center space-x-8">
                                <Icon
                                    color="disabled"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (equipmentNumber > 0) {
                                            setEquipmentNumber((prevv) => {
                                                onEquipmentChange([
                                                    { equipmentId: equipment.id, equipmentNumber: prevv - 1 },
                                                ])
                                                return prevv - 1
                                            })
                                        }
                                    }}
                                >
                                    remove_circle_outlined
                                </Icon>
                                <div className="text-14 font-medium">{equipmentNumber}</div>
                                <Icon
                                    color="disabled"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setEquipmentNumber((prevv) => {
                                            onEquipmentChange([
                                                { equipmentId: equipment.id, equipmentNumber: prevv + 1 },
                                            ])
                                            return prevv + 1
                                        })
                                    }}
                                >
                                    add_circle_outlined
                                </Icon>
                            </div>
                            <Tooltip
                                disableHoverListener={isEquipmentMeasurementFeatureState}
                                title={<TypographyFormatMessage>{FEATURE_COMMING_SOON_TEXT}</TypographyFormatMessage>}
                                placement="top"
                                arrow
                            >
                                {/* In order to get the tooltip to show you need to wrap the disabled Button in a inline-block div */}
                                {isMicrowaveMeasurementButtonShown ? (
                                    <div className="inline-block">
                                        <Button
                                            className="px-20 py-3"
                                            variant="contained"
                                            onClick={onOpenMeasurementModal}
                                            disabled={!isEquipmentMeasurementFeatureState}
                                        >
                                            Mesurer
                                        </Button>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </Tooltip>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {isMicrowaveMeasurementButtonShown && (
                <MicrowaveMeasurement
                    housingEquipmentId={equipment.housingEquipmentId!}
                    equipmentsNumber={equipmentNumber}
                    measurementModes={equipment.measurementModes!}
                    isMeasurementModalOpen={isMeasurementModalOpen}
                    onCloseMeasurementModal={onCloseMeasurementModal}
                    navigateToEquipmentDetailsPage={navigateToEquipmentDetailsPage}
                />
            )}
        </>
    )
}
