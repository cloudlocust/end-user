import { EquipmentsQuickAddPopupProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsQuickAddPopup/equipmentsQuickAddPopup.d'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Form } from 'src/common/react-platform-components'
import {
    IEquipmentMeter,
    equipmentAllowedTypeT,
    equipmentMeterType,
    equipmentValuesType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'
import { useState } from 'react'
import {
    groupedCards,
    mappingEquipmentNameToType,
    myEquipmentOptions,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { EditButtonsGroup } from 'src/modules/MyHouse/EditButtonsGroup'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'

/**
 * EquipmentsQuickAddPopup dialog component.
 *
 * @param param0 N/A.
 * @param param0.open Open state for dialog.
 * @param param0.handleClosePopup OnClose function to close the dialog.
 * @param param0.equipmentsList Equipments list.
 * @param param0.saveEquipment Function that saves new equipments to backend.
 * @param param0.loadingEquipmentInProgress Loading state.
 * @returns EquipmentsQuickAddPopup JSX.
 */
export const EquipmentsQuickAddPopup = ({
    open,
    handleClosePopup,
    equipmentsList,
    saveEquipment,
    loadingEquipmentInProgress,
}: EquipmentsQuickAddPopupProps) => {
    const [isEdit, setIsEdit] = useState(false)

    // It'll have the following format an object of all equipment, name is the key, for example: {"heater": {equipment_id, equipment_type, equipment_number, isNumber, equipment: {id, name, allowed_type} } }.
    // eslint-disable-next-line jsdoc/require-jsdoc
    let savedEquipmentList: { [key: string]: IEquipmentMeter & { isNumber: boolean } } = {}
    if (equipmentsList) {
        equipmentsList.forEach((equipment) => {
            // Check that equipmentMeterList is not empty.
            savedEquipmentList![equipment.equipment.name] = {
                ...equipment,
                isNumber: mappingEquipmentNameToType[equipment.equipment.name] === 'number',
            }
        })
    }

    // eslint-disabled-next-line jsdoc/require-jsdoc
    let defaultValues: // eslint-disabled-next-line jsdoc/require-jsdoc
    /**
     * Default values used for setting the value of the form, and when resseting form.
     */
    {
        // eslint-disabled-next-line jsdoc/require-jsdoc
        [key: string]: number | equipmentAllowedTypeT
    } = {}
    // Initialise default Values
    Object.keys(savedEquipmentList!).forEach((equipmentName) => {
        defaultValues[equipmentName] = savedEquipmentList[equipmentName].isNumber
            ? savedEquipmentList[equipmentName].equipmentNumber!
            : savedEquipmentList[equipmentName].equipmentType!
    })

    // eslint-disable-next-line array-callback-return
    const updatedMyEquipmentOptions = myEquipmentOptions.map((option) => {
        const matchingEquipment = equipmentsList?.find((equipment) => equipment.equipment.name === option.name)
        if (matchingEquipment) {
            return {
                ...option,
                value: matchingEquipment.equipmentNumber,
            }
        }
    }) as INumberFieldForm[]

    const myEquipment = groupedCards(updatedMyEquipmentOptions)

    return (
        <Dialog open={open} onClose={handleClosePopup} aria-labelledby="alert-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="alert-dialog-title" sx={{ color: 'primary.main' }}>
                <TypographyFormatMessage>Ajout Rapide</TypographyFormatMessage>
            </DialogTitle>
            <DialogContent>
                <TypographyFormatMessage className="mb-10">Selectionner vos équipements :</TypographyFormatMessage>
                <Form
                    style={{ width: '100%' }}
                    defaultValues={defaultValues}
                    onSubmit={async (formData: equipmentValuesType) => {
                        let body: equipmentMeterType[] = []
                        // Transform formData into body for saveEquipment Request, using the savedData.
                        Object.keys(savedEquipmentList).forEach((equipmentName) => {
                            if (
                                formData[equipmentName as keyof equipmentValuesType] &&
                                // Check that it's new values.
                                savedEquipmentList[equipmentName].equipmentNumber !==
                                    formData[equipmentName as keyof equipmentValuesType] &&
                                savedEquipmentList[equipmentName].equipmentType !==
                                    formData[equipmentName as keyof equipmentValuesType]
                            ) {
                                if (savedEquipmentList[equipmentName].isNumber)
                                    savedEquipmentList[equipmentName].equipmentNumber = formData[
                                        equipmentName as keyof equipmentValuesType
                                    ] as number
                                else
                                    savedEquipmentList[equipmentName].equipmentType = formData[
                                        equipmentName as keyof equipmentValuesType
                                    ] as equipmentAllowedTypeT

                                const { equipment, isNumber, ...rest } = savedEquipmentList[equipmentName]
                                body.push(rest)
                            }
                        })

                        if (body.length > 0) {
                            await saveEquipment(body)
                        }
                        setIsEdit(false)
                        handleClosePopup()
                    }}
                >
                    <div className="flex">
                        {myEquipment.map((col) => (
                            <div className="w-full text-13">
                                {col.map((item) => {
                                    return (
                                        <NumberFieldForm
                                            key={item.name}
                                            value={item.value}
                                            {...item}
                                            disabled={!isEdit}
                                        />
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <EditButtonsGroup
                        formInitialValues={defaultValues}
                        isEdit={isEdit}
                        disableEdit={() => setIsEdit(false)}
                        enableForm={() => setIsEdit(true)}
                        inProgress={loadingEquipmentInProgress}
                    />
                </Form>
            </DialogContent>
        </Dialog>
    )
}
