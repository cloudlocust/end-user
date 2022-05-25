import React, { useEffect, useState } from 'react'
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material'
import { chunk, filter, zip } from 'lodash'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { EditButtonsGroup } from 'src/modules/Profile/EditButtonsGroup'
import { myEquipmentOptions, heatingEquipment, hotPlateEquipment } from '../utils/ProfileVariables'
import { useEquipmentList } from 'src/modules/Profile/components/Equipments/equipmentHooks'
import {
    equipmentNameType,
    equipmentValuesType,
    meterEquipmentType,
    postEquipmentInputType,
} from 'src/modules/Profile/components/Equipments/EquipmentsType'

// TODO move to utils
/**
 *
 * @param cards
 * @param colNumber
 * @returns
 */
function groupedCards<T>(cards: T[], colNumber = 2) {
    const chunkArray = cards && chunk(cards, colNumber)
    return zip(...chunkArray).map((item) => filter(item)) as T[][]
}

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
    let savedEquipmentList: { [key: string]: meterEquipmentType } | null = null
    if (equipmentList) {
        if (!savedEquipmentList) savedEquipmentList = {}
        equipmentList.forEach((equipment) => {
            if (equipment.equipmentAllowedType.length > 0)
                savedEquipmentList![equipment.equipmentName] = {
                    equipmentId: equipment.id,
                    equipmentType: equipment.meterEquipment ? equipment.meterEquipment[0].equipmentType : undefined,
                }
            else
                savedEquipmentList![equipment.equipmentName] = {
                    equipmentId: equipment.id,
                    equipmentNumber: equipment.meterEquipment ? equipment.meterEquipment[0].equipmentNumber : undefined,
                }
        })
    }

    /**
     * Enable edit form.
     */
    const enableForm = () => {
        setIsEdit(true)
    }

    const { formatMessage } = useIntl()
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

    const myEquipment = isDesktop
        ? groupedCards(myEquipmentOptions as INumberFieldForm[], 5)
        : groupedCards(myEquipmentOptions as INumberFieldForm[])

    return (
        <div className="flex flex-col justify-center w-full md:w-3/4 ">
            <Form onSubmit={(data: equipmentValuesType) => {}}>
                <div className="flex flex-col justify-center w-full ">
                    <div className="font-semibold self-center text-sm mb-4 mt-16">
                        {formatMessage({
                            id: 'Informations Equipements',
                            defaultMessage: 'Informations Equipements',
                        })}
                    </div>
                    <div className="text-13">
                        <SelectButtons
                            isDisabled={!isEdit}
                            {...heatingEquipment}
                            initialValue={
                                savedEquipmentList
                                    ? savedEquipmentList![heatingEquipment.name as equipmentNameType].equipmentType
                                    : undefined
                            }
                        />
                    </div>
                    <div className="text-13">
                        <SelectButtons
                            isDisabled={!isEdit}
                            {...hotPlateEquipment}
                            initialValue={
                                savedEquipmentList
                                    ? savedEquipmentList![heatingEquipment.name as equipmentNameType].equipmentType
                                    : undefined
                            }
                        />
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
                                    {...item}
                                    disableDecrement={true}
                                    value={
                                        savedEquipmentList
                                            ? savedEquipmentList![item.name as equipmentNameType].equipmentNumber
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <EditButtonsGroup
                    formInitialValues={{}}
                    isEdit={isEdit}
                    disableEdit={() => setIsEdit(false)}
                    enableForm={enableForm}
                />
            </Form>
        </div>
    )
}
