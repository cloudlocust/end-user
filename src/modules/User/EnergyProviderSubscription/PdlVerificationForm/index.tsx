import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { alpha, useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Form, regex, requiredBuilder } from 'src/common/react-platform-components'
import { meteGuidNumberRegex, METER_GUID_REGEX_TEXT } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import { useIntl } from 'react-intl'

const PdlVerificationForm = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()

    const onSubmit = async (data: { guid: string }) => {
        console.log(data)
    }

    return (
        <div className="w-full h-full flex flex-row justify-center items-center">
            <FuseCard
                className="rounded p-16 w-1/2"
                sx={{
                    border: alpha(theme.palette.primary.light, 0.1),
                }}
            >
                <Form onSubmit={onSubmit}>
                    <div className="flex justify-center w-full mb-32">
                        <TypographyFormatMessage color={theme.palette.primary.main} variant="h5" fontWeight={600}>
                            Mon point de livraison
                        </TypographyFormatMessage>
                    </div>
                    <div className='flex flex-col justify-start mb-32'>
                        <TypographyFormatMessage color={theme.palette.primary.main} className="mb-16" variant="h6" fontWeight={600}>
                            Votre PDL / PRM
                        </TypographyFormatMessage>
                        <TextField
                            name="guid"
                            label="Votre N° de PDL"
                            style={{ marginBottom: '5px' }}
                            placeholder="Ex: 12345678912345"
                            validateFunctions={[
                                requiredBuilder(),
                                regex(meteGuidNumberRegex, METER_GUID_REGEX_TEXT),
                            ]}
                        />
                        <TypographyFormatMessage variant="caption" sx={{ color: textNrlinkColor }}>
                            * Vous pouvez trouver votre numéro de PDL/PRM sur votre facture d'électricité.
                        </TypographyFormatMessage>
                    </div>
                    <div className="flex w-full justify-center mt-32">
                        <ButtonLoader type="submit" >
                            {formatMessage({
                                id: 'Continuer',
                                defaultMessage: 'Continuer',
                            })}
                        </ButtonLoader>
                    </div>
                </Form>
            </FuseCard>
        </div>
    )
}

export default PdlVerificationForm
