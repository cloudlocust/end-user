import React from 'react'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { useMeterList } from '../Meters/metersHook'
import { AccomodationForm } from './components/Accomodation/AccomodationForm'
import { EquipmentForm } from './EquipmentForm'

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
                    {/* <EquipmentForm
                        // houseDetails={houseDetails}
                    /> */}
                </div>
            ),
        },
    ]
    return <MultiTab content={tabsContent} />
}
