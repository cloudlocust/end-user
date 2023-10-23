import { useModal } from 'src/hooks/useModal'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { Card, CardContent, Button, useTheme, Typography, Icon, Tooltip } from '@mui/material'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { useIntl } from 'src/common/react-platform-translation'
import { useState } from 'react'
import { ReactComponent as CustomEquipmentIcon } from 'src/assets/images/content/housing/equipments/custom-equipment.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { isEquipmentMeasurementFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { FEATURE_COMMING_SOON_TEXT } from 'src/modules/shared'

/**
 * Equipment Card component.
 *
 * @description Equipment Card component that displays individual card for each type of equipment.
 * @param root0 N/A.
 * @param root0.id Equipment id.
 * @param root0.number How many equipments are there of that type.
 * @param root0.label Equipment label.
 * @param root0.name Equipment backend name.
 * @param root0.onEquipmentChange Function that handle the equipment number.
 * @param root0.iconComponent Icon component.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({ id, number, label, name, onEquipmentChange, iconComponent }: EquipmentCardProps) => {
    const theme = useTheme()
    const [equipmentNumber, setEquipmentNumber] = useState<number>(number)
    const { formatMessage } = useIntl()
    const {
        isOpen: isMeasurementModalOpen,
        openModal: onOpenMeasurementModal,
        closeModal: onCloseMeasurementModal,
    } = useModal()

    const isMicrowaveMeasurementButtonShown = number > 0 && name === 'microwave'

    return (
        <>
            <Card className="rounded-16 border border-slate-600 w-full" data-testid="equipment-item">
                <CardContent className="flex flex-row space-x-14" sx={{ p: '1rem', '&:last-child': { pb: '1rem' } }}>
                    <div
                        className="flex justify-center items-center rounded-16 border-2"
                        style={{ borderColor: theme.palette.primary.main, width: '75px', height: '75px' }}
                    >
                        {iconComponent ? (
                            iconComponent(theme)
                        ) : (
                            <CustomEquipmentIcon fill={theme.palette.primary.main} width={'35'} height={'35'} />
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
                                        setEquipmentNumber((prevv) => {
                                            onEquipmentChange([{ equipmentId: id, equipmentNumber: prevv + 1 }])
                                            return prevv + 1
                                        })
                                    }}
                                >
                                    add_circle_outlined
                                </Icon>
                                <div className="text-14 font-medium">{equipmentNumber}</div>
                                <Icon
                                    color="disabled"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (equipmentNumber > 0) {
                                            setEquipmentNumber((prevv) => {
                                                onEquipmentChange([{ equipmentId: id, equipmentNumber: prevv - 1 }])
                                                return prevv - 1
                                            })
                                        }
                                    }}
                                >
                                    remove_circle_outlined
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
                    equipmentsNumber={number}
                    isMeasurementModalOpen={isMeasurementModalOpen}
                    onCloseMeasurementModal={onCloseMeasurementModal}
                />
            )}
        </>
    )
}
