import { Form, regex, requiredBuilder, accept } from 'src/common/react-platform-components'
import {
    useTheme,
    RadioGroup,
    Radio,
    FormControlLabel,
    Card,
    MenuItem,
    Checkbox as CheckboxMui,
    Button,
    Grid,
} from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Select } from 'src/common/ui-kit/form-fields/Select'
import { useIntl } from 'react-intl'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import { useState } from 'react'
import { DatePicker } from 'src/common/ui-kit/form-fields/DatePicker'
import { addDays, format } from 'date-fns'
import { ButtonLoader, TextField, Checkbox } from 'src/common/ui-kit'
import { textNrlinkColor } from 'src/modules/nrLinkConnection/components/LastStepNrLinkConnection/LastStepNrLinkConnection'
import { AlpiqFacturationDataType } from 'src/modules/User/AlpiqSubscription'
import { useAlpiqProvider } from 'src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'
import { SectionText, SectionTitle } from 'src/modules/User/AlpiqSubscription/FacturationForm/utils'
import { useModal } from 'src/hooks/useModal'
import { SuccessPopupModal } from 'src/modules/User/AlpiqSubscription/FacturationForm/SuccessPopupModal'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'
import { LinkRedirection } from 'src/modules/utils/LinkRedirection'
//eslint-disable-next-line
export const datePrelevementOptions: { id: number; value: number; label: string }[] = Array.from({ length: 28 }, (_, index) => ({
        id: index + 1,
        value: index + 1,
        label: `${index + 1} du mois`,
    }),
)

//eslint-disable-next-line
export const civilityOptions: { id: number, value: string, label: string}[] = [
    {
        id: 1,
        value: 'MR',
        label: 'MR',
    },
    {
        id: 2,
        value: 'Mme',
        label: 'Mme',
    },
    {
        id: 3,
        value: 'Mlle',
        label: 'Mlle',
    },
]

// doing it static because it's only a feature for bowatt
const CGV_DOCUMENT_URL = 'https://particuliers.alpiq.fr/CGV-PDF/particuliers/cgv_elec_part.pdf'

