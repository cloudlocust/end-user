import { useState } from 'react'
import { Card, CardContent, IconButton, SvgIcon } from '@mui/material'
import { IEcogeste } from '../ecogeste'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SavingsIcon from '@mui/icons-material/Savings'
import InfoIcon from '@mui/icons-material/Info'
import { useTheme, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ReactComponent as NotViewIcon } from './NotRead.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/* eslint-disable jsdoc/require-jsdoc -- enough doc for now */
/**
 * A card that renders a given ecogeste.
 *
 * @param root0 N/A.
 * @param root0.ecogeste The ecogeste to display.
 * @returns Ecogeste component.
 */
export const EcogesteCard = ({ ecogeste }: { ecogeste: IEcogeste }) => {
    const theme = useTheme()

    const [isOpenDialog, setIsOpenDialog] = useState(false)

    // Viewed feature, not yet implemented:
    // be sure to remove the display:none on the eye too.
    const [viewed, setViewed] = useState(false)
    const onVisbilityClick = () => {
        setViewed(!viewed)
        // TODO: Poke an API to get/set this?
    }

    return (
        <>
            <Dialog open={isOpenDialog} fullWidth={true} maxWidth="sm" onClose={() => setIsOpenDialog(false)}>
                {/* Dialog feels a bit bare, might need a rework. */}
                <DialogTitle>
                    <TypographyFormatMessage className="text-bold text-15">{ecogeste.title}</TypographyFormatMessage>
                </DialogTitle>
                <DialogContent>
                    <TypographyFormatMessage className="text-13">{ecogeste.description}</TypographyFormatMessage>
                </DialogContent>
            </Dialog>
            <Card
                className="h-full w-full md:w-1/3"
                style={{
                    // Background color does not match, but best effort has been done.
                    // Can't hard-code any lightness change, or it might break other themes.
                    // Maybe a rework of the palette would help ?
                    background: viewed ? theme.palette.background.default : theme.palette.secondary.light,
                    maxHeight: '12rem',
                    maxWidth: '60rem',
                }}
            >
                <CardContent className="flex grow flex-row justify-start gap-5 h-full min-h-0 w-full p-10">
                    <div className="flex flex-col place-content-center grow basis-1/5 gap-5">
                        {/* Icon stack */}
                        <IconButton
                            className="grow p-0 text-5xl aspect-square"
                            style={{ aspectRatio: '1/1' }}
                            color="primary"
                            size="large"
                        >
                            <SavingsIcon className="p-2" fontSize="inherit"></SavingsIcon>
                            <span
                                className="absolute m-auto text-xs pt-7"
                                style={{ color: theme.palette.primary.contrastText }}
                            >
                                {ecogeste.savings && ecogeste.savings > 0 ? ecogeste.savings + '%' : ''}
                            </span>
                        </IconButton>

                        <IconButton
                            className="grow p-0 text-4xl rounded-lg aspect-square"
                            style={{ background: theme.palette.background.paper, aspectRatio: '1/1', display: 'none' }}
                            color="primary"
                            size="large"
                            aria-label="mark as read"
                            onClick={onVisbilityClick}
                        >
                            {viewed ? (
                                <SvgIcon className="p-2" inheritViewBox fontSize="inherit">
                                    <NotViewIcon />
                                </SvgIcon>
                            ) : (
                                <VisibilityIcon className="p-2" fontSize="inherit"></VisibilityIcon>
                            )}
                        </IconButton>
                    </div>
                    <div className="w-full basis-4/5 overflow-hidden grow  flex flex-col gap-5 pt-4">
                        {/* Text Content */}

                        <div className="w-full flex flex-row place-content-between">
                            <div className="mt-auto mb-auto">
                                <TypographyFormatMessage className="font-bold text-15 whitespace-normal">
                                    {ecogeste.title}
                                </TypographyFormatMessage>
                            </div>
                            <IconButton
                                color="primary"
                                aria-label="more information"
                                onClick={() => {
                                    setIsOpenDialog(true)
                                }}
                            >
                                {' '}
                                <InfoIcon fontSize="inherit" />{' '}
                            </IconButton>
                        </div>
                        <TypographyFormatMessage className="text-13">
                            {/* TODO: Proper multiline ellipsis
                            Maybe use: https://hackingui.com/a-pure-css-solution-for-multiline-text-truncation/ ?
                             */}
                            {ecogeste.shortdescription}
                        </TypographyFormatMessage>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default EcogesteCard
