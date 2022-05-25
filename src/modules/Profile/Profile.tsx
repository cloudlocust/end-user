import React, { useState } from 'react'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { AccomodationForm } from './AccomodationForm'
import { EquipmentForm } from './components/EquipmentForm'
import { useMeterList } from 'src/modules/Meters/metersHook'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const Profile = () => {
    // const { houseDetails, updateHouseDetails } = useProfile()
    const [isEdit, setIsEdit] = useState(false)
    const { elementList: meterList } = useMeterList()

    // TODO Fix when meter will be configured in profile.
    if (!meterList || meterList.length === 0) return <FuseLoading />

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
                        isEdit={isEdit}
                        onSubmit={onSubmit}
                        enableForm={enableForm}
                        setIsEdit={setIsEdit}
                    />
                </div>
            ),
        },
        {
            tabTitle: 'Equipement',
            tabSlug: 'equipment',
            tabContent: (
                <div className="Tab-Equipment flex justify-center">
                    <EquipmentForm meterId={meterList[0].id} />
                </div>
            ),
        },
    ]
    return <MultiTab content={tabsContent} />
}