// doing it static because it's only a feature for bowatt
const GRILLE_TARIFF_DOCUMENT_URL = 'https://www.bowatts-beaujolais.fr/pdf/grille-tarifaire.pdf'

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
    const { formatMessage } = useIntl()
    const history = useHistory()
    const dispatch = useDispatch<Dispatch>()
    const { currentHousing, alpiqSubscriptionSpecs } = useSelector(({ housingModel }: RootState) => housingModel)
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const [isNewFacturationAddress, setIsNewFacturationAddress] = useState(false)
    const [isCotitulaire, setIsCotitulaire] = useState(false)
    const { createAlpiqSubscription, loadingInProgress } = useAlpiqProvider()
    const afterTomorrow = addDays(new Date(), 2) // Get the day after tomorrow
    const formattedAfterTomorrow = format(afterTomorrow, 'yyyy-MM-dd')
    const IBAN_REGEX_TEXT = 'Format IBAN invalide'
    const ibanRegex = /^FR\d{25}$/.source

    const { enqueueSnackbar } = useSnackbar()
    const { isOpen: isFinishFacturationOpen, openModal: onOpenFinishFacturationPopup } = useModal()

    const [selectedDate, setSelectedDate] = useState<Date>(afterTomorrow)

    /**
     * Function that tells us if the selected date is within 14 days.
     *
     * @param date Selected Date in Datepicker.
     * @returns True/False.
     */
    const isWithinForteenDays = (date: Date) => {
        const today = new Date()
        const fourteenDaysFromToday = new Date(today)
        fourteenDaysFromToday.setDate(today.getDate() + 14)

        return date < fourteenDaysFromToday
    }

    /**
     * On submit button.
     *
     * @param data Data.
     */
    const onSubmit = (data: AlpiqFacturationDataType) => {
        // technicly can't have this case if he did the steps right and the stepper does his job on load
        if (!alpiqSubscriptionSpecs || !user) return
        const { car, ...contractSubscriptionInfos } = alpiqSubscriptionSpecs
        createAlpiqSubscription(
            { ...data, ...contractSubscriptionInfos },
            currentHousing?.id,
            onOpenFinishFacturationPopup,
        )
    }

    /**
     * What happens after we click on finish after the subscription is done.
     */
    const onClickFinishAlpiqProcess = async () => {
        try {
            if (!user) return
            await dispatch.userModel.updateCurrentUser({ data: { ...user, isProviderSubscriptionCompleted: true } })
        } catch (error: any) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la sauvegarde de votre profil, contactez le service client',
                    defaultMessage: 'Erreur lors de la sauvegarde de votre profil, contactez le service client',
                }),
                {
                    autoHideDuration: 5000,
                    variant: 'error',
                },
            )
        }
        dispatch.housingModel.setAlpiqSubscriptionSpecs(null)
        history.replace(`/nrlink-connection-steps/${currentHousing?.id}`)
    }

    const requiredFieldErrorMessage = formatMessage({ id: 'Champ obligatoire', defaultMessage: 'Champ obligatoire' })
    return (
        <div className="flex w-full flex-col justify-center">
            <Form
                onSubmit={onSubmit}
                defaultValues={{
                    modeFacturation: 'MENS',
                    jourPrelevement: 27,
                    addressFacturation: currentHousing?.address,
                    dateDebutContrat: formattedAfterTomorrow,
                    iban: 'FR',
                }}
                style={{
                    overflowY: 'auto',
                }}
            >
                <div className="flex flex-col items-start justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-full mb-32">
                        <Card className="rounded-16 border border-slate-600 bg-gray-50 mx-10 md:mx-10 w-full md:w-400 h-256 lg:h-224 flex flex-col justify-center">
                            <SectionTitle title="Récapitulatif de l'offre" />
                            <div className="flex items-center justify-center mt-20">
                                <SectionText text="Puissance souscrite :" className="text-sm" />
                                <SectionText
                                    className="ml-6 md:ml-12 font-bold text-sm"
                                    text={`${alpiqSubscriptionSpecs?.puissanceSouscrite} Kva`}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-center mt-20">
                                <SectionText text="Option tarifaire :" className="text-sm" />
                                <SectionText
                                    className="ml-6 md:ml-12 font-bold text-sm"
                                    text={
                                        alpiqSubscriptionSpecs?.optionTarifaire === 'BASE'
                                            ? 'Base'
                                            : 'Heures pleines / Heures creuses'
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-center mt-20">
                                <SectionText text="Mensualité :" className="text-sm" />
                                <SectionText
                                    className="ml-6 md:ml-12 font-bold"
                                    text={`${alpiqSubscriptionSpecs?.mensualite} €`}
                                />
                            </div>
                        </Card>
                    </div>
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
                                <Select name="jourPrelevement" label="">
                                    {datePrelevementOptions.map((option) => (
                                        <MenuItem key={option.id} value={option.value}>
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
                        <div className="w-full flex items-center justify-start">
                            <CheckboxMui
                                checked={isNewFacturationAddress}
                                color="primary"
                                onClick={() => setIsNewFacturationAddress(!isNewFacturationAddress)}
                            />
                            <SectionText text="Mon adresse de facturation est différente de celle de mon logement." />
                        </div>
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
                                checked={isCotitulaire}
                                color="primary"
                                onClick={() => setIsCotitulaire(!isCotitulaire)}
                            />
                            <SectionText text="J'ai un cotitulaire." />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Date de début de fourniture" />
                        <div className="w-full flex flex-col items-start justify-center">
                            <div className="w-5/6 md:w-2/3">
                                <DatePicker
                                    name="dateDebutContrat"
                                    minDate={formattedAfterTomorrow}
                                    onAccept={(date: any) => setSelectedDate(date)}
                                />
                            </div>
                            {isWithinForteenDays(selectedDate) && (
                                <SectionText text="Je demande expressément à Alpiq d'activer mon contrat avant l'expiration de mon délai de rétraction de 14 jours à compter de la souscription du contrat. Si je me rétracte, je serai redevable des frais de l'électricité consommée dans mon logement." />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full mb-32">
                        <SectionTitle title="Coordonnées bancaires" />
                        <Grid container spacing={1} className="mt-12">
                            <Grid item md={4} xs={12}>
                                <TextField
                                    name="iban"
                                    label="IBAN"
                                    validateFunctions={[requiredBuilder(), regex(ibanRegex, IBAN_REGEX_TEXT)]}
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <TextField
                                    name="nomAssocieIban"
                                    label="Nom du titulaire"
                                    validateFunctions={[requiredBuilder()]}
                                />
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <TextField
                                    name="prenomAssocieIban"
                                    label="Prenom du titulaire"
                                    validateFunctions={[requiredBuilder()]}
                                />
                            </Grid>

                            {isCotitulaire && (
                                <>
                                    <Grid item md={4} xs={12}>
                                        <Select
                                            name="civilityCotitulaire"
                                            label="Civilité du cotitulaire"
                                            validateFunctions={[requiredBuilder()]}
                                            className="mb-12"
                                        >
                                            {civilityOptions.map((option) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {formatMessage({
                                                        id: option.label,
                                                        defaultMessage: option.label,
                                                    })}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            name="nomCotitulaire"
                                            label="Nom du cotitulaire"
                                            validateFunctions={[requiredBuilder()]}
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            name="prenomCotitilaure"
                                            label="Prenom du cotitulaire"
                                            validateFunctions={[requiredBuilder()]}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </div>
                    <div className="w-full flex flex-col">
                        <Checkbox
                            color="primary"
                            name="isAlpiqPrelevementAccepted"
                            label="J'autorise Alpiq à prélever sur le compte bancaire désigné ci-dessus les sommes dues au titre de mon contrat. J'autorise ma banque à accepter les prélèvement automatiques d'Alpiq"
                            validate={[accept(requiredFieldErrorMessage), requiredBuilder(requiredFieldErrorMessage)]}
                        />
                        <div className="w-full flex-col items-center justify-start mt-10">
                            <div className="w-full flex flex-row items-center justify-start">
                                <Checkbox
                                    name="isContractConditionsAccepted"
                                    label={
                                        formatMessage(
                                            {
                                                id: "J'ai pris connaissance et j'accepte les {cgv}, {tarif}",
                                                defaultMessage:
                                                    "J'ai pris connaissance et j'accepte les {cgv}, {tarif}",
                                            },
                                            {
                                                cgv: <LinkRedirection label="CGV" url={CGV_DOCUMENT_URL} />,
                                                tarif: (
                                                    <LinkRedirection
                                                        label={formatMessage({
                                                            id: 'la grille tarifaire',
                                                            defaultMessage: 'la grille tarifaire',
                                                        })}
                                                        url={GRILLE_TARIFF_DOCUMENT_URL}
                                                    />
                                                ),
                                            },
                                        ) as string
                                    }
                                    color="primary"
                                    validate={[
                                        accept(requiredFieldErrorMessage),
                                        requiredBuilder(requiredFieldErrorMessage),
                                    ]}
                                />
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
                        <ButtonLoader inProgress={loadingInProgress} className="mr-20" color="primary" type="submit">
                            {formatMessage({
                                id: 'Souscrire',
                                defaultMessage: 'Souscrire',
                            })}
                        </ButtonLoader>
                    </div>
                </div>
            </Form>
            <SuccessPopupModal modalOpen={isFinishFacturationOpen} onClickNext={onClickFinishAlpiqProcess} />
        </div>
    )
}
