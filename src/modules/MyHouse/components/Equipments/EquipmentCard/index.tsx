import { useModal } from 'src/hooks/useModal'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { Card, CardContent, Button, useTheme, Typography, Icon } from '@mui/material'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { ReactSVG } from 'react-svg'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * Equipment Card component.
 *
 * @param root0 N/A.
 * @param root0.number How many equipments are there of that type.
 * @param root0.label Equipment label.
 * @param root0.name Equipment backend name.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({ number, label, name }: EquipmentCardProps) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const {
        isOpen: measurementModalIsOpen,
        openModal: openMeasurementModal,
        closeModal: closeMeasurementModal,
    } = useModal()
    const svgUrl = require(`src/assets/images/content/housing/equipments/${name}.svg`).default
    const showMicrowaveMeasurementBtn = number > 0 && name === 'microwave'

    return (
        <>
            <Card className="rounded-16 border border-slate-600 w-full" data-testid="equipment-item">
                <CardContent className="flex flex-row space-x-14" sx={{ p: '1rem', '&:last-child': { pb: '1rem' } }}>
                    <div
                        className="flex justify-center items-center rounded-16 border-2"
                        style={{ borderColor: theme.palette.primary.main, width: '75px', height: '75px' }}
                    >
                        <ReactSVG
                            src={svgUrl}
                            beforeInjection={(svg) => {
                                const paths = svg.querySelectorAll('path')
                                paths.forEach((p) => {
                                    p.style.fill = theme.palette.primary.main
                                })
                                svg.setAttribute('width', '35')
                                svg.setAttribute('height', '35')
                            }}
                            className="flex justify-center w-full"
                        />
                    </div>
                    <div className="flex flex-row w-full justify-between">
                        <Typography className="text-16 md:text-17 font-medium">
                            {formatMessage({
                                id: label,
                                defaultMessage: label,
                            })}
                        </Typography>
                        {/* TODO: add deboucing component here */}
                        <div className="flex flex-col justify-between items-end">
                            <div className="flex flex-row items-center space-x-8">
                                <Icon color="disabled" className="cursor-pointer">
                                    add_circle_outlined
                                </Icon>
                                <div className="text-14 font-medium">{number}</div>
                                <Icon color="disabled" className="cursor-pointer">
                                    remove_circle_outlined
                                </Icon>
                            </div>
                            {showMicrowaveMeasurementBtn && (
                                <Button className="px-20 py-3" variant="contained" onClick={openMeasurementModal}>
                                    Mesurer
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            {showMicrowaveMeasurementBtn ? (
                <MicrowaveMeasurement
                    equipmentsNumber={number}
                    modalIsOpen={measurementModalIsOpen}
                    closeModal={closeMeasurementModal}
                />
            ) : null}
        </>
    )
}
