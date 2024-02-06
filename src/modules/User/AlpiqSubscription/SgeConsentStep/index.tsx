import { useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { EnedisSgePopup } from 'src/modules/MyHouse/components/MeterStatus/EnedisSgePopup'
import { RootState } from 'src/redux'
import { useIntl } from 'react-intl'
import { useConsents } from 'src/modules/Consents/consentsHook'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'

/**
 * Sge Consent Step.
 *
 * @param props Props.
 * @param props.handleBack Handle back button callback.
 * @returns JSX Element.
 */
const SgeConsentStep = ({
    handleBack,
}: /**
 *
 */
{
    /**
     * Handle back.
     */
    handleBack: () => void
}) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    // TODO - in next story we might need to use enedisSgeConsent to check if it's valide or not to skip this step
    const { createEnedisSgeConsent, isCreateEnedisSgeConsentLoading, createEnedisSgeConsentError } = useConsents()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    return (
        <div className="flex flex-col justify-center">
            <div className="flex justify-center w-full mb-32">
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    textAlign="center"
                    variant={isMobile ? 'body1' : 'h6'}
                    fontWeight={600}
                >
                    Intégrons votre historique de consommation à votre espace personnel
                </TypographyFormatMessage>
            </div>
            <div className="flex flex-col justify-start items-center">
                <TypographyFormatMessage
                    color={theme.palette.text.primary}
                    className="mb-16"
                    variant={isMobile ? 'caption' : 'body1'}
                    fontWeight={500}
                >
                    Pour afficher vos consommations passées dans votre espace personnel, nous avons besoins que vous
                    activiez la récupération de votre historique :
                </TypographyFormatMessage>
            </div>
            <div className="flex w-full justify-center mt-32 mb-16">
                <Button variant="outlined" className="mr-10" onClick={() => handleBack()}>
                    {formatMessage({
                        id: 'Retour',
                        defaultMessage: 'Retour',
                    })}
                </Button>
                <EnedisSgePopup
                    openEnedisSgeConsentText={formatMessage({
                        id: 'Récupérer Mes Données',
                        defaultMessage: 'Récupérer Mes Données',
                    })}
                    TypographyProps={{
                        color: theme.palette.primary.main,
                    }}
                    houseId={currentHousing?.id}
                    createEnedisSgeConsent={createEnedisSgeConsent}
                    createEnedisSgeConsentError={createEnedisSgeConsentError}
                    isCreateEnedisSgeConsentLoading={isCreateEnedisSgeConsentLoading}
                    isElementButton={true}
                />
            </div>
            <TypographyFormatMessage
                className="mb-16"
                variant="caption"
                sx={{ color: textNrlinkColor }}
                fontSize={isMobile ? '0.9rem' : undefined}
            >
                * Pas d’inquiétude, vos données restent entre vous et nous, elles ne seront jamais transmises à des
                tiers.
            </TypographyFormatMessage>
        </div>
    )
}

export default SgeConsentStep
