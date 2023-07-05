import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIntl } from 'react-intl'
import { isUndefined } from 'lodash'
import { linkyPath, electricityPath, contractPath, ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import TextFieldMui from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { TextField } from 'src/common/ui-kit'
import { Form, max, min, requiredBuilder } from 'src/common/react-platform-components'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import { MeterStepNrLinkConnectionFormProps } from './MeterStepNrLinkConnectionForm.d'
import AddHousingModal from 'src/modules/Layout/Toolbar/components/AddHousingModal'

/**
 * Component showing the first step in the nrLinkConnection Stepper.
 *
 * @param props N/A.
 * @param props.handleBack HandleBack.
 * @param props.handleNext HandleNext.
 * @param props.setMeter Handler to set the newMeter or selected meter from the AutoComplete Options .
 * @param props.meter The selectedMeter.
 * @param props.housingId The Id of the housing.
 * @returns MeterStepNrLinkConnectionForm.
 */
const MeterStepNrLinkConnectionForm = ({
    handleBack,
    handleNext,
    setMeter,
    meter,
    housingId,
}: MeterStepNrLinkConnectionFormProps) => {
    const { formatMessage } = useIntl()
    const [modalAddHousingOpen, setModalAddHousingOpen] = useState(isUndefined(housingId))

    const { addMeter, loadingInProgress: loadingMeterInProgress } = useMeterForHousing()

    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param data Name and Guid of the new meter.
     * @param data.guid Guid.
     * @returns New Meter.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    const onSubmit = async (data: { guid: string }) => {
        try {
            if (meter) {
                // this means that the meter is already existing.
                handleNext()
                return
            }
            if (housingId) {
                // if it does not exist and there is a valid housing id (if the user has no housing and access to this page by the url)
                const newMeter = await addMeter(housingId, data)
                if (newMeter) {
                    setMeter(newMeter)
                    handleNext()
                }
            }
            // Catch error so that don't crash the application when response error.
        } catch (error) {}
    }
    return (
        <Form onSubmit={onSubmit}>
            <AddHousingModal
                modalOpen={modalAddHousingOpen}
                closeModal={() => setModalAddHousingOpen(false)}
                disableBackdropClick={true}
            />
            <div className="flex justify-between items-center landscape:mt-10 w-full">
                <div className="portrait:flex-col landscape:flex-row h-full flex justify-center items-center w-full">
                    <div className="w-full mx-32 ">
                        {meter ? (
                            <TextFieldMui
                                value={meter.guid}
                                disabled
                                name="guid"
                                style={{ marginBottom: '20px' }}
                                fullWidth
                                label="Numéro de mon compteur (PDL ou PRM)"
                                placeholder="Ex: 12345678912345"
                                variant="outlined"
                            />
                        ) : (
                            <TextField
                                name="guid"
                                label="Numéro de mon compteur (PDL ou PRM)"
                                placeholder="Ex: 12345678912345"
                                validateFunctions={[requiredBuilder(), min(14), max(14)]}
                            />
                        )}
                    </div>
                    <div className="w-full">
                        <Typography variant="caption" className="w-full text-center" sx={{ color: textNrlinkColor }}>
                            {formatMessage({
                                id: 'Vous pouvez trouver votre numéro de PDL/PRM :',
                                defaultMessage: 'Vous pouvez trouver votre numéro de PDL/PRM :',
                            })}
                        </Typography>
                        <div className="flex justify-between items-start mt-7 mb-5">
                            <div className="flex justify-between w-full items-center flex-col mb-5 mr-10 sm:mr-0">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mr-8 mb-5"
                                >
                                    <img src={electricityPath} alt="electricity-img" className="border p-5" />
                                </motion.div>
                                <Typography
                                    variant="caption"
                                    className="text-center md:text-12"
                                    sx={{ color: textNrlinkColor }}
                                >
                                    {formatMessage({
                                        id: 'Vos factures',
                                        defaultMessage: 'Vos factures',
                                    })}
                                </Typography>
                            </div>
                            <div className="flex justify-between w-full items-center flex-col mb-5 mr-10 sm:mr-0">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mb-5 mr-8"
                                >
                                    <img src={linkyPath} alt="electricity-img" className="border p-6" />
                                </motion.div>

                                <Typography
                                    variant="caption"
                                    className="text-center md:text-12"
                                    sx={{ color: textNrlinkColor }}
                                >
                                    {formatMessage({
                                        id: 'Votre compteur Linky en appuyant sur “+” (n° PDL ou PRM)',
                                        defaultMessage: 'Votre compteur Linky en appuyant sur “+” (n° PDL ou PRM)',
                                    })}
                                </Typography>
                            </div>
                            <div className="flex justify-between w-full items-center flex-col mb-5 ">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center w-full mb-5 mr-8"
                                >
                                    <img src={contractPath} alt="electricity-img" className="border p-5" />
                                </motion.div>
                                <Typography
                                    variant="caption"
                                    className="w-full text-center md:text-12"
                                    sx={{ color: textNrlinkColor }}
                                >
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

export default MeterStepNrLinkConnectionForm
