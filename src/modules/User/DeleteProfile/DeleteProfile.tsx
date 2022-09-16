import React, { useState } from 'react'
import { Button, Icon } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useIntl } from 'react-intl'
/**
 *
 * @returns
 */
const DeleteProfile = () => {
    const [openDelete, setOpenDelete] = useState(false)
    const { formatMessage } = useIntl()
    if (openDelete) {
        return (
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} aria-labelledby="alert-dialog-title">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <DialogContent
                        sx={{
                            // MUI snackbar red color, used as a global error color.
                            background: '#D32F2F',
                            // eslint-disable-next-line sonarjs/no-duplicate-string
                            color: 'background.paper',
                        }}
                    >
                        <div className="flex flex-col justify-center w-full">
                            <TypographyFormatMessage variant="subtitle2" className="font-semibold mb-10">
                                Vous êtes sur le point de supprimer votre compte utilisateur. Attention, toutes les
                                données relatives à votre compte seront supprimées. Êtes-vous sûr de vouloir continuer ?
                            </TypographyFormatMessage>
                            <div>
                                <Button
                                    variant="outlined"
                                    className="mr-10"
                                    onClick={() => setOpenDelete(false)}
                                    sx={{ color: 'background.paper', borderColor: 'background.paper' }}
                                >
                                    {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                                </Button>
                                <Button
                                    variant="outlined"
                                    // className="mb-4 sm:mr-8 sm:mb-0"
                                    sx={{ color: 'background.paper', borderColor: 'background.paper' }}
                                    // onClick={() => setOpenDelete(false)}
                                >
                                    {formatMessage({ id: 'Continuer', defaultMessage: 'Continuer' })}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </motion.div>
            </Dialog>
        )
    }
    return (
        <Icon
            color="error"
            className="ml-6"
            onClick={() => {
                setOpenDelete(true)
            }}
        >
            delete
        </Icon>
    )
}

export default DeleteProfile
