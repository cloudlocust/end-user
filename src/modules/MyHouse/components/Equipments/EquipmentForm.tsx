import React, { useState } from 'react'
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { EditButtonsGroup } from 'src/modules/MyHouse/EditButtonsGroup'
import {
    myEquipmentOptions,
    heaterEquipment,
    hotPlateEquipment,
    groupedCards,
    mappingEquipmentNameToType,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { useEquipmentList } from 'src/modules/MyHouse/components/Equipments/equipmentHooks'
import {
    equipmentAllowedTypeT,
    equipmentValuesType,
    equipmentMeterType,
    IEquipmentMeter,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsType'

/**
 * EquipmentForm Component.
 *
 * @param props N/A.
 * @param props.meterId Id of the meter.
 * @returns Equipment Form equipment.
 */
export const EquipmentForm = ({
    meterId,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    meterId: number
}) => {
    const { equipmentList, saveEquipment, loadingEquipmentInProgress, isEquipmentMeterListEmpty } =
        useEquipmentList(meterId)

    const [isEdit, setIsEdit] = useState(false)

    // It'll have the following format an object of all equipment, name is the key, for example: {"heater": {equipment_id, equipment_type, equipment_number, isNumber, equipment: {id, name, allowed_type} } }.
    // eslint-disable-next-line jsdoc/require-jsdoc
    let savedEquipmentList: { [key: string]: IEquipmentMeter & { isNumber: boolean } } = {}
    if (equipmentList) {
        equipmentList.forEach((equipment) => {
            // Check that equipmentMeterList is not empty.
            savedEquipmentList![equipment.equipment.name] = {
                ...equipment,
                isNumber: mappingEquipmentNameToType[equipment.equipment.name] === 'number',
            }
        })
    }
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

    const myEquipment = isDesktop
        ? groupedCards(myEquipmentOptions as INumberFieldForm[], 5)
        : groupedCards(myEquipmentOptions as INumberFieldForm[])

    if (!equipmentList || loadingEquipmentInProgress || equipmentList.length === 0)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )

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
    console.log(!isEquipmentMeterListEmpty, !isEdit)
    return (
        <div className="flex flex-col justify-center w-full md:w-3/4 ">
            <Form
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
                }}
            >
                <div className="flex flex-col justify-center w-full ">
                    <div className="font-semibold self-center text-sm mb-4 mt-16">
                        {formatMessage({
                            id: 'Informations Equipements',
                            defaultMessage: 'Informations Equipements',
                        })}
                    </div>
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEquipmentMeterListEmpty && !isEdit} {...heaterEquipment} />
                    </div>
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEquipmentMeterListEmpty && !isEdit} {...hotPlateEquipment} />
                    </div>
                </div>
                <div className="mt-16 mb-20">
                    {formatMessage({
                        id: 'Vos équipements :',
                        defaultMessage: 'Vos équipements :',
                    })}
                </div>
                <div className="flex">
                    {myEquipment.map((col) => (
                        <div className="w-full text-13">
                            {col.map((item) => (
                                <NumberFieldForm
                                    key={item.name}
                                    {...item}
                                    disabled={!isEquipmentMeterListEmpty && !isEdit}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <EditButtonsGroup
                    formInitialValues={defaultValues}
                    isEdit={isEquipmentMeterListEmpty || isEdit}
                    disableEdit={() => setIsEdit(false)}
                    enableForm={() => setIsEdit(true)}
                />
            </Form>
        </div>
    )
}
