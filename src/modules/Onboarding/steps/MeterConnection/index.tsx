import { Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useIntl } from 'src/common/react-platform-translation'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { Form, regex, requiredBuilder, accept } from 'src/common/react-platform-components'
import { Step } from 'src/modules/Onboarding/components/Step'
import { ButtonLoader } from 'src/common/ui-kit'
import { TextField } from 'src/modules/Onboarding/components/TextField'
import { Checkbox } from 'src/modules/Onboarding/components/Checkbox'
import { METER_GUID_REGEX_TEXT, meteGuidNumberRegex } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { MeterVerificationEnum } from 'src/modules/Consents/Consents.d'
import {
    MeterConnectionProps,
    MeterFormSubmitParams,
} from 'src/modules/Onboarding/steps/MeterConnection/MeterConnection.types'
import { isAlpiqSubscriptionForm } from 'src/modules/User/AlpiqSubscription/index.d'
import { EnedisDistributorClientDialog } from 'src/modules/Onboarding/steps/MeterConnection/components/EnedisDistributorClientDialog'
import { useState } from 'react'

/**
 * MeterConnection component use it to set meter guid & accept the enedis consent.
 *
 * @param root0 Props.
 * @param root0.onNext Callback on next step.
 * @param root0.meter Current meter.
 * @param root0.housingId Housing id.
 * @param root0.enedisSgeConsent Enedis Sge Consent.
 * @param root0.loadHousingsAndScopes Load housings and scopes.
 * @returns MeterConnection component.
 */
