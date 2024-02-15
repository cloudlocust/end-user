import { useTheme, Card } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Form } from 'src/common/react-platform-components'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import MenuItem from '@mui/material/MenuItem'
import {
    AlpiqContractTypeSelectOptions,
    AlpiqContractTypeSelectOptionsType,
    AlpiqPowerValuesSelectOptions,
} from './index.types'
import { ButtonLoader } from 'src/common/ui-kit'
import { NavigateNext } from '@mui/icons-material'
import { useState } from 'react'
import { useAlpiqProvider } from 'src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'

/**
 * ContractEstimation step in alpiq.
 *
 * @param props Props.
 * @param props.handleNext Handle next Step.
 * @returns JSX Element.
 */
const ContractEstimation = ({
    /**
     * HandleNext.
     */
    handleNext,
}: /**
 */ {
    /**
     * Handle next.
     */
    handleNext: () => void
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { formatMessage } = useIntl()
    const [monthlyEstimation, setMonthlyEstimation] = useState<number | undefined>(undefined)
    const { getMonthlySubscriptionEstimation, loadingInProgress } = useAlpiqProvider()

    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    /**
     * On Submit function.
     *
     * @param data Data to send.
     * @param data.contractType Contract Type.
     * @param data.power Power.
     * @returns Void.
     */
    const onSubmit = async (data: /**
     */ {
        /**
         * Contract type.
         */
        contractType: 'BASE' | 'HPHC'
        /**
         * Power.
         */
        power: number
    }) => {
        const monthlyEstimationResponse: number | undefined = await getMonthlySubscriptionEstimation(
            data.power,
            data.contractType,
            currentHousing?.id,
        )

        if (monthlyEstimationResponse) {
            setMonthlyEstimation(monthlyEstimationResponse)
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-start">
            <div className={`flex items-center justify-center mb-32 md:mb-48 ${isMobile && 'flex-col'}`}>
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    textAlign="center"
                    variant={isMobile ? 'body1' : 'h6'}
                    fontWeight={600}
                >
                    {`Mon contrat BôWatts par alpiq ${!isMobile ? "L'electricité verte de beaujolais" : ''}`}
                </TypographyFormatMessage>
                {isMobile && (
                    <TypographyFormatMessage
                        color={theme.palette.primary.main}
                        textAlign="center"
                        variant={isMobile ? 'body1' : 'h6'}
                        fontWeight={600}
                    >
                        L'electricité verte de beaujolais
                    </TypographyFormatMessage>
                )}
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col w-full items-center mb-20 mx-0 md:mx-20">
                    <div className="w-full flex-col mb-12 md:mb-24">
                        <TypographyFormatMessage
                            color={theme.palette.primary.main}
                            textAlign="center"
                            variant="body1"
                            fontWeight={600}
                        >
                            Paramétrez votre contrat Alpiq:
                        </TypographyFormatMessage>
                        <Form onSubmit={onSubmit}>
                            <div className="flex w-full flex-col md:flex-row items-center justify-start">
                                <SelectAlpiqContractForm
                                    title="Type de contrat"
                                    options={AlpiqContractTypeSelectOptions}
                                    name="contractType"
                                />
                                <SelectAlpiqContractForm
                                    title="Puissance"
                                    options={AlpiqPowerValuesSelectOptions}
                                    name="power"
                                />
                                <div className="flex items-center justify-center flex-1 mx-10">
                                    <ButtonLoader inProgress={loadingInProgress} type="submit">
                                        Estimer ma mensualité
                                    </ButtonLoader>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                <div
                    className={`w-full flex ${
                        isMobile ? 'flex-col items-center justify-center' : 'flex-row items-end justify-between mb-20'
                    }`}
                >
                    <Card
                        className={`rounded-16 border border-slate-600 bg-gray-50 mx-0 md:mx-20 w-full h-200 md:h-200 md:w-400 flex flex-col justify-center ${
                            isMobile && 'mb-20'
                        }`}
                    >
                        <div className="flex flex-col items-start justify-between ml-10 mb-24">
                            <TypographyFormatMessage
                                color={theme.palette.primary.main}
                                textAlign="center"
                                variant="h6"
                                className="mb-12"
                            >
                                Votre mensualité:
                            </TypographyFormatMessage>
                            <TypographyFormatMessage
                                variant={isMobile ? 'body2' : 'body1'}
                                color={theme.palette.common.black}
                                fontWeight={400}
                            >
                                Mensualité calculée à partir de votre historique de consommation.
                            </TypographyFormatMessage>
                        </div>
                        <TypographyFormatMessage color={theme.palette.primary.main} textAlign="center" variant="h6">
                            {`${monthlyEstimation ?? '--'} €TTC/Mois`}
                        </TypographyFormatMessage>
                    </Card>
                    <div className={`${!isMobile ? 'px-20' : 'w-full'} flex justify-end items-center`}>
                        <ButtonLoader
                            disabled={monthlyEstimation === undefined}
                            color="primary"
                            endIcon={<NavigateNext />}
                            onClick={() => handleNext()}
                        >
                            {formatMessage({
                                id: 'Continuer',
                                defaultMessage: 'Continuer',
                            })}
                        </ButtonLoader>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContractEstimation

/**
 * Custom Select for Alpiq contract form.
 *
 * @param props Props.
 * @param props.title Title of placeholder.
 * @param props.options Available Options.
 * @param props.name Name of the value to send in form.
 * @returns JSX Element.
 */
const SelectAlpiqContractForm = ({
    title,
    options,
    name,
}: /**
 *
 */
{
    /**
     * Title.
     */
    title: string
    /**
     * Options.
     */
    options: AlpiqContractTypeSelectOptionsType[]
    /**
     * Name.
     */
    name: string
}) => {
    const { formatMessage } = useIntl()
    return (
        <div className="flex flex-1 w-5/6 md:2/3 mx-10">
            <Select
                name={name}
                label={title}
                style={{
                    width: '100%',
                }}
                validateFunctions={[requiredBuilder()]}
            >
                {options.map((option, _index) => (
                    <MenuItem key={_index} value={option.value}>
                        {formatMessage({
                            id: option.label,
                            defaultMessage: option.label,
                        })}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}
