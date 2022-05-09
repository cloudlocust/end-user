import React, { useState } from 'react'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { useIntl } from 'src/common/react-platform-translation'
import Button from '@mui/material/Button'
import { AccomodationForm } from './AccomodationForm'
import { ButtonLoader } from 'src/common/ui-kit'
import { EquipmentForm } from './EquipmentForm'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const Profile = () => {
    // const { houseDetails, updateHouseDetails } = useMyHouse()
    const [isEdit, setIsEdit] = useState(false)
    const { formatMessage } = useIntl()
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
                <div className="Tab-Accomodation">
                    <AccomodationForm
                        // houseDetails={houseDetails}
                        isEdit={isEdit}
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
                    <EquipmentForm
                        // houseDetails={houseDetails}
                        isEdit={isEdit}
                        onSubmit={onSubmit}
                    />
                </div>
            ),
        },
    ]
    return (
        <div className="mb-56">
            <MultiTab content={tabsContent} />
            {!isEdit ? (
                <div className="ml-16 md:ml-32">
                    {/* <ButtonResetForm initialValues={formInitialValues} onClickButtonReset={toggleEditFormDisable} /> */}
                    <ButtonLoader variant="contained" type="submit" onClick={onSubmit}>
                        {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                    </ButtonLoader>
                </div>
            ) : (
                <Button variant="contained" onClick={enableForm} className="ml-16 md:ml-32">
                    {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                </Button>
            )}
        </div>
    )
}
