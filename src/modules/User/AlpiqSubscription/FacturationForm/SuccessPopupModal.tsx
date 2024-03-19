import { Modal, Box } from '@mui/material'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import { SectionText, SectionTitle } from './utils'
import { useIntl } from 'react-intl'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Success popup modal.
 *
 * @param props Props.
 * @param props.modalOpen Modal open.
 * @param props.onClickNext On Click Next.
 * @returns JSX.
 */
export const SuccessPopupModal = ({
    /**
     *
     */
    modalOpen,
    /**
     *
     */
    onClickNext,
}: /**
 */ {
    /**
     *
     */
    modalOpen: boolean
    /**
     *
     */
    onClickNext: () => void
}) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Modal open={modalOpen}>
            <ThemeProvider theme>
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: isMobile ? '90%' : '50%',
                        height: isMobile ? '90%' : '50%',
                        backgroundColor: theme.palette.primary.main,
                        boxShadow: 'none',
                        border: 'none',
                    }}
                    className="rounded-20 border-transparent"
                >
                    <div className="flex flex-col items-center justify-center mx-5 mt-20 w-full h-full ">
                        <SectionTitle title="Bienvenue chez BôWatts !" textColor={theme.palette.common.white} />
                        <div className="w-full mt-10">
                            <SectionTitle
                                title="L'électricité verte du beaujolais"
                                textColor={theme.palette.common.white}
                            />
                        </div>

                        <div className="w-full mt-20">
                            <SectionText
                                text="Notre équipe BôWatts | Alpiq s’occupe de la mise en service de votre nouvel abonnement."
                                textColor={theme.palette.common.white}
                            />
                        </div>

                        <div className="w-5/6 mt-20">
                            <SectionText
                                text="Vous allez prochainement recevoir par email toutes les informations pour :"
                                textColor={theme.palette.common.white}
                            />
                        </div>

                        <div className="w-11/12 mt-10">
                            <div className="w-full">
                                <SectionText
                                    text="► récupérer votre nrLINK pour faire des économies"
                                    textColor={theme.palette.common.white}
                                />
                            </div>
                            <div className="w-full">
                                <SectionText
                                    text="► accéder à votre plateforme BôWatts pour vous permettre de suivre vos consommations"
                                    textColor={theme.palette.common.white}
                                />
                            </div>
                            <div className="w-full">
                                <SectionText
                                    text="► créer votre compte client chez Alpiq pour suivre la mise en route de votre contrat et télécharger vos futures factures"
                                    textColor={theme.palette.common.white}
                                />
                            </div>
                        </div>

                        <div className="w-full mt-40">
                            <SectionTitle
                                title="C’EST LE DÉBUT D’UNE BELLE AVENTURE !"
                                textColor={theme.palette.common.white}
                            />
                        </div>

                        <div className="w-full mt-20 flex items-center justify-center">
                            <Button variant="contained" color="inherit" onClick={onClickNext}>
                                {formatMessage({
                                    id: 'Accéder à la plateforme BôWatts',
                                    defaultMessage: 'Accéder à la plateforme BôWatts',
                                })}
                            </Button>
                        </div>
                    </div>
                </Box>
            </ThemeProvider>
        </Modal>
    )
}
