import React, { useState } from 'react'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { AccomodationForm } from './AccomodationForm'
import { EquipmentForm } from './EquipmentForm'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const Profile = () => {
    // const { houseDetails, updateHouseDetails } = useProfile()
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

    const tabsContent = [
        {
            tabTitle: 'Logement',
            tabSlug: 'accomodation',
            tabContent: (
                <div className="Tab-Accomodation flex justify-center">
                    <AccomodationForm
                        // houseDetails={houseDetails}
                        isEdit={isEdit}
                        onSubmit={onSubmit}
                        enableForm={enableForm}
                    />
                </div>
            ),
        },
        {
            tabTitle: 'Equipement',
            tabSlug: 'equipment',
            tabContent: (
                <div className="Tab-Equipment flex justify-center">
                    <EquipmentForm
                        // houseDetails={houseDetails}
                        isEdit={isEdit}
                        onSubmit={onSubmit}
                        enableForm={enableForm}
                    />
                </div>
            ),
        },
    ]
    return <MultiTab content={tabsContent} />
}
