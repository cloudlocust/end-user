import { chunk, filter, zip } from 'lodash'
import React, { useState } from 'react'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { SelectButton } from './SelectButton'
import { myEquipmentOptions } from './utils/ProfileVariables'

interface IEquipementForm {
    onSubmit: (data: any) => void
    isEdit: boolean
}

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
const equipmentNames = {
    heating: 'heating',
    hotplates: 'hotplates',
}

export const EquipmentForm = ({ onSubmit, isEdit }: IEquipementForm) => {
    const { formatMessage } = useIntl()
    const disabledField = false // !isEdit

    const equipmentOptions = {
        electricity: 'Eléctricité',
        other: 'Autre',
        induction: 'Induction',
    }

    return (
        <>
            <div className="flex flex-col justify-center w-full">
                <div className="font-semibold self-center text-sm mb-4 mt-16">
                    {formatMessage({
                        id: 'Informations Equipements',
                        defaultMessage: 'Informations Equipements',
                    })}
                </div>
                <SelectButtons
                    wrapperStyles="flex flex-row justify-center"
                    titleLabel="Type de chauffage :"
                    name={equipmentNames.heating}
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: equipmentOptions.electricity,
                            iconPath: '/assets/images/content/equipment/heatingElectricity.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: 'w-240 mt-16 flex flex-col mr-10',
                            value: equipmentOptions.electricity,
                        },
                        {
                            label: equipmentOptions.other,
                            iconPath: '/assets/images/content/equipment/heatingOther.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: 'w-240 mt-16 flex flex-col',
                            value: equipmentOptions.other,
                        },
                    ]}
                />
                <SelectButtons
                    wrapperStyles="flex flex-row justify-center"
                    titleLabel="Type de plaques de cuisson:"
                    name={equipmentNames.hotplates}
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: equipmentOptions.electricity,
                            iconPath: '/assets/images/content/equipment/hotplatesElectricity.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: ' mt-16 flex flex-col mr-10',
                            value: equipmentOptions.electricity,
                        },
                        {
                            label: equipmentOptions.induction,
                            iconPath: '/assets/images/content/equipment/hotplatesInduction.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: ' mt-16 flex flex-col mr-10',
                            value: equipmentOptions.induction,
                        },
                        {
                            label: equipmentOptions.other,
                            iconPath: '/assets/images/content/equipment/hotplatesOther.svg',
                            iconStyles: 'my-5 h-56 w-64',
                            buttonStyle: ' mt-16 flex flex-col',
                            value: equipmentOptions.other,
                        },
                    ]}
                />
            </div>
            <div className="flex flex-col justify-center w-full">
                <div className="font-semibold self-center text-sm mb-4 mt-16">
                    {formatMessage({
                        id: 'Informations Equipements :',
                        defaultMessage: 'Informations Equipements :',
                    })}
                </div>
            </div>
            <div className="flex">
                {groupedCards(myEquipmentOptions as INumberFieldForm[]).map((col) => (
                    <div className="w-full">
                        {col.map((item) => (
                            <NumberFieldForm
                                labelTitle={item.labelTitle}
                                iconLabel={item.iconLabel}
                                iconPath={item.iconPath}
                                disableDecrement={item.disableDecrement}
                                value={item.value}
                                wrapperClasses={item.wrapperClasses}
                                name={item.name}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}
