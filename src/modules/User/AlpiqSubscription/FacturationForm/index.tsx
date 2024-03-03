import { Form, regex, requiredBuilder } from 'src/common/react-platform-components'
import { useTheme, RadioGroup, Radio, FormControlLabel } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import MenuItem from '@mui/material/MenuItem'
import { useIntl } from 'react-intl'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useState } from 'react'
import { Checkbox as CheckboxMui } from '@mui/material'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { addDays, format } from 'date-fns'
import { ButtonLoader, TextField, Checkbox, Typography } from 'src/common/ui-kit'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import Button from '@mui/material/Button'

//eslint-disable-next-line
export const datePrelevementOptions: { value: number, label: string}[] = Array.from({length: 28}, (_, index) => ({
    value: index + 1,
    label: `${index + 1} du mois`,
}))

/**
 * Facturation Form.
 *
 * @param props Props.
 * @param props.handleBack Handle back callback.
 * @returns JSX Element.
 */
export const FacturationForm = ({
    handleBack,
}: /**
 */ {
    /**
     * Handle back callback.
     */
    handleBack: () => void
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const { formatMessage } = useIntl()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [isNewFacturationAddress, setIsNewFacturationAddress] = useState(false)
    const afterTomorrow = addDays(new Date(), 2) // Get the day after tomorrow
    const formattedAfterTomorrow = format(afterTomorrow, 'yyyy-MM-dd')
    const IBAN_REGEX_TEXT = 'Format IBAN invalide'
    const ibanRegex = /^([A-Za-z]{2})\d{2}\s?\d{4}\s?\d{4}\s?\d{4}(?:\s?\d{2}){2}\s?$/.source

    /**
     * Handle Open CGV.
     */
    const handleOpenCGV = () => {
        // doing it static because it's only a feature for bowatt
        window.open('https://www.bowatts-beaujolais.fr/pdf/grille-tarifaire-aout-2023.pdf', '_blank')
    }

    /**
     * Handle Open Grille Tariff.
     */
    const handleOpenGrilleTariff = () => {
        // doing it static because it's only a feature for bowatt
        window.open('https://www.bowatts-beaujolais.fr/pdf/grille-tarifaire-aout-2023.pdf', '_blank')
    }
    return (
        <div className="flex w-full flex-col justify-center">
            <Form
                //eslint-disable-next-line
                onSubmit={(data) => console.log(data)}
                defaultValues={{
                    modeFacturation: 'MENS',
                    jourDePrelevement: 27,
                    addressFacturation: currentHousing?.address,
                    dateDebutContrat: formattedAfterTomorrow,
                    iban: 'FR',
                }}
                style={{
                    overflowY: 'auto',
                }}
            >
                <div className="flex flex-col items-start justify-center w-full">
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Mode de facturation" />
                        <RadioGroup name="modeFacturation" defaultValue="MENS" className="w-full flex flex-col">
                            <div>
                                <FormControlLabel
                                    value="MENS"
                                    control={<Radio color="primary" />}
                                    label="Facturation lissée"
                                    componentsProps={{
                                        typography: {
                                            fontSize: 18,
                                            fontWeight: 400,
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                />
                                <div className="ml-20">
                                    <SectionText text="Je paie chaque mois le même montant basé sur mon estimation annuelle. A terme, je reçois une facture de régularisation." />
                                </div>
                            </div>
                            <div>
                                <FormControlLabel
                                    value="REEL"
                                    control={<Radio color="primary" />}
                                    label="Facturation au Réel"
                                    componentsProps={{
                                        typography: {
                                            fontSize: 18,
                                            fontWeight: 400,
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                />
                                <div className="ml-20">
                                    <SectionText text="Je paie chaque mois le montant réel de ma consommation. Ce montant est généralement plus élevé en hiver qu'en été." />
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Date de prélèvement" />
                        <div className="flex items-center justify-start w-full">
                            <SectionText text="Je souhaite être prélevé le :" className="mr-10" />
                            <div className="w-120">
                                <Select name="jourDePrelevement" label="">
                                    {datePrelevementOptions.map((option, _index) => (
                                        <MenuItem key={_index} value={option.value}>
                                            {formatMessage({
                                                id: option.label,
                                                defaultMessage: option.label,
                                            })}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Adresse de facturation" />
                        <div className="w-full flex items-center justify-center">
                            <div className="w-4/5 mt-12">
                                <GoogleMapsAddressAutoCompleteField
                                    name="addressFacturation"
                                    disabled={!isNewFacturationAddress}
                                    validateFunctions={[requiredBuilder()]}
                                />
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-start">
                            <CheckboxMui
                                checked={isNewFacturationAddress}
                                color="primary"
                                onClick={() => setIsNewFacturationAddress(!isNewFacturationAddress)}
                            />
                            <SectionText text="Mon adresse de facturation est différente." />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Date de début de fourniture" />
                        <div className="w-full flex flex-col items-start justify-center">
                            <div className="w-5/6 md:w-2/3">
                                <DatePicker name="dateDebutContrat" minDate={formattedAfterTomorrow} />
                            </div>
                            <SectionText text="Je demande expressément à Alpiq d'activer mon contrat avant l'expiration de mon délai de rétraction de 14 jours à compter de la souscription du contrat. Si je me rétracte, je serai redevable dees frais de l'électricité consommée dans mon logement." />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Coordonnées bancaires" />
                        <div
                            className={`mt-12 w-full flex ${
                                isMobile ? 'flex-col' : 'flex-row'
                            } items-center justify-around`}
                        >
                            <TextField
                                name="iban"
                                label="IBAN"
                                validateFunctions={[requiredBuilder(), regex(ibanRegex, IBAN_REGEX_TEXT)]}
                            />
                            <TextField
                                name="nomAssocieIban"
                                label="Nom du titulaire"
                                validateFunctions={[requiredBuilder()]}
                            />
                            <TextField
                                name="prenomAssocieIban"
                                label="Prenom du titulaire"
                                validateFunctions={[requiredBuilder()]}
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col">
                        <Checkbox
                            color="primary"
                            name="isAlpiqPrelevementAccepted"
                            label="J'autorise Alpiq à prélever sur le compte bancaire désigné ci-dessus les sommes dues au titre de mon contrat. J'autorise ma banque à accepter les prélèvement automatiques d'Alpiq"
                            validate={[requiredBuilder()]}
                        />
                        <div className="w-full flex-col items-center justify-start mt-10">
                            <div className="w-full flex flex-row items-center justify-start">
                                <Checkbox
                                    name="isContractConditionsAccepted"
                                    label=""
                                    color="primary"
                                    validate={[requiredBuilder()]}
                                />
                                <Typography className={isMobile ? 'ml-7' : ''}>
                                    J'ai pris connaissance et j'accepte les&nbsp;
                                    <span
                                        onClick={handleOpenCGV}
                                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        CGV
                                    </span>
                                    ,&nbsp;
                                    <span
                                        onClick={handleOpenGrilleTariff}
                                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        la grille tarifaire
                                    </span>
                                    , et mon contrat.
                                </Typography>
                            </div>
                            <TypographyFormatMessage color={textNrlinkColor} variant="caption" className="mt-5">
                                Pas de frais de dossier et aucune démarche administrative. Contrat sans engagement de
                                durée. Droit de rétractation de 14 jours et résiliation gratuite.
                            </TypographyFormatMessage>
                        </div>
                    </div>
                    <div className={`w-full flex justify-end items-center mt-20`}>
                        <Button variant="outlined" className="mr-10" onClick={() => handleBack()}>
                            {formatMessage({
                                id: 'Retour',
                                defaultMessage: 'Retour',
                            })}
                        </Button>
                        <ButtonLoader className="mr-20" color="primary" type="submit">
                            {formatMessage({
                                id: 'Souscrire',
                                defaultMessage: 'Souscrire',
                            })}
                        </ButtonLoader>
                    </div>
                </div>
            </Form>
        </div>
    )
}

/**
 * Section Title To avoir repetition.
 *
 * @param props Props.
 * @param props.title Title.
 * @returns JSX Element.
 */
const SectionTitle = ({
    title,
}: /**
 */ {
    /**
     * Title.
     */
    title: string
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    return (
        <TypographyFormatMessage
            color={theme.palette.primary.main}
            textAlign="center"
            variant={isMobile ? 'h6' : 'h5'}
            fontWeight={600}
        >
            {title}
        </TypographyFormatMessage>
    )
}

/**
 * Section Text to avoid repetition.
 *
 * @param props Props.
 * @param props.text Text.
 * @param props.className Class Name.
 * @returns JSX Element.
 */
const SectionText = ({
    text,
    className,
}: /**
 */ {
    /**
     * Text.
     */
    text: string
    /**
     * ClassName.
     */
    className?: string
}) => {
    const theme = useTheme()
    return (
        <TypographyFormatMessage
            className={className ?? ''}
            color={theme.palette.text.primary}
            variant="body1"
            fontWeight={400}
        >
            {text}
        </TypographyFormatMessage>
    )
}
