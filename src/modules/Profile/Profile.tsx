import React, { useState } from 'react'
import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import { useTheme } from '@mui/material'
import Icon from '@mui/material/Icon'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import { dayjsUTC } from 'src/common/react-platform-components/utils/mm'
import { useIntl } from 'src/common/react-platform-translation'
import Button from '@mui/material/Button'
import { useHistory } from 'react-router'
import { EquipmentForm } from '.'
import MobileDetect from 'mobile-detect'
import { AccomodationForm } from './AccomodationForm'
import { Form } from 'src/common/react-platform-components'
import { ButtonLoader } from 'src/common/ui-kit'
// import MobileMultiTab from 'src/common/ui-kit/components/MobileMultiTab/MobileMultiTab'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const Profile = () => {
    // const { houseDetails, updateHouseDetails } = useMyHouse()
    const [isEdit, setIsEdit] = useState(false)
    const { formatMessage } = useIntl()
    const onSubmit = (data: any) => {
        // updateHouseDetails(data)
        setIsEdit(false)
    }
    const enableForm = () => {
        setIsEdit(true)
    }
    const tabsContent = [
        {
            tabTitle: 'Logement',
            tabSlug: 'accomodation',
            tabContent: (
                <div className="Tab-Accomodation">
                    <AccomodationForm
                        // houseDetails={houseDetails}
                        isEdit={isEdit}
                        enableForm={enableForm}
                        onSubmit={onSubmit}
                    />
                </div>
            ),
        },
        {
            tabTitle: 'Equipement',
            tabSlug: 'equipment',
            tabContent: (
                <div className="Tab-Equipment">
                    Equipement
                    {/* <EquipmentForm
                        // houseDetails={houseDetails}
                        isEdit={isEdit}
                        enableForm={enableForm}
                        onSubmit={onSubmit}
                    /> */}
                </div>
            ),
        },
    ]
    return (
        <div>
            <MultiTab content={tabsContent} innerScroll />
            {isEdit ? (
                <Button variant="contained" onClick={enableForm} className="ml-8">
                    {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                </Button>
            ) : (
                <ButtonLoader variant="contained" type="submit" className="ml-8">
                    {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                </ButtonLoader>
            )}
        </div>
    )
}
