import React from 'react'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { AccomodationForm } from 'src/modules/MyHouse/components/Accomodation/AccomodationForm'
import { EquipmentForm } from 'src/modules/MyHouse/components/Equipments/EquipmentForm'

/**
 * Form used for modify MyHouse.
 *
 * @returns MyHouse form component.
 */
export const MyHouse = () => {
    const { elementList: meterList } = useMeterList()

    if (!meterList || !meterList.length) return <FuseLoading />
    const tabsContent = [
        {
            tabTitle: 'Logement',
            tabSlug: 'accomodation',
            tabContent: (
                <div className="Tab-Accomodation flex justify-center">
                    <AccomodationForm meterId={meterList[0].id} />
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
