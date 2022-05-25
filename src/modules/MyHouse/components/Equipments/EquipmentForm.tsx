import React, { useState } from 'react'
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { EditButtonsGroup } from 'src/modules/Profile/EditButtonsGroup'
import {
    myEquipmentOptions,
    heaterEquipment,
    hotPlateEquipment,
    groupedCards,
} from 'src/modules/Profile/utils/ProfileVariables'
import { useEquipmentList } from 'src/modules/Profile/components/Equipments/equipmentHooks'
import {
    equipmentAllowedTypeT,
    equipmentValuesType,
    meterEquipmentType,
} from 'src/modules/Profile/components/Equipments/EquipmentsType'

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
    const [isEdit, setIsEdit] = useState(false)

    const { equipmentList, saveEquipment, loadingEquipmentInProgress } = useEquipmentList(meterId)

    // eslint-disable-next-line jsdoc/require-jsdoc
    let savedEquipmentList: { [key: string]: meterEquipmentType } = {}
    if (equipmentList) {
        equipmentList.forEach((equipment) => {
            if (equipment.equipmentAllowedType.length > 0)
                savedEquipmentList![equipment.equipmentName] = {
                    equipmentId: equipment.id,
                    equipmentType: equipment.meterEquipment ? equipment.meterEquipment[0].equipmentType : undefined,
                }
            else
                savedEquipmentList![equipment.equipmentName] = {
                    equipmentId: equipment.id,
                    equipmentNumber: equipment.meterEquipment ? equipment.meterEquipment[0].equipmentNumber : 0,
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
        defaultValues[equipmentName] =
            savedEquipmentList[equipmentName].equipmentNumber === 0
                ? savedEquipmentList[equipmentName].equipmentNumber!
                : savedEquipmentList[equipmentName].equipmentType!
    })

    return (
        <div className="flex flex-col justify-center w-full md:w-3/4 ">
            <Form
                defaultValues={defaultValues}
                onSubmit={async (formData: equipmentValuesType) => {
                    let body: meterEquipmentType[] = []
                    // Transform formData into body for saveEquipment Request, using the savedData.
                    Object.keys(savedEquipmentList!).forEach((equipmentName) => {
                        if (formData[equipmentName as keyof equipmentValuesType]) {
                            if (savedEquipmentList![equipmentName].equipmentNumber === 0)
                                savedEquipmentList![equipmentName].equipmentNumber = formData[
                                    equipmentName as keyof equipmentValuesType
                                ] as number
                            else
                                savedEquipmentList![equipmentName].equipmentType = formData[
                                    equipmentName as keyof equipmentValuesType
                                ] as equipmentAllowedTypeT

                            body.push(savedEquipmentList![equipmentName])
                        }
                    })
                    if (body.length > 1) {
                        await saveEquipment(body)

                        setIsEdit(false)
                    }
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
                        <SelectButtons isDisabled={!isEdit} {...heaterEquipment} />
                    </div>
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEdit} {...hotPlateEquipment} />
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
                                <NumberFieldForm {...item} disableDecrement={true} />
                            ))}
                        </div>
                    ))}
                </div>
                <EditButtonsGroup
                    formInitialValues={defaultValues}
                    isEdit={isEdit}
                    disableEdit={() => setIsEdit(false)}
                    enableForm={() => setIsEdit(true)}
                />
            </Form>
        </div>
    )
}
