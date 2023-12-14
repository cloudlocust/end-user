import { Dialog, DialogContent, useTheme, IconButton, alpha, Button } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { MoreAdviceInformationPopupProps } from 'src/modules/Dashboard/AdviceContainer/components/MoreAdviceInformationPopup/moreAdviceInformationPopup'
import { Close as CloseIcon } from '@mui/icons-material'
import { SavingPercentage } from 'src/modules/Dashboard/AdviceContainer/components/SavingPercentage/SavingPercentage'
import { Link } from 'react-router-dom'

/**
 * MoreAdviceInformationPopup component.
 *
 * @param props MoreAdviceInformationPopupProps.
 * @returns MoreAdviceInformationPopup component.
 */
export const MoreAdviceInformationPopup = (props: MoreAdviceInformationPopupProps) => {
    const { isOpen, onClose, currentEcogeste } = props
    const theme = useTheme()

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth={'md'}>
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
                        <TypographyFormatMessage className="text-14 md:text-16 leading-none" fontWeight={600}>
                            {`${currentEcogeste?.title}`}
                        </TypographyFormatMessage>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="flex flex-auto mb-10">
                    <TypographyFormatMessage className="text-14 md:text-16 text-justify">
                        {`${currentEcogeste?.description}`}
                    </TypographyFormatMessage>
                </div>
                <div className="flex flex-auto justify-between items-center mb-20 text-14 md:text-16">
                    <SavingPercentage percentageSaved={currentEcogeste?.percentageSaved} />
                    <span>
                        Jusqu'à <strong>{currentEcogeste?.percentageSaved}</strong> d'économie
                    </span>
                </div>
                <div className="mb-10">
                    <TypographyFormatMessage className="text-14 md:text-16" fontWeight={600}>
                        Pour en savoir plus
                    </TypographyFormatMessage>
                    <TypographyFormatMessage className="text-14 md:text-16 text-justify">{`${currentEcogeste?.infos}`}</TypographyFormatMessage>
                </div>
                <Button fullWidth component={Link} to="/advices" variant="contained">
                    <TypographyFormatMessage className="text-14 md:text-16">Plus de conseils</TypographyFormatMessage>
                </Button>
            </DialogContent>
        </Dialog>
    )
}
