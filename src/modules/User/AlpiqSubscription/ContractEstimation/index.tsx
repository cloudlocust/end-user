import { useTheme, Typography, Card } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Form } from 'src/common/react-platform-components'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { useIntl } from 'react-intl'
import { requiredBuilder } from 'src/common/react-platform-components'
import MenuItem from '@mui/material/MenuItem'
import { AlpiqContractTypeSelectOptions, AlpiqContractTypeSelectOptionsType } from './index.types'
import { ButtonLoader } from 'src/common/ui-kit'
import { NavigateNext } from '@mui/icons-material'
import { useState } from 'react'

/**
 * ContractEstimation step in alpiq.
 *
 * @returns JSX Element.
 */
const ContractEstimation = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const { formatMessage } = useIntl()
    const [isNext, setIsNext] = useState(false)

    return (
        <div className="flex flex-col w-full items-center justify-start">
            <div className="flex items-center justify-center mb-32 md:mb-48">
                <TypographyFormatMessage
                    color={theme.palette.primary.main}
                    textAlign="center"
                    variant={isMobile ? 'body1' : 'h5'}
                    fontWeight={600}
                >
                    Calculer la mensualité de mon contrat BôWatts par alpiq
                </TypographyFormatMessage>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col w-full items-center mb-20 mx-0 md:mx-20">
                    <div className="w-full mb-12 md:mb-24">
                        <Form onSubmit={(data) => data}>
                            <div className="flex w-full flex-col md:flex-row items-center justify-start">
                                <SelectAlpiqContractForm
                                    title="Type de contrat"
                                    options={AlpiqContractTypeSelectOptions}
                                    name="contractType"
                                />
                                <SelectAlpiqContractForm
                                    title="Puissance"
                                    options={AlpiqContractTypeSelectOptions}
                                    name="power"
                                />
                                <div className="flex items-center justify-center flex-1 mx-10">
                                    <ButtonLoader onClick={() => setIsNext(!isNext)}>
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
                        className={`rounded-16 border border-slate-600 bg-gray-50 mx-0 md:mx-20 w-full h-180 md:h-200 md:w-400 flex flex-col justify-center ${
                            isMobile && 'mb-20'
                        }`}
                    >
                        <TypographyFormatMessage
                            color={theme.palette.common.black}
                            textAlign="center"
                            variant={isMobile ? 'body2' : 'body1'}
                            fontWeight={400}
                        >
                            Mensualité calculée à partir de votre historique de consommation.
                        </TypographyFormatMessage>
                        <Typography
                            color={theme.palette.primary.main}
                            textAlign="center"
                            variant={isMobile ? 'h6' : 'h4'}
                        >
                            93 $TTC/Mois
                        </Typography>
                    </Card>
                    <div className={`${!isMobile ? 'justify-end px-20' : 'w-full justify-center'} flex items-center`}>
                        <ButtonLoader disabled={isNext} color="primary" endIcon={<NavigateNext />}>
                            {formatMessage({
                                id: 'AJUSTER MA MENSUALITÉ',
                                defaultMessage: 'AJUSTER MA MENSUALITÉ',
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
