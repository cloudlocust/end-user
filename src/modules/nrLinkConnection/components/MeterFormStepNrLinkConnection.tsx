import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useIntl } from 'react-intl'
import { linkyPath, electricityPath, contractPath, ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { TextField } from 'src/common/ui-kit'
import TextFieldMui from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Form, max, min, requiredBuilder } from 'src/common/react-platform-components'
import { useMeterList } from 'src/modules/Meters/metersHook'
import Autocomplete from '@mui/material/Autocomplete'
import { IMeter } from 'src/modules/Meters/Meters'

/**
 * Component showing the first step in the nrLinkConnection Stepper.
 *
 * @param props N/A.
 * @param props.handleBack HandleBack.
 * @param props.handleNext HandleNext.
 * @param props.setMeter Handler to set the newMeter or selected meter from the AutoComplete Options .
 * @param props.meter The selectedMeter.
 * @returns MeterFormStepNrLinkConnection.
 */
const MeterFormStepNrLinkConnection = ({
    handleBack,
    handleNext,
    setMeter,
    meter,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleNext: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    setMeter: React.Dispatch<React.SetStateAction<IMeter | null>>
    // eslint-disable-next-line jsdoc/require-jsdoc
    meter: IMeter | null
}) => {
    const { formatMessage } = useIntl()
    const {
        elementList: meterList,
        addElement: addMeter,
        loadingInProgress: loadingMeterInProgress,
    } = useMeterList(1000)

    // Todo handle in a better way the AutoComplete TextField (a reusable component).
    const [meterName, setMeterName] = useState('')
    const [meterNameError, setMeterNameError] = useState(false)
    /**
     * Handle MeterName Change function.
     *
     * @param newVal New Val of Meter Name Field.
     */
    const handleMeterNameChange = (newVal: string) => {
        if (newVal) setMeterNameError(false)
        else setMeterNameError(true)
        setMeterName(newVal)
    }
    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param formData FormData which consists of guid only.
     * @param formData.guid Guid Field value.
     * @returns If meterName exit function.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmit = async ({ guid }: { guid: string }) => {
        try {
            if (meter) {
                handleNext()
                return
            }
            if (!meterName) {
                setMeterNameError(true)
                return
            }
            const data = { guid, name: meterName }
            const newMeter = await addMeter(data)
            setMeter(newMeter)
            handleNext()
            // Catch error so that don't crash the application when response error.
        } catch (error) {}
    }
    return (
        <Form onSubmit={onSubmit}>
            <div className="flex justify-between items-center landscape:mt-10">
                <div className="portrait:flex-col landscape:flex-row h-full flex justify-center items-center w-full">
                    <div className="w-full mr-10  max-w-640">
                        <Autocomplete
                            id="name-autocomplete"
                            className="mb-20"
                            freeSolo
                            data-testid="MeterNameAutoCompleteField"
                            onBlur={(e) =>
                                // Required validation when first focus on the field.
                                !meterName && setMeterNameError(true)
                            }
                            onChange={(e, value) => {
                                setMeter(value as IMeter | null)
                            }}
                            onInputChange={
                                // eslint-disable-next-line jsdoc/require-jsdoc
                                (e, value) => {
                                    setMeter(null)
                                    handleMeterNameChange(value || '')
                                }
                            }
                            getOptionLabel={(option) => option.name}
                            options={meterList ? meterList : []}
                            renderInput={(params) => (
                                <TextFieldMui
                                    {...params}
                                    value={meterName}
                                    error={meterNameError}
                                    helperText={
                                        meterNameError &&
                                        formatMessage({
                                            id: `Champ obligatoire non renseigné`,
                                            defaultMessage: `Champ obligatoire non renseigné`,
                                        })
                                    }
                                    name="name"
                                    label="Nom de mon compteur"
                                    variant="outlined"
                                />
                            )}
                        />
                        {meter ? (
                            <TextFieldMui
                                value={meter.guid}
                                disabled
                                name="guid"
                                style={{ marginBottom: '20px', width: '100%' }}
                                label="Numéro de mon compteur"
                                variant="outlined"
                            />
                        ) : (
                            <TextField
                                name="guid"
                                label="Numéro de mon compteur"
                                validateFunctions={[requiredBuilder(), min(14), max(14)]}
                            />
                        )}
                    </div>
                    <div className="w-full max-w-640">
                        <Typography variant="caption" className="w-full text-center mb-7">
                            {formatMessage({
                                id: 'Vous pouvez trouver votre numéro de compteur sur :',
                                defaultMessage: 'Vous pouvez trouver votre numéro de compteur sur :',
                            })}
                        </Typography>
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex justify-between w-full items-center flex-col mb-5">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mr-8"
                                >
                                    <img src={electricityPath} alt="electricity-img" />
                                </motion.div>
                                <Typography variant="caption" className="text-center">
                                    {formatMessage({
                                        id: 'Vos Factures',
                                        defaultMessage: 'Vos Factures',
                                    })}
                                </Typography>
                            </div>
                            <div className="flex justify-between w-full items-center flex-col mb-5">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mr-8"
                                >
                                    <img src={linkyPath} alt="electricity-img" />
                                </motion.div>

                                <Typography variant="caption" className="text-center">
                                    {formatMessage({
                                        id: 'Votre Linky en appuyant sur “+” (n°PRM)',
                                        defaultMessage: 'Votre Linky en appuyant sur “+” (n°PRM)',
                                    })}
                                </Typography>
                            </div>
                            <div className="flex justify-between w-full items-center flex-col mb-5">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mr-8"
                                >
                                    <img src={contractPath} alt="electricity-img" />
                                </motion.div>
                                <Typography variant="caption" className="w-full text-center">
                                    {formatMessage({
                                        id: 'Votre contrat d’électricité',
                                        defaultMessage: 'Votre contrat d’électricité',
                                    })}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ActionsNrLinkConnectionSteps
                activeStep={1}
                handleBack={handleBack}
                inProgress={loadingMeterInProgress}
                handleNext={() => {}}
            />
        </Form>
    )
}

export default MeterFormStepNrLinkConnection
