import { useState } from 'react'
import { Card, CardContent, Typography, IconButton, SvgIcon } from '@mui/material'
import { IEcogeste } from '../ecogeste'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SavingsIcon from '@mui/icons-material/Savings'
import InfoIcon from '@mui/icons-material/Info'
import { useTheme, Dialog, DialogContent } from '@mui/material'
import { ReactComponent as NotViewIcon } from './NotRead.svg'

/* eslint-disable jsdoc/require-jsdoc -- enough doc for now */
/**
 * A card that renders a given ecogeste.
 *
 * @param root0 N/A.
 * @param root0.ecogeste The ecogeste to display.
 * @returns Ecogeste component.
 */
const EcogesteCard = ({ ecogeste }: { ecogeste: IEcogeste }) => {
    const theme = useTheme()

    const [viewed, setViewed] = useState(false)
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const onVisbilityClick = () => {
        setViewed(!viewed)
        // TODO: Poke an API to get/set this?
    }

    return (
        <>
            <Dialog open={isOpenDialog} fullWidth={true} maxWidth="sm" onClose={() => setIsOpenDialog(false)}>
                <DialogContent>
                    <div className="p-10">
                        <Typography>{ecogeste.description}</Typography>
                    </div>
                </DialogContent>
            </Dialog>
            <Card
                className="h-full w-full md:w-1/3"
                style={{
                    background: viewed ? theme.palette.background.default : theme.palette.secondary.light,
                    maxHeight: '12rem',
                }}
            >
                <CardContent className="flex grow flex-row justify-start gap-5 h-full min-h-0 w-full p-10">
                    <div className="flex flex-col place-content-center grow basis-1/5 gap-5">
                        {/* Icon stack */}
                        {ecogeste.savings && ecogeste.savings > 0 ? (
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
                                    {ecogeste.savings}%
                                </span>
                            </IconButton>
                        ) : (
                            <></>
                        )}

                        <IconButton
                            className="grow p-0 text-4xl rounded-lg aspect-square"
                            style={{ background: theme.palette.background.paper, aspectRatio: '1/1' }}
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
                                <Typography className="font-bold text-15 whitespace-normal">
                                    {ecogeste.title}
                                </Typography>
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
                        <Typography className="text-12">
                            {/* TODO: Proper multiline ellipsis
                            Maybe use: https://hackingui.com/a-pure-css-solution-for-multiline-text-truncation/ ?
                             */}
                            {ecogeste.shortdescription}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default EcogesteCard
