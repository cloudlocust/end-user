import React from 'react'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { AccomodationForm, EquipmentForm } from 'src/modules/Profile'
import { useMeterList } from 'src/modules/Meters/metersHook'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const Profile = () => {
    const { elementList: meterList } = useMeterList()

    // TODO Fix when meter will be configured in profile.
    if (!meterList || meterList.length === 0) return <FuseLoading />

    const tabsContent = [
        {
            tabTitle: 'Logement',
            tabSlug: 'accomodation',
            tabContent: (
                <div className="Tab-Accomodation flex justify-center">
                    <AccomodationForm />
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
