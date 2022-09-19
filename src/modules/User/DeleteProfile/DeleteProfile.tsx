import React, { useState } from 'react'
import { Button, Icon } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useIntl } from 'react-intl'
const whiteColor = 'background.paper'
/**
 * Pop-up component "Delete profile" with the ability to delete a profile.
 *
 * @returns Delete profile pop up.
 */
const DeleteProfile = () => {
    const [openDelete, setOpenDelete] = useState(false)
    const { formatMessage } = useIntl()
    /**
     * Function open the Delete Dialog.
     */
    const openDeleteDialog = () => {
        setOpenDelete(true)
    }
    /**
     * Function close the Delete Dialog.
     */
    const closeDeleteDialog = () => {
        setOpenDelete(false)
    }
    if (openDelete) {
        return (
            <Dialog open={openDelete} onClose={closeDeleteDialog} aria-labelledby="alert-dialog-title">
                <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
                    <DialogContent
                        sx={{
                            // MUI snackbar red color, used as a global error color.
                            background: '#D32F2F',
                            color: whiteColor,
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
                                    onClick={closeDeleteDialog}
                                    sx={{ color: whiteColor, borderColor: whiteColor }}
                                >
                                    {formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                                </Button>
                                {/* TODO: Add onClick delete profile after adding hook */}
                                <Button variant="outlined" sx={{ color: whiteColor, borderColor: whiteColor }}>
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
        <Icon color="error" className="ml-6" onClick={openDeleteDialog}>
            delete
        </Icon>
    )
}

export default DeleteProfile
