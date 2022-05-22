import React, { useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { chunk, filter, zip } from 'lodash'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { EditButtonsGroup } from '../EditButtonsGroup'
import { myEquipmentOptions, heatingEquipment, hotPlatesEquipment } from '../utils/ProfileVariables'

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
 * @returns Equipment Form equipment.
 */
export const EquipmentForm = () => {
    const [isEdit, setIsEdit] = useState(false)

    /**
     * OnSubmit.
     *
     * @param data Data to submit.
     */
    const onSubmit = (data: any) => {
        // updateHouseDetails(data)
        setIsEdit(false)
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
            <Form
                onSubmit={(data: any) => {
                    console.log(data)
                    // onSubmit(data)
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
                        <SelectButtons isDisabled={!isEdit} {...heatingEquipment} />
                    </div>
                    <div className="text-13">
                        <SelectButtons isDisabled={!isEdit} {...hotPlatesEquipment} />
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
                                <NumberFieldForm {...item} disableDecrement={!isEdit} value={item.value} />
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
