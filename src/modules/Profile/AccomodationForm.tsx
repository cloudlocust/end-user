import React, { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { email, requiredBuilder, Form } from 'src/common/react-platform-components'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { SelectButton } from './SelectButton'
import InputLabel from '@mui/material/InputLabel'
import { FormControl } from '@mui/material'

/**
 * Interface IAccomodationForm.
 */
interface IAccomodationForm {
    /**
     *
     */
    enableForm: () => void
    /**
     *
     */
    onSubmit: (data: any) => void
    /**
     *
     */
    isEdit: boolean
}

/**
 * @param root0
 * @param root0.enableForm
 * @param root0.onSubmit
 * @param root0.isEdit
 */
export const AccomodationForm = ({ enableForm, onSubmit, isEdit }: IAccomodationForm) => {
    const { formatMessage } = useIntl()
    const formOptions = {
        house: 'Maison',
        apartment: 'Appartement',
        before1950: 'Avant 1950',
        from1950to1975: '1950 - 1975',
        after1950: 'Après 1950',
        main: 'Principale',
        secondary: 'Secondaire',
        energeticPerformance: 'Performance énergétique',
        isolation: 'Estimation isolation',
    }
    const performanceOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const isolationOptions = ['Faible', 'Moyenne', 'Forte']
    const [logement, setLogement] = useState(formOptions.house)
    const [constructionYear, setConstructionYear] = useState(formOptions.before1950)
    const [residenceType, setResidenceType] = useState(formOptions.main)
    const [isDPE, setIsDPE] = useState(true)
    const [energeticPerformance, setEnergeticPerformance] = useState('')
    const [isolation, setIsolation] = useState('')
    /**
     * Handle change select menu.
     *
     * @param event Select Change Event.
     */
    const handleChange = (
        event: SelectChangeEvent<string>,
        setState: (value: React.SetStateAction<string>) => void,
    ) => {
        setState(event.target.value)
    }
    //<Form onSubmit={onSubmit}>Fields related to each Form</Form>
    return (
        <Form
            // eslint-disable-next-line jsdoc/require-jsdoc
            onSubmit={onSubmit}
        >
            <div className="flex flex-col justify-center w-full">
                <div className="font-semibold self-center text-sm mb-4 mt-16">
                    {formatMessage({
                        id: 'Informations Logements',
                        defaultMessage: 'Informations Logements',
                    })}
                </div>
                <SelectButton
                    state={logement}
                    setState={setLogement}
                    wrapperStyles="flex flex-row"
                    titleLabel="Type de logement :"
                    formOptions={[
                        {
                            label: formOptions.house,
                            icon: '/assets/images/content/logementMaison.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mx-auto mt-16 flex flex-col mr-10',
                        },
                        {
                            label: formOptions.apartment,
                            icon: '/assets/images/content/logementAppartement.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mx-auto mt-16 flex flex-col',
                        },
                    ]}
                />
                <SelectButton
                    state={constructionYear}
                    setState={setConstructionYear}
                    wrapperStyles="flex flex-row"
                    titleLabel="Année de construction :"
                    formOptions={[
                        {
                            label: formOptions.before1950,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col mr-10 text-xs pt-10 pb-10',
                        },
                        {
                            label: formOptions.from1950to1975,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col mr-10 text-xs pt-10 pb-10',
                        },
                        {
                            label: formOptions.after1950,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col text-xs pt-10 pb-10',
                        },
                    ]}
                />
                <SelectButton
                    state={residenceType}
                    setState={setResidenceType}
                    wrapperStyles="flex flex-row"
                    titleLabel="Type de résidence :"
                    formOptions={[
                        {
                            label: formOptions.main,
                            icon: 'flag',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 mx-auto max-h-40 mt-16 mr-10 text-xs pt-12 pb-12',
                        },
                        {
                            label: formOptions.secondary,
                            icon: 'golf_course',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 max-h-40 mx-auto mt-16 text-xs',
                        },
                    ]}
                />
                <div className="flex flex-row select flex justify-between mb-20 mt-10">
                    <div className="mt-14 mr-10">
                        {formatMessage({
                            id: 'Je connais mon DPE :',
                            defaultMessage: 'Je connais mon DPE :',
                        })}
                    </div>
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                        <FormControlLabel
                            value="oui"
                            control={<Radio color="primary" />}
                            label="Oui"
                            onClick={() => setIsDPE(true)}
                            checked={isDPE}
                        />
                        <FormControlLabel
                            value="non"
                            control={<Radio color="primary" />}
                            label="Non"
                            onClick={() => setIsDPE(false)}
                            checked={!isDPE}
                        />
                    </RadioGroup>
                </div>
                {isDPE ? (
                    <FormControl fullWidth>
                        <InputLabel id="energeticPerformance">{formOptions.energeticPerformance}</InputLabel>
                        <Select
                            labelId={formOptions.energeticPerformance}
                            id={formOptions.energeticPerformance}
                            value={energeticPerformance}
                            label={formOptions.energeticPerformance}
                            onChange={(event) => handleChange(event, setEnergeticPerformance)}
                        >
                            {performanceOptions.map((performance) => {
                                return <MenuItem value={performance}>{performance}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                ) : (
                    <div>
                        <FormControl fullWidth>
                            <InputLabel id="isolation">{formOptions.isolation}</InputLabel>
                            <Select
                                labelId={formOptions.isolation}
                                id={formOptions.isolation}
                                value={isolation}
                                label={formOptions.isolation}
                                onChange={(event) => handleChange(event, setIsolation)}
                            >
                                {isolationOptions.map((isolation) => {
                                    return <MenuItem value={isolation}>{isolation}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>
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
                            // disabled={!isEdit}
                            type="number"
                            name="phone"
                            label={formatMessage({
                                id: 'Habitants',
                                defaultMessage: 'Habitants',
                            })}

                            // validateFunctions={[requiredBuilder(), min(10), max(10)]}
                        />
                    </div>
                </div>
                <div className="flex flex-row flex justify-between ">
                    <div className="mt-16 mr-10 w-full ">
                        {formatMessage({
                            id: 'Superficie du logements :',
                            defaultMessage: 'Superficie du logements :',
                        })}
                    </div>
                    <div className="w-4/6">
                        <TextField
                            // disabled={!isEdit}
                            type="number"
                            name="Superficie"
                            label={formatMessage({
                                id: 'Superficie',
                                defaultMessage: 'Superficie',
                            })}
                            // validateFunctions={[requiredBuilder(), min(10), max(10)]}
                        />
                    </div>
                    <div className="mt-16 ml-8  ">
                        {formatMessage({
                            id: 'm²',
                            defaultMessage: 'm²',
                        })}
                    </div>
                </div>
            </div>
        </Form>
    )
}
