import { chunk, filter, zip } from 'lodash'
import React, { useState } from 'react'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { NumberField } from 'src/common/ui-kit/components/NumberField/NumberField'
import { SelectButton } from './SelectButton'

interface IEquipementForm {
    onSubmit: (data: any) => void
    isEdit: boolean
}
/**
 *
 */
interface IEquipmentOptions {
    /**
     * Initial number to start counting.
     */
    initialCount?: number
    /**
     * Label title.
     */
    title: string
    /**
     * Icon name if taken from fuse mui.
     */
    iconLabel?: string
    /**
     * Icon path if it is svg image.
     */
    iconPath?: string
    /**
     * If decrement disabled when value === 0.
     */
    disableDecrement?: boolean
    /**
     * Wraper className.
     */
    wrapperClasses?: string
}
const myEquipmentOptions = [
    { title: 'PC de bureau', iconLabel: 'computer', disableDecrement: true },
    { title: 'PC Portable', iconLabel: 'computer', disableDecrement: true },
    { title: 'Téléviseur', iconLabel: 'tv', disableDecrement: true },
    { title: 'Aspirateur', iconPath: '/assets/images/content/equipment/aspirator.svg', disableDecrement: true },
    { title: 'Four', iconPath: '/assets/images/content/equipment/oven.svg', disableDecrement: true },
    { title: 'Micro-onde', iconLabel: 'microwave', disableDecrement: true },
    { title: 'Réfrigérateur', iconLabel: 'kitchen', disableDecrement: true },
    {
        title: 'Lave-vaisselle',
        iconPath: '/assets/images/content/equipment/dishwasher.svg',
        disableDecrement: true,
    },
    {
        title: 'Lave linge',
        iconPath: '/assets/images/content/equipment/washing-machine.svg',
        disableDecrement: true,
    },
    {
        title: 'Sèche linge',
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

export const EquipmentForm = ({ onSubmit, isEdit }: IEquipementForm) => {
    const { formatMessage } = useIntl()
    const disabledField = false // !isEdit

    const equipmentOptions = {
        electricity: 'Eléctricité',
        other: 'Autre',
        induction: 'Induction',
    }
    const [heating, setHeating] = useState(equipmentOptions.electricity)
    const [hotplates, setHotplates] = useState(equipmentOptions.electricity)
    const [equipmentFields, setEquipmentFields] = useState({
        heating: heating,
        hotplates: hotplates,
    })
    /**
     * HandleBlur for the event.
     *
     * @param event Click event.
     */
    const handleBlur = (event: any) => {
        setEquipmentFields({ ...equipmentFields, [event.target.name]: event.target.value })
    }
    return (
        // <Form
        //     onSubmit={(data) => {
        //         onSubmit(data)
        //         // console.log(blurredFields)
        //     }}
        // >
        <>
            <div className="flex flex-col justify-center w-full">
                <div className="font-semibold self-center text-sm mb-4 mt-16">
                    {formatMessage({
                        id: 'Informations Equipements',
                        defaultMessage: 'Informations Equipements',
                    })}
                </div>
                <SelectButton
                    state={heating}
                    setState={setHeating}
                    wrapperStyles="flex flex-row justify-center"
                    titleLabel="Type de chauffage :"
                    name="heating"
                    onBlur={handleBlur}
                    formOptions={[
                        {
                            label: equipmentOptions.electricity,
                            icon: '/assets/images/content/equipment/heatingElectricity.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: 'w-240 mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: equipmentOptions.other,
                            icon: '/assets/images/content/equipment/heatingOther.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: 'w-240 mt-16 flex flex-col',
                            isDisabled: disabledField,
                        },
                    ]}
                />
                <SelectButton
                    state={hotplates}
                    setState={setHotplates}
                    wrapperStyles="flex flex-row justify-center"
                    titleLabel="Type de plaques de cuisson:"
                    name="hotplates"
                    onBlur={handleBlur}
                    formOptions={[
                        {
                            label: equipmentOptions.electricity,
                            icon: '/assets/images/content/equipment/hotplatesElectricity.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: ' mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: equipmentOptions.induction,
                            icon: '/assets/images/content/equipment/hotplatesInduction.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: ' mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: equipmentOptions.other,
                            icon: '/assets/images/content/equipment/hotplatesOther.svg',
                            iconStyles: 'my-5 h-56 w-64',
                            buttonStyle: ' mt-16 flex flex-col',
                            isDisabled: disabledField,
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
            {/* <div className="flex">
                {groupedCards(myEquipmentOptions as IEquipmentOptions[]).map((col) => (
                    <div className="w-full">
                        {col.map((item) => (
                            <NumberField
                                title={item.title}
                                iconLabel={item.iconLabel}
                                iconPath={item.iconPath}
                                disableDecrement={item.disableDecrement}
                                initialCount={item.initialCount}
                                wrapperClasses={item.wrapperClasses}
                            />
                        ))}
                    </div>
                ))}
            </div> */}
        </>
    )
}
