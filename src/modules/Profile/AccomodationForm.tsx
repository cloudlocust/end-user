import React, { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
// import { ButtonLoader, TextField } from 'src/common/ui-kit'
import TextField from '@mui/material/TextField'
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

const formOptions = {
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
const performanceOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const isolationOptions = ['Faible', 'Moyenne', 'Forte']

/**
 * Handle change select menu.
 *
 * @param event Select Change Event.
 * @param setState Set selected value.
 * @param setEmptyState Set empty value in unused field.
 */
const handleChange = (
    event: SelectChangeEvent<string>,
    setState: (value: React.SetStateAction<string>) => void,
    setEmptyState: (value: React.SetStateAction<string>) => void,
) => {
    setState(event.target.value)
    setEmptyState('')
}
/**
 * @param root0
 * @param root0.enableForm
 * @param root0.onSubmit
 * @param root0.isEdit
 */
export const AccomodationForm = ({ enableForm, onSubmit, isEdit }: IAccomodationForm) => {
    const { formatMessage } = useIntl()

    const [logement, setLogement] = useState(formOptions.house)
    const [constructionYear, setConstructionYear] = useState(formOptions.before1950)
    const [residenceType, setResidenceType] = useState(formOptions.main)
    const [isDPE, setIsDPE] = useState(true)
    const [energeticPerformance, setEnergeticPerformance] = useState('')
    const [isolation, setIsolation] = useState('')
    const disabledField = false // !isEdit

    const [blurredFields, setBlurredFields] = useState({
        logement: logement,
        constructionYear: constructionYear,
        residenceType: residenceType,
        isDPE: isDPE ? 'oui' : 'non',
        energeticPerformance: energeticPerformance,
        isolation: isolation,
        habitants: '',
        superficie: '',
    })
    console.log('blurredFields', blurredFields)

    const handleBlur = (event: any) => {
        setBlurredFields({ ...blurredFields, [event.target.name]: event.target.value })
    }
    return (
        <Form
            // eslint-disable-next-line jsdoc/require-jsdoc
            onSubmit={() => {
                onSubmit(blurredFields)
                console.log(blurredFields)
            }}
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
                    name="logement"
                    onBlur={handleBlur}
                    formOptions={[
                        {
                            label: formOptions.house,
                            icon: '/assets/images/content/logementMaison.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mx-auto mt-16 flex flex-col mr-10',
                            isDisabled: disabledField,
                        },
                        {
                            label: formOptions.apartment,
                            icon: '/assets/images/content/logementAppartement.svg',
                            iconStyles: 'my-20',
                            buttonStyle: 'w-240 mx-auto mt-16 flex flex-col',
                            isDisabled: disabledField,
                        },
                    ]}
                />
                <SelectButton
                    state={constructionYear}
                    setState={setConstructionYear}
                    wrapperStyles="flex flex-row"
                    titleLabel="Année de construction :"
                    name="constructionYear"
                    onBlur={handleBlur}
                    formOptions={[
                        {
                            label: formOptions.before1950,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col mr-10 text-xs pt-10 pb-10',
                            name: formOptions.before1950,
                            isDisabled: disabledField,
                        },
                        {
                            label: formOptions.from1950to1975,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col mr-10 text-xs pt-10 pb-10',
                            name: formOptions.from1950to1975,
                            isDisabled: disabledField,
                        },
                        {
                            label: formOptions.after1975,
                            buttonStyle: 'w-224 mx-auto mt-16 flex flex-col text-xs pt-10 pb-10',
                            name: formOptions.after1975,
                            isDisabled: disabledField,
                        },
                    ]}
                />
                <SelectButton
                    state={residenceType}
                    setState={setResidenceType}
                    wrapperStyles="flex flex-row"
                    titleLabel="Type de résidence :"
                    name="residenceType"
                    onBlur={handleBlur}
                    formOptions={[
                        {
                            label: formOptions.main,
                            icon: 'flag',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 mx-auto max-h-40 mt-16 mr-10 text-xs pt-12 pb-12',
                            name: formOptions.main,
                            isDisabled: disabledField,
                        },
                        {
                            label: formOptions.secondary,
                            icon: 'golf_course',
                            iconStyles: 'mr-5',
                            buttonStyle: 'w-224 max-h-40 mx-auto mt-16 text-xs',
                            name: formOptions.secondary,
                            isDisabled: disabledField,
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
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="isDPE">
                        <FormControlLabel
                            value="oui"
                            control={<Radio color="primary" />}
                            label="Oui"
                            onBlur={handleBlur}
                            onClick={() => setIsDPE(true)}
                            checked={isDPE}
                            disabled={disabledField}
                        />
                        <FormControlLabel
                            value="non"
                            control={<Radio color="primary" />}
                            label="Non"
                            onBlur={handleBlur}
                            onClick={() => setIsDPE(false)}
                            checked={!isDPE}
                            disabled={disabledField}
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
                            onChange={(event) => {
                                handleChange(event, setEnergeticPerformance, setIsolation)
                            }}
                            onBlur={handleBlur}
                            name="energeticPerformance"
                            disabled={disabledField}
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
                                onChange={(event) => {
                                    handleChange(event, setIsolation, setEnergeticPerformance)
                                }}
                                onBlur={handleBlur}
                                name="isolation"
                                disabled={disabledField}
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
                            type="number"
                            name="habitants"
                            label={formatMessage({
                                id: 'Habitants',
                                defaultMessage: 'Habitants',
                            })}
                            disabled={disabledField}
                            onBlur={handleBlur}
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
                            onBlur={handleBlur}
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
        </Form>
    )
}