export const MeterConnection = ({
    onNext,
    meter: currentMeter,
    housingId,
    enedisSgeConsent,
    loadHousingsAndScopes,
}: MeterConnectionProps) => {
    const { formatMessage } = useIntl()
    const { addMeter, editMeter, loadingInProgress: loadingMeterInProgress } = useMeterForHousing()
    const { createEnedisSgeConsent, isCreateEnedisSgeConsentLoading, verifyMeter, isMeterVerifyLoading } = useConsents()
    const [meterVerificationStatus, setMeterVerificationStatus] = useState<MeterVerificationEnum | null>(null)
    const { enqueueSnackbar } = useSnackbar()

    /**
     * Make Enedis Sge Consent.
     */
    const makeEnedisSgeConsent = async () => {
        verifyMeter(housingId, (meterStatus) => {
            if (meterStatus === MeterVerificationEnum.VERIFIED) {
                createEnedisSgeConsent(housingId, () => {
                    onNext()
                })
            } else {
                setMeterVerificationStatus(MeterVerificationEnum.NOT_VERIFIED)
            }
        })
    }
    /**
     * On Submit function which calls addMeter and handleNext on success.
     *
     * @param data Name and Guid of the new meter.
     * @param data.guid Guid.
     * @returns New Meter.
     */
    const onSubmit = async (data: MeterFormSubmitParams) => {
        try {
            if (housingId) {
                if (currentMeter?.guid !== data.guid) {
                    // Update or create new meter if does not exist.
                    const newMeter = await (currentMeter ? editMeter : addMeter)(housingId, { guid: data.guid })
                    loadHousingsAndScopes()
                    if (newMeter) {
                        await makeEnedisSgeConsent()
                    }
                } else if (enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED') {
                    await makeEnedisSgeConsent()
                }
            }
            // Catch error so that don't crash the application when response error.
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: "Une erreur est survenue lors de l'ajout de votre compteur. Veuillez réessayer.",
                    defaultMessage: "Une erreur est survenue lors de l'ajout de votre compteur. Veuillez réessayer.",
                }),
                { autoHideDuration: 10000, variant: 'error' },
            )
        }
    }
    /**
     * Handle the confirmation of usage of enedis distributor used when the meter guid not verified.
     *
     * @param value True if the user is client of enedis, false otherwise.
     */
    const onConfirmationOfUsageOfEnedisDistributor = async (value: boolean) => {
        // if the user is not client of enedis we remove its meter.
        if (!value) {
            // await deleteMeter(housingId)
            await editMeter(housingId, { guid: '' })
        }
        onNext()
    }

    const consentNotCheckedErrorMessage = formatMessage({
        id: "Veuillez cocher la case pour confirmer que vous autorisez l'accès à votre historique Linky afin de bénéficier de toutes nos fonctionnalités.",
        defaultMessage:
            "Veuillez cocher la case pour confirmer que vous autorisez l'accès à votre historique Linky afin de bénéficier de toutes nos fonctionnalités.",
    })

    return (
        <Step
            title={formatMessage(
                {
                    id: '{step}/{totalStep}: La vie antérieure...',
                    defaultMessage: '{step}/{totalStep}: La vie antérieure...',
                },
                { step: 2, totalStep: 4 },
            )}
            content={
                <Form
                    aria-label="ReplaceNRLinkForm"
                    onSubmit={onSubmit}
                    style={{ display: 'inherit', flexDirection: 'inherit', alignItems: 'inherit' }}
                    defaultValues={{
                        guid: currentMeter?.guid || '',
                        enedisSgeConsentStatus: enedisSgeConsent?.enedisSgeConsentState === 'CONNECTED',
                    }}
                >
                    <Typography variant="subtitle1" className="mt-76" sx={{ color: 'primary.main' }}>
                        {formatMessage({
                            id: 'Pour lier votre logement à l’application, saisissez ici votre N° de PDL :',
                            defaultMessage: 'Pour lier votre logement à l’application, saisissez ici votre N° de PDL :',
                        })}
                    </Typography>
                    <TextField
                        name="guid"
                        placeholder="Example: 19437481274634"
                        inputProps={{ maxLength: 14, style: { height: 15, width: '100%' } }}
                        className="mt-10"
                        aria-describedby="pdl-number-text-helper"
                        validateFunctions={[requiredBuilder(), regex(meteGuidNumberRegex, METER_GUID_REGEX_TEXT)]}
                        label=""
                        fullWidth={true}
                        disabled={isAlpiqSubscriptionForm}
                    />
                    <Typography variant="body2" className="mt-3" sx={{ color: 'grey.500' }}>
                        {formatMessage({
                            id: 'Votre N° PDL (point de livraison) est visible sur votre facture d’électricité ou sur votre compteur',
                            defaultMessage:
                                'Votre N° PDL (point de livraison) est visible sur votre facture d’électricité ou sur votre compteur',
                        })}
                    </Typography>

                    <Checkbox
                        name="enedisSgeConsentStatus"
                        label={
                            <Typography variant="body1" className="mt-6" sx={{ color: 'primary.main' }}>
                                {formatMessage({
                                    id: 'Pour sortir les 3 dernières années données de votre Linky du placard et bénéficier de toutes nos fonctionnalités, j’autorise l’accès à mon historique.',
                                    defaultMessage:
                                        'Pour sortir les 3 dernières années données de votre Linky du placard et bénéficier de toutes nos fonctionnalités, j’autorise l’accès à mon historique.',
                                })}
                            </Typography>
                        }
                        formControlLabelProps={{ className: 'flex items-start mt-16' }}
                        validate={[
                            accept(consentNotCheckedErrorMessage),
                            requiredBuilder(consentNotCheckedErrorMessage),
                        ]}
                        disabled={isAlpiqSubscriptionForm}
                        data-testid="enedisSgeConsentStatus"
                    />

                    <div className="mt-20 self-end">
                        <ButtonLoader
                            variant="contained"
                            className="w-128 rounded-8"
                            disableElevation={true}
                            disableRipple={true}
                            type="submit"
                            inProgress={
                                loadingMeterInProgress || isMeterVerifyLoading || isCreateEnedisSgeConsentLoading
                            }
                        >
                            {formatMessage({ id: 'Suivant', defaultMessage: 'Suivant' })}
                        </ButtonLoader>
                    </div>
                    {/* todo: add image of meter here later */}
                    {/* <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex w-320 rounded-16 mt-20"
                    >
                        <img src="" className="rounded-32" alt="meter guid" />
                    </motion.div> */}
                    <Typography variant="subtitle1" className="mt-16 mb-52" sx={{ color: 'grey.500' }}>
                        {formatMessage(
                            {
                                id: '{icon} Chez nous, vos données sont gardées sous haute tension, pas de court-circuit de confidentialité ici ! Ni partagées, ni vendues !',
                                defaultMessage:
                                    '{icon} Chez nous, vos données sont gardées sous haute tension, pas de court-circuit de confidentialité ici ! Ni partagées, ni vendues !',
                            },
                            {
                                icon: (
                                    <span
                                        style={{
                                            fontSize: '60px',
                                            marginBottom: '0',
                                            paddingBottom: '0',
                                            lineHeight: '50px',
                                            marginRight: -1,
                                        }}
                                    >
                                        ☺
                                    </span>
                                ),
                            },
                        )}
                    </Typography>
                    <EnedisDistributorClientDialog
                        isOpening={meterVerificationStatus === MeterVerificationEnum.NOT_VERIFIED}
                        onConfirmationOfUsageOfEnedisDistributor={onConfirmationOfUsageOfEnedisDistributor}
                        onCancel={() => setMeterVerificationStatus(null)}
                    />
                </Form>
            }
        />
    )
}
