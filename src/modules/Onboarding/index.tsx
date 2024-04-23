import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { Introduction } from 'src/modules/Onboarding/steps/Introduction'
import { NrLinkInstallationInstructions } from 'src/modules/Onboarding/steps/NrLinkInstallationInstructions'
import { MeterConnection } from 'src/modules/Onboarding/steps/MeterConnection'
import { NRLinkConnection } from 'src/modules/Onboarding/steps/NRLinkConnection'
import { Contract } from 'src/modules/Onboarding/steps/Contract'
import { SolarProductionConnection } from 'src/modules/Onboarding/steps/SolarProductionConnection'
import { useLocation, useHistory } from 'react-router-dom'
import { useHousingRedux } from 'src/modules/MyHouse/utils/MyHouseHooks'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useGetShowNrLinkPopupHook } from 'src/modules/nrLinkConnection/NrLinkConnectionHook'
import { isProductionActiveAndHousingHasAccess } from 'src/modules/MyHouse/MyHouseConfig'
import { URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'
import nrlinkLogo from 'src/assets/images/content/onboarding/nrlinkLogo.png'

/**
 * Steps search paths of route.
 */
export const STEPS_NAMES = {
    INTRODUCTION: 'introduction',
    NRLINK_INSTALLATION_INSTRUCTIONS: 'nrLink-installation-instructions',
    METER_CONNECTION: 'meter-connection',
    NRLINK_CONNECTION: 'nrLink-connection',
    CONTRACT: 'contract',
    SOLAR_PRODUCTION_CONNECTION: 'solar-production-connection',
}

/**
 * Onboarding used stepper to connect the meter, nrlink, solar installation.
 *
 * @returns JSX Element.
 */
export const Onboarding = () => {
    const location = useLocation()
    const history = useHistory()
    // this ones are for handling the housing id's and their speceif meters
    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const { loadHousingsAndScopes } = useHousingRedux()
    const { getConsents, enedisSgeConsent } = useConsents()
    const { isGetShowNrLinkLoading, isNrLinkPopupShowing } = useGetShowNrLinkPopupHook()
    const query = new URLSearchParams(location.search)
    const step = query.get('step')
    useEffect(() => {
        document.body.style.backgroundColor = '#fff'
        loadHousingsAndScopes()
    }, [loadHousingsAndScopes])

    useEffect(() => {
        if (currentHousing?.id) {
            getConsents(currentHousing?.id)
        }
    }, [currentHousing?.id, getConsents])

    if (isGetShowNrLinkLoading) {
        return <FuseLoading />
    }

    if (isNrLinkPopupShowing === false) {
        history.push(URL_DASHBOARD)
    }

    /**
     * Handles the next step.
     *
     * @param step - The next step.
     */
    const handleNext = (step: string) => {
        history.push(`${location.pathname}?step=${step}`)
    }

    /**
     * Redirects to the dashboard.
     */
    const redirectToDashboard = () => {
        history.push(URL_DASHBOARD)
    }

    /**
     * Renders the current step based on the value of `step`.
     *
     * @returns The current step.
     */
    const renderStep = () => {
        const introductionStep = (
            <Introduction onNext={() => handleNext(STEPS_NAMES.NRLINK_INSTALLATION_INSTRUCTIONS)} />
        )

        // eslint-disable-next-line sonarjs/no-all-duplicated-branches, sonarjs/no-small-switch
        switch (step) {
            case STEPS_NAMES.INTRODUCTION:
                return introductionStep
            case STEPS_NAMES.NRLINK_INSTALLATION_INSTRUCTIONS:
                return <NrLinkInstallationInstructions onNext={() => handleNext(STEPS_NAMES.METER_CONNECTION)} />
            case STEPS_NAMES.METER_CONNECTION:
                return (
                    <MeterConnection
                        onNext={() => handleNext(STEPS_NAMES.NRLINK_CONNECTION)}
                        meter={currentHousing?.meter!}
                        housingId={currentHousing?.id!}
                        enedisSgeConsent={enedisSgeConsent}
                        loadHousingsAndScopes={loadHousingsAndScopes}
                    />
                )
            case STEPS_NAMES.NRLINK_CONNECTION:
                return (
                    <NRLinkConnection
                        onNext={() => handleNext(STEPS_NAMES.CONTRACT)}
                        housingId={currentHousing?.id! as number}
                    />
                )
            case STEPS_NAMES.CONTRACT:
                return (
                    <Contract
                        onNext={() =>
                            isProductionActiveAndHousingHasAccess(currentHousingScopes)
                                ? handleNext(STEPS_NAMES.SOLAR_PRODUCTION_CONNECTION)
                                : redirectToDashboard()
                        }
                        housingId={currentHousing?.id!}
                    />
                )
            case STEPS_NAMES.SOLAR_PRODUCTION_CONNECTION:
                return (
                    <SolarProductionConnection onNext={() => redirectToDashboard()} housingId={currentHousing?.id!} />
                )
            default:
                return introductionStep
        }
    }

    return (
        <div
            className="flex flex-col flex-auto items-center justify-start p-16 sm:p-32"
            style={{ height: '100vh', paddingLeft: 15, paddingRight: 15, overflowX: 'hidden' }}
        >
            <div className="flex flex-col items-center justify-start w-full">
                <div style={{ alignSelf: 'self-start', paddingTop: '5px', paddingBottom: '10px' }}>
                    <img src={nrlinkLogo} alt="nrlink logo" style={{ width: 105 }} />
                </div>
                {renderStep()}
            </div>
        </div>
    )
}
