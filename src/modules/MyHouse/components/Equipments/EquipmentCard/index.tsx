import { Card, CardContent, CardActions, Button } from '@mui/material'
import { useModal } from 'src/hooks/useModal'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { MicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement'
import { getEquipmentIconPath } from 'src/modules/MyHouse/utils/MyHouseVariables'

/**
 * Equipment Card component.
 *
 * @param root0 N/A.
 * @param root0.name EquipmentCard name.
 * @param root0.type EquipmentCard type.
 * @param root0.number How many equipments are there of that type.
 * @returns EquipmentCard JSX.
 */
export const EquipmentCard = ({ name, type, number }: EquipmentCardProps) => {
    const {
        isOpen: measurementModalIsOpen,
        openModal: openMeasurementModal,
        closeModal: closeMeasurementModal,
    } = useModal()

    const showMicrowaveMeasurementBtn = number > 0 && name === 'microwave'

    return (
        <>
            <Card className="rounded-16 border border-slate-600 w-full md:w-1/2 lg:w-1/3" data-testid="equipment-item">
                <CardContent className="flex justify-between flex-row">
                    <img src={getEquipmentIconPath(name)} alt="equipment-icon" />
                    <div>
                        <div>{type}</div>
                        <div>{number}</div>
                    </div>
                </CardContent>
                {showMicrowaveMeasurementBtn ? (
                    <CardActions className="flex justify-end">
                        <Button className="px-20 py-3" variant="contained" onClick={openMeasurementModal}>
                            Mesurer
                        </Button>
                    </CardActions>
                ) : null}
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
