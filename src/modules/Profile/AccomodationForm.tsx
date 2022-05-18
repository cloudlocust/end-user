import React, { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { Form } from 'src/common/react-platform-components'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import { SelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtons'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { Select } from 'src/common/ui-kit/form-fields/Select'

/**
 * Interface IAccomodationForm.
 */
interface IAccomodationForm {
    /**
     *
     */
    onSubmit: (data: any) => void
    /**
     *
     */
    isEdit: boolean
}

const accomodationOptions = {
    house: 'Maison',
    apartment: 'Appartement',
    before1950: 'Avant 1950',
    from1950to1975: '1950 - 1975',
    after1975: 'Après 1975',
    main: 'Principale',
    secondary: 'Secondaire',
    energeticPerformance: 'Performance énergétique',
    isolation: 'Estimation isolation',
}
const accomodationNames = {}
const performanceOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const isolationOptions = ['Faible', 'Moyenne', 'Forte']

/**
 * AccomodationForm.
 *
 * @param root0 AccomodationForm props.
 * @param root0.onSubmit Submit action.
 * @param root0.isEdit Is edition mode.
 * @returns AccomodationForm.
 */
export const AccomodationForm = ({ onSubmit, isEdit }: IAccomodationForm) => {
    const { formatMessage } = useIntl()
    const [isDPE, setIsDPE] = useState(true)
    const disabledField = false // !isEdit

    const setSelectFields = (data: any) => {
        if (
            data.hasOwnProperty('indice_performance_energetique') &&
            data.hasOwnProperty('indice_estimation_isolation')
        ) {
            isDPE ? delete data['indice_estimation_isolation'] : delete data['indice_performance_energetique']
            return data
        }
        return data
    }

    return (
        <Form
            onSubmit={(data: any) => {
                onSubmit(data)
                console.log(data)
                console.log(setSelectFields(data))
            }}
        >
            <div className="flex flex-col justify-center w-full">
                <div className="font-semibold self-center text-sm mb-4 mt-16">
                    {formatMessage({
                        id: 'Informations Logements',
                        defaultMessage: 'Informations Logements',
                    })}
                </div>
                <SelectButtons
                    name="type_logement"
                    wrapperStyles="flex flex-row"
                    titleLabel="Type de logement :"
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: accomodationOptions.house,
                            iconPath: '/assets/images/content/accomodation/logementMaison.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mx-auto mt-16 flex flex-col mr-10',
                            value: accomodationOptions.house,
                        },
                        {
                            label: accomodationOptions.apartment,
                            iconPath: '/assets/images/content/accomodation/logementAppartement.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mx-auto mt-16 flex flex-col',
                            value: accomodationOptions.apartment,
                        },
                    ]}
                />
                <SelectButtons
                    name="annee_logement"
                    wrapperStyles="flex flex-row"
                    titleLabel="Année de construction :"
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: accomodationOptions.before1950,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col mr-10 text-xs pt-10 pb-10',
                            value: 'Avant_1950',
                        },
                        {
                            label: accomodationOptions.from1950to1975,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col mr-10 text-xs pt-10 pb-10',
                            value: 'Entre_1950_1975',
                        },
                        {
                            label: accomodationOptions.after1975,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col text-xs pt-10 pb-10',
                            value: 'Apres_1975',
                        },
                    ]}
                />
                <SelectButtons
                    wrapperStyles="flex flex-row"
                    titleLabel="Type de résidence :"
                    name="type_residence"
                    isDisabled={disabledField}
                    formOptions={[
                        {
                            label: accomodationOptions.main,
                            iconLabel: 'flag',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 mx-auto max-h-40 mt-16 mr-10 text-xs pt-12 pb-12',
                            value: accomodationOptions.main,
                        },
                        {
                            label: accomodationOptions.secondary,
                            iconLabel: 'golf_course',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 max-h-40 mx-auto mt-16 text-xs',
                            value: accomodationOptions.secondary,
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
                        name="indice_performance_energetique"
                        label={accomodationOptions.energeticPerformance}
                        children={performanceOptions.map((performance) => {
                            return <MenuItem value={performance}>{performance}</MenuItem>
                        })}
                    />
                ) : (
                    <Select
                        name="indice_estimation_isolation"
                        label={accomodationOptions.isolation}
                        children={isolationOptions.map((isolation) => {
                            return <MenuItem value={isolation}>{isolation}</MenuItem>
                        })}
                    />
                )}
                <div className="flex flex-row flex justify-between  mt-16 mr-24">
                    <div className="mt-16 mr-10 w-full ">
                        {formatMessage({
                            id: 'Nombre d’habitants :',
                            defaultMessage: 'Nombre d’habitants :',
                        })}
                    </div>
                    <div className="w-4/6">
                        <TextField
                            type="number"
                            name="habitants"
                            label={formatMessage({
                                id: 'Habitants',
                                defaultMessage: 'Habitants',
                            })}
                            disabled={disabledField}
                        />
                    </div>
                </div>
                <div className="flex flex-row flex justify-between mt-16 mb-10">
                    <div className="mt-16 mr-10 w-full ">
                        {formatMessage({
                            id: 'Superficie du logements :',
                            defaultMessage: 'Superficie du logements :',
                        })}
                    </div>
                    <div className="w-4/6 ">
                        <TextField
                            type="number"
                            name="superficie"
                            label={formatMessage({
                                id: 'Superficie',
                                defaultMessage: 'Superficie',
                            })}
                            disabled={disabledField}
                        />
                    </div>
                    <div className="mt-16 ml-6  ">
                        {formatMessage({
                            id: 'm²',
                            defaultMessage: 'm²',
                        })}
                    </div>
                </div>
            </div>
            <ButtonLoader variant="contained" type="submit" onClick={onSubmit}>
                {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
            </ButtonLoader>
        </Form>
    )
}
