import React, { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { TextField } from 'src/common/ui-kit'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import {
    accomodationLabelOptions,
    accomodationNames,
    isolationOptions,
    performanceOptions,
} from 'src/modules/MyHouse/utils/MyHouseVariables'
import { Form, isPositive } from 'src/common/react-platform-components'
import { EditButtonsGroup } from 'src/modules/MyHouse/EditButtonsGroup'
import { useAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'
import { AccomodationDataType, IAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationType'
import { CircularProgress } from '@mui/material'

/**
 * AccomodationForm .
 *
 * @param root0 N/A.
 * @param root0.meterId MeterId.
 * @returns AccomodationForm.
 */
export const AccomodationForm = ({ meterId }: IAccomodation) => {
    const { formatMessage } = useIntl()
    const [isDPE, setIsDPE] = useState(true)
    const { loadAccomodation, updateAccomodation, accomodation, isLoadingInProgress } = useAccomodation()
    const [isEditAccomodation, setIdEditAccomodation] = useState(false)
    /**
     * Toggle edit accomodation.
     */
    const toggleEdit = () => {
        setIdEditAccomodation((prevEdit) => !prevEdit)
    }
    const disabledField = !!(accomodation && !isEditAccomodation)
    const accomodationData = {
        houseType: accomodation?.houseType,
        houseYear: accomodation?.houseYear,
        residenceType: accomodation?.residenceType,
        energyPerformanceIndex: accomodation?.energyPerformanceIndex,
        isolationLevel: accomodation?.isolationLevel,
        numberOfInhabitants: accomodation?.numberOfInhabitants,
        houseArea: accomodation?.houseArea,
        meterId: accomodation?.meterId,
    }
    /**
     * Leave only one selected field in the data from.
     *
     * @param data OnSubmit data.
     * @returns Data.
     */
    const setSelectFields = (data: AccomodationDataType) => {
        if (
            data.hasOwnProperty(accomodationNames.energyPerformanceIndex) &&
            data.hasOwnProperty(accomodationNames.isolationLevel)
        ) {
            isDPE
                ? delete data[accomodationNames.isolationLevel as keyof AccomodationDataType]
                : delete data[accomodationNames.energyPerformanceIndex as keyof AccomodationDataType]
            return data
        }
        return data
    }
    if (isLoadingInProgress)
        return (
            <div className="flex flex-col justify-center items-center w-full" style={{ minHeight: '60vh' }}>
                <CircularProgress />
            </div>
        )
    return (
        <div className="flex flex-col justify-center w-full md:w-3/4 ">
            <Form
                onSubmit={async (data: AccomodationDataType) => {
                    const dataAccomodation = { ...setSelectFields(data), meterId }
                    await updateAccomodation(meterId, dataAccomodation)
                    loadAccomodation(meterId)
                    toggleEdit()
                }}
                defaultValues={accomodationData}
            >
                <div className="flex justify-center font-semibold text-sm mb-4 mt-16">
                    {formatMessage({
                        id: 'Informations Logements',
                        defaultMessage: 'Informations Logements',
                    })}
                </div>
                <SelectButtons
                    name={accomodationNames.houseType}
                    wrapperStyles="flex flex-row  justify-center"
                    titleLabel="Type de logement :"
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: accomodationLabelOptions.house,
                            iconPath: '/assets/images/content/accomodation/logementMaison.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mt-16 flex flex-col mr-16',
                            value: accomodationLabelOptions.house,
                        },
                        {
                            label: accomodationLabelOptions.apartment,
                            iconPath: '/assets/images/content/accomodation/logementAppartement.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mt-16 flex flex-col',
                            value: accomodationLabelOptions.apartment,
                        },
                    ]}
                />
                <SelectButtons
                    name={accomodationNames.houseYear}
                    wrapperStyles="flex flex-row  justify-center"
                    titleLabel="Année de construction :"
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: accomodationLabelOptions.before1950,
                            buttonStyle: 'w-224 mt-16 flex flex-col mr-16 text-xs pt-10 pb-10',
                            value: 'Avant_1950',
                        },
                        {
                            label: accomodationLabelOptions.from1950to1975,
                            buttonStyle: 'w-224 mt-16 flex flex-col mr-16 text-xs pt-10 pb-10',
                            value: 'Entre_1950_1975',
                        },
                        {
                            label: accomodationLabelOptions.after1975,
                            buttonStyle: 'w-224 mt-16 flex flex-col text-xs pt-10 pb-10',
                            value: 'Apres_1975',
                        },
                    ]}
                />
                <SelectButtons
                    wrapperStyles="flex flex-row justify-center"
                    titleLabel="Type de résidence :"
                    name={accomodationNames.residenceType}
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: accomodationLabelOptions.main,
                            iconLabel: 'flag',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 max-h-40 mt-16 mr-16 text-xs pt-12 pb-12',
                            value: accomodationLabelOptions.main,
                        },
                        {
                            label: accomodationLabelOptions.secondary,
                            iconLabel: 'golf_course',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 max-h-40 mt-16 text-xs',
                            value: accomodationLabelOptions.secondary,
                        },
                    ]}
                />
                <div className="flex flex-row select flex justify-between  mt-10">
                    <div className="mt-14 mr-10">
                        {formatMessage({
                            id: 'Je connais mon DPE :',
                            defaultMessage: 'Je connais mon DPE :',
                        })}
                    </div>
                    <RadioGroup row name="isDPE">
                        <FormControlLabel
                            value="oui"
                            control={<Radio color="primary" />}
                            label="Oui"
                            onClick={() => setIsDPE(true)}
                            checked={isDPE}
                            disabled={disabledField}
                        />
                        <FormControlLabel
                            value="non"
                            control={<Radio color="primary" />}
                            label="Non"
                            onClick={() => setIsDPE(false)}
                            checked={!isDPE}
                            disabled={disabledField}
                        />
                    </RadioGroup>
                </div>
                {isDPE ? (
                    <Select
                        name={accomodationNames.energyPerformanceIndex}
                        label={accomodationLabelOptions.energeticPerformance}
                        children={performanceOptions.map((performance) => {
                            return <MenuItem value={performance}>{performance}</MenuItem>
                        })}
                        defaultValue={null}
                    />
                ) : (
                    <Select
                        name={accomodationNames.isolationLevel}
                        label={accomodationLabelOptions.isolation}
                        children={isolationOptions.map((isolation) => {
                            return <MenuItem value={isolation}>{isolation}</MenuItem>
                        })}
                        defaultValue={null}
                    />
                )}
                <div className="flex flex-row flex justify-between mt-16 mr-24">
                    <div className="mt-16 mr-10 w-full ">
                        {formatMessage({
                            id: 'Nombre d’habitants :',
                            defaultMessage: 'Nombre d’habitants :',
                        })}
                    </div>
                    <div className="w-4/6">
                        <TextField
                            type="number"
                            name={accomodationNames.numberOfInhabitants}
                            label={formatMessage({
                                id: 'Habitants',
                                defaultMessage: 'Habitants',
                            })}
                            disabled={disabledField}
                            inputProps={{ min: 0 }}
                        />
                    </div>
                </div>
                <div className="flex flex-row flex justify-between mb-10">
                    <div className="mt-16 mr-10 w-full ">
                        {formatMessage({
                            id: 'Superficie du logements :',
                            defaultMessage: 'Superficie du logements :',
                        })}
                    </div>
                    <div className="w-4/6 ">
                        <TextField
                            type="number"
                            name={accomodationNames.houseArea}
                            label={formatMessage({
                                id: 'Superficie',
                                defaultMessage: 'Superficie',
                            })}
                            disabled={disabledField}
                            inputProps={{ min: 0 }}
                        />
                    </div>
                    <div className="mt-16 ml-6  ">
                        {formatMessage({
                            id: 'm²',
                            defaultMessage: 'm²',
                        })}
                    </div>
                </div>
                <EditButtonsGroup
                    isEdit={!disabledField}
                    enableForm={toggleEdit}
                    formInitialValues={accomodationData}
                    disableEdit={toggleEdit}
                />
            </Form>
        </div>
    )
}
