import React, { useState } from 'react'
import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
import { useIntl } from 'src/common/react-platform-translation'
import Button from '@mui/material/Button'
import { AccomodationForm } from './AccomodationForm'
import { ButtonLoader } from 'src/common/ui-kit'
import { EquipmentForm } from './EquipmentForm'
import { Form } from 'src/common/react-platform-components'
import { accomodationNames } from './utils/ProfileVariables'

/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const Profile = () => {
    // const { houseDetails, updateHouseDetails } = useMyHouse()
    const [isEdit, setIsEdit] = useState(false)
    const { formatMessage } = useIntl()
    const [isDPE, setIsDPE] = useState(true)
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
    /**
     * Leave only one selected field in the data from.
     *
     * @param data OnSubmit data.
     * @returns Data.
     */
    const setSelectFields = (data: any) => {
        if (
            data.hasOwnProperty(accomodationNames.energyPerformanceIndex) &&
            data.hasOwnProperty(accomodationNames.isolationLevel)
        ) {
            isDPE
                ? delete data[accomodationNames.isolationLevel]
                : delete data[accomodationNames.energyPerformanceIndex]
            return data
        }
        return data
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
                        isDPE={isDPE}
                        setIsDPE={setIsDPE}
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
                    />
                </div>
            ),
        },
    ]
    return (
        <div className="mb-28">
            <Form
                onSubmit={(data: any) => {
                    // onSubmit(data)
                    console.log(data)
                    console.log(setSelectFields(data))
                }}
            >
                <MultiTab content={tabsContent} />
                <div className="flex justify-center">
                    {!isEdit ? (
                        <div className="ml-16 md:ml-32 mt-20 w-full md:w-3/4 md:ml-72">
                            {/* <ButtonResetForm
                                initialValues={formInitialValues}
                                onClickButtonReset={toggleEditFormDisable}
                                className="mr-16"
                            /> */}
                            <ButtonLoader variant="contained" type="submit" onClick={onSubmit}>
                                {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                            </ButtonLoader>
                        </div>
                    ) : (
                        <div className="ml-16 md:ml-32 mt-20 w-full md:w-3/4 md:ml-72">
                            <Button variant="contained" onClick={enableForm}>
                                {formatMessage({ id: 'Modifier', defaultMessage: 'Modifier' })}
                            </Button>
                        </div>
                    )}
                </div>
            </Form>
        </div>
    )
}
