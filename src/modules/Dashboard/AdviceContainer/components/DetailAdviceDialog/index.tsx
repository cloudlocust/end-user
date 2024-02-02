import { Dialog, DialogContent, useTheme, IconButton, alpha, Button, Typography } from '@mui/material'
import { DetailAdviceDialogProps } from 'src/modules/Dashboard/AdviceContainer/components/DetailAdviceDialog/detailAdviceDialog'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { SavingPercentage } from 'src/modules/Dashboard/AdviceContainer/components/SavingPercentage'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * DetailAdviceDialog component.
 *
 * @param root0 N/A.
 * @param root0.isDetailAdvicePopupOpen Specifies whether the popup is open or not.
 * @param root0.onCloseDetailAdvicePopup Callback function to be called when the popup is closed.
 * @param root0.currentEcogeste Clicked ecogeste to display.
 * @param root0.setViewStatus Function to set the view status of the ecogeste.
 * @param root0.isDashboardAdvice Specifies whether the popup is for a dashboard advice or not.
 * @returns DetailAdviceDialog component.
 */
export const DetailAdviceDialog = ({
    isDetailAdvicePopupOpen,
    onCloseDetailAdvicePopup,
    currentEcogeste,
    setViewStatus,
    isDashboardAdvice,
}: DetailAdviceDialogProps) => {
    const theme = useTheme()
    const [isEcogesteSeen, setIsEcogesteSeen] = useState(currentEcogeste?.seenByCustomer)

    if (!currentEcogeste) return null

    // !TypographyFormatMessage is throwing an error when one of the field in currentEcogeste is undefined.

    return (
        <Dialog open={isDetailAdvicePopupOpen} onClose={onCloseDetailAdvicePopup} maxWidth={'md'}>
            <DialogContent sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
                <div className="flex items-center mb-10 w-full flex-1">
                    <div style={{ width: 25, height: 25 }} className="mr-10">
                        <img
                            style={{
                                width: '100%',
                                height: '100%',
                                filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                            }}
                            src={currentEcogeste?.urlIcon}
                            alt={currentEcogeste?.title}
                        />
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <Typography className="text-14 md:text-16 leading-none" fontWeight={600}>
                            {`${currentEcogeste?.title}`}
                        </Typography>
                        <IconButton onClick={onCloseDetailAdvicePopup}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="flex flex-auto mb-10">
                    <Typography className="text-14 md:text-16 text-justify">
                        {`${currentEcogeste?.description}`}
                    </Typography>
                </div>
                {currentEcogeste?.percentageSaved && (
                    <div className="flex flex-auto justify-between items-center mb-20 text-14 md:text-16">
                        <SavingPercentage percentageSaved={currentEcogeste.percentageSaved} />
                        <span>
                            Jusqu'à <strong>{currentEcogeste?.percentageSaved}</strong> d'économie
                        </span>
                    </div>
                )}
                <div className="mb-10">
                    <Typography className="text-14 md:text-16" fontWeight={600}>
                        Pour en savoir plus
                    </Typography>
                    <Typography className="text-14 md:text-16 text-justify">{`${currentEcogeste?.infos}`}</Typography>
                </div>
                {isDashboardAdvice ? (
                    <Button fullWidth component={Link} to="/advices" variant="contained" className="text-14 md:text-16">
                        <TypographyFormatMessage>Plus de conseils</TypographyFormatMessage>
                    </Button>
                ) : isEcogesteSeen ? (
                    <Button
                        variant="outlined"
                        className="text-14 md:text-16 flex mx-auto"
                        onClick={() => {
                            if (setViewStatus) {
                                setViewStatus(currentEcogeste.id, false)
                                setIsEcogesteSeen(false)
                            }
                        }}
                        endIcon={<DeleteOutlineIcon />}
                    >
                        <TypographyFormatMessage>Retirer</TypographyFormatMessage>
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        className="text-14 md:text-16 flex mx-auto"
                        onClick={() => {
                            if (setViewStatus) {
                                setViewStatus(currentEcogeste.id, true)
                                setIsEcogesteSeen(true)
                            }
                        }}
                    >
                        <TypographyFormatMessage>C’est fait !</TypographyFormatMessage>
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    )
}
