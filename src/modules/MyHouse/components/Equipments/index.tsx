import { Container, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Form } from 'src/common/react-platform-components'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple/PageSimple'
import { EditButtonsGroup } from 'src/modules/MyHouse/EditButtonsGroup'
import {
    IEquipmentMeter,
    equipmentAllowedTypeT,
    equipmentMeterType,
    equipmentValuesType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'
import { useEquipmentList } from 'src/modules/MyHouse/components/Installation/installationHook'
import {
    groupedCards,
    mappingEquipmentNameToType,
    myEquipmentOptions,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { RootState } from 'src/redux'

/**
 * Housing Equipments.
 *
 * @returns Housing Equipments.
 */
export const Equipments = () => {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { equipmentList, saveEquipment, loadingEquipmentInProgress, isEquipmentMeterListEmpty } = useEquipmentList(
        currentHousing?.id,
    )

    const [isEdit, setIsEdit] = useState(false)

    const myEquipment = isDesktop
        ? groupedCards(myEquipmentOptions as INumberFieldForm[], 2)
        : groupedCards(myEquipmentOptions as INumberFieldForm[])

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

    return (
        <PageSimple
            header={<></>}
            content={
                <Container>
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
                        }}
                    >
                        <div className="mt-16 mb-20">
                            <TypographyFormatMessage>Vos équipements :</TypographyFormatMessage>
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
                            inProgress={loadingEquipmentInProgress}
                        />
                    </Form>
                </Container>
            }
        />
    )
}
