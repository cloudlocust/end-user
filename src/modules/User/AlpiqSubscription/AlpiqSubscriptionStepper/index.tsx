import { Stepper, Step, StepLabel } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { AlpiqSubscriptionStepsEnum } from 'src/modules/User/AlpiqSubscription/index.d'
import { alpha, useTheme } from '@mui/material/styles'
import { primaryMainColor } from 'src/modules/utils/muiThemeVariables'
import PdlVerificationForm from 'src/modules/User/AlpiqSubscription/PdlVerificationForm'
import { useIntl } from 'react-intl'
import { FuseCard } from 'src/modules/shared/FuseCard'
import SgeConsentStep from 'src/modules/User/AlpiqSubscription/SgeConsentStep'
import ContractEstimation from '../ContractEstimation'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FacturationForm } from '../FacturationForm'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { Dispatch, RootState } from 'src/redux'
import { useDispatch, useSelector } from 'react-redux'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { ButtonLoader } from 'src/common/ui-kit'
import Divider from '@mui/material/Divider'
import { SectionText } from '../FacturationForm/utils'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import { useHousingRedux } from 'src/modules/MyHouse/utils/MyHouseHooks'
import { useHistory } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'

/**
 * Steps labels.
 */
export const stepsLabels = ['Mon logement', 'Mon historique', 'Mon Contrat', 'Facturation']

/**
 * Energy Provider Subscription Stepper for Alpic.
 *
 * @returns JSX Element.
 */
const AlpiqSubscriptionStepper = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { currentHousing, alpiqSubscriptionSpecs } = useSelector(({ housingModel }: RootState) => housingModel)
    const [isPageLoading, setIsPageLoading] = useState(true)
    const initialMount = useRef(true)
    const initialMountConsent = useRef(true)
    const [activeStep, setActiveStep] = React.useState(AlpiqSubscriptionStepsEnum.firstStep)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const { enedisSgeConsent, getConsents, consentsLoading } = useConsents()
    const { setDefaultHousingModel } = useHousingRedux()
    const dispatch = useDispatch<Dispatch>()
    const history = useHistory()

    useEffect(() => {
        if (initialMountConsent.current && currentHousing) {
            getConsents(currentHousing.id)
            initialMountConsent.current = false
        }
    }, [getConsents, currentHousing])

    // TODO - add tests for this part like the one in App.test.tsx
    useEffect(() => {
        if (
            initialMount.current &&
            currentHousing &&
            !consentsLoading &&
            (currentHousing.meter ? enedisSgeConsent !== undefined : true)
        ) {
            if (alpiqSubscriptionSpecs) setActiveStep(AlpiqSubscriptionStepsEnum.forthStep)
            else if (enedisSgeConsent?.enedisSgeConsentState === 'CONNECTED')
                setActiveStep(AlpiqSubscriptionStepsEnum.thridStep)
            else if (currentHousing?.meter?.guid) setActiveStep(AlpiqSubscriptionStepsEnum.secondStep)
            initialMount.current = false
            setIsPageLoading(false)
        }
    }, [currentHousing, enedisSgeConsent, alpiqSubscriptionSpecs, consentsLoading])

    /**
     * Next Step callback.
     */
    const handleNext = async () => {
        if (activeStep === AlpiqSubscriptionStepsEnum.secondStep) await getConsents(currentHousing?.id)
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    /**
     * Previous Step callback.
     */
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const stepsContent = [
        <PdlVerificationForm handleNext={handleNext} />,
        <SgeConsentStep handleBack={handleBack} handleNext={handleNext} />,
        <ContractEstimation handleNext={handleNext} enedisSgeConsent={enedisSgeConsent} />,
        <FacturationForm handleBack={handleBack} />,
    ]
    return (
        <div className="w-full mt-40 flex flex-col justify-center items-center">
            <Stepper
                className="w-5/6 mb-16"
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    '& .MuiStepConnector-root.Mui-active': {
                        '& .MuiStepConnector-line': {
                            borderColor: primaryMainColor, // Step Connector (ACTIVE)
                        },
                    },
                    '& .MuiStepConnector-root.Mui-completed': {
                        '& .MuiStepConnector-line': {
                            borderColor: primaryMainColor, // Step Connector (COMPLETED)
                        },
                    },
                }}
            >
                {stepsLabels.map((label, index) => (
                    <Step
                        key={label}
                        sx={{
                            '& .MuiStepContent-root': {
                                borderLeftColor: primaryMainColor, // Step Content Indicator Line (ACTIVE)
                            },
                            '& .MuiStepLabel-root .Mui-completed': {
                                color: primaryMainColor, // circle color (COMPLETED)
                            },
                            '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                                color: primaryMainColor, // Just text label (COMPLETED)
                            },
                            '& .MuiStepLabel-root .Mui-active': {
                                color: primaryMainColor, // circle color (ACTIVE)
                            },
                            '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                                color: primaryMainColor, // Just text label (ACTIVE)
                            },
                            '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                fill: primaryMainColor, // circle's number (ACTIVE)
                            },
                        }}
                    >
                        <StepLabel>
                            {(index === activeStep || !isMobile) &&
                                formatMessage({
                                    id: label,
                                    defaultMessage: label,
                                })}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <FuseCard
                className="rounded p-16 w-5/6 md:w-1/2 mx-auto"
                sx={{
                    border: alpha(theme.palette.primary.light, 0.1),
                    minHeight: '350px',
                }}
            >
                {isPageLoading ? (
                    <FuseLoading />
                ) : (
                    <>
                        <CardContent className="mx-auto w-full"> {stepsContent[activeStep]}</CardContent>
                        <Divider className="mt-20 mb-20" />
                        <CardActions className="w-full flex flex-col justify-center items-center">
                            <div className="w-full flex items-center justify-center mb-12 text-center">
                                <TypographyFormatMessage variant="caption" sx={{ color: textNrlinkColor }}>
                                    Votre souscription est sauvegardée, vous pouvez la reprendre à tout moment.
                                </TypographyFormatMessage>
                            </div>
                            <div className="flex md:flex-row flex-col justify-center items-center w-full">
                                <SectionText
                                    text="Pour toutes questions, contactez notre équipe"
                                    textColor={theme.palette.common.black}
                                    className="font-semibold mb-10 md:mb-0 mr-0 md:mr-10 text-center"
                                />
                                <div className="flex flex-row items-center justify-center">
                                    <ButtonLoader variant="text" className="mr-0 md:mr-10">
                                        06.75.08.20.15
                                    </ButtonLoader>
                                    <ButtonLoader variant="text">info@bowatts.fr</ButtonLoader>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-center">
                                <ButtonLoader
                                    variant="text"
                                    className="mr-0 md:mr-10"
                                    onClick={() => {
                                        // Reset Housing Model when logging out.
                                        setDefaultHousingModel()
                                        dispatch.userModel.logout()
                                        history.replace('/login')
                                    }}
                                    endIcon={<LogoutIcon />}
                                >
                                    Me déconnecter
                                </ButtonLoader>
                            </div>
                        </CardActions>
                    </>
                )}
            </FuseCard>
        </div>
    )
}

export default AlpiqSubscriptionStepper
