import { chunk, filter, zip } from 'lodash'
import React, { useState } from 'react'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldForm'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { SelectButton } from './SelectButton'

interface IEquipementForm {
    onSubmit: (data: any) => void
    isEdit: boolean
}
/**
 *
 */
// interface IEquipmentOptions {
//     /**
//      * Initial number to start counting.
//      */
//     value?: number
//     /**
//      * Label title.
//      */
//     title: string
//     /**
//      * Icon name if taken from fuse mui.
//      */
//     iconLabel?: string
//     /**
//      * Icon path if it is svg image.
//      */
//     iconPath?: string
//     /**
//      * If decrement disabled when value === 0.
//      */
//     disableDecrement?: boolean
//     /**
//      * Wraper className.
//      */
//     wrapperClasses?: string
// }

const myEquipmentOptions = [
    { name: 'PC de bureau', labelTitle: 'PC de bureau', iconLabel: 'computer', disableDecrement: true },
    { name: 'PC Portable', labelTitle: 'PC Portable', iconLabel: 'computer', disableDecrement: true },
    { name: 'Téléviseur', labelTitle: 'Téléviseur', iconLabel: 'tv', disableDecrement: true },
    {
        name: 'Aspirateur',
        labelTitle: 'Aspirateur',
        iconPath: '/assets/images/content/equipment/aspirator.svg',
        disableDecrement: true,
        value: '',
    },
    { name: 'Four', labelTitle: 'Four', iconPath: '/assets/images/content/equipment/oven.svg', disableDecrement: true },
    { name: 'Micro-onde', labelTitle: 'Micro-onde', iconLabel: 'microwave', disableDecrement: true },
    { name: 'Réfrigérateur', labelTitle: 'Réfrigérateur', iconLabel: 'kitchen', disableDecrement: true },
    {
        name: 'Lave-vaisselle',
        labelTitle: 'Lave-vaisselle',
        iconPath: '/assets/images/content/equipment/dishwasher.svg',
        disableDecrement: true,
    },
    {
        name: 'Lave linge',
        labelTitle: 'Lave linge',
        iconPath: '/assets/images/content/equipment/washing-machine.svg',
        disableDecrement: true,
    },
    {
        name: 'Sèche linge',
        labelTitle: 'Sèche linge',
        iconPath: '/assets/images/content/equipment/clothes-dryer.svg',
        disableDecrement: true,
    },
]
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
