import React, { useState } from 'react'
import { Form } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { SelectButton } from './SelectButton'

interface IEquipementForm {
    onSubmit: (data: any) => void
    isEdit: boolean
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
        <Form
            onSubmit={(data) => {
                onSubmit(data)
                // console.log(blurredFields)
            }}
        >
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
                            icon: '/assets/images/content/heatingElectricity.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: 'w-240 mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: equipmentOptions.other,
                            icon: '/assets/images/content/heatingOther.svg',
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
                            icon: '/assets/images/content/hotplatesElectricity.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: ' mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: equipmentOptions.induction,
                            icon: '/assets/images/content/hotplatesInduction.svg',
                            iconStyles: 'my-5 h-56',
                            buttonStyle: ' mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: equipmentOptions.other,
                            icon: '/assets/images/content/hotplatesOther.svg',
                            iconStyles: 'my-5 h-56 w-64',
                            buttonStyle: ' mt-16 flex flex-col',
                            isDisabled: disabledField,
                        },
                    ]}
                />
            </div>
        </Form>
    )
}
