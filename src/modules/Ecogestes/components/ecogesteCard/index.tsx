import { RefObject, useState, useCallback, useLayoutEffect, useRef } from 'react'
import { Card, CardContent, IconButton, SvgIcon } from '@mui/material'
import { IEcogeste } from '../ecogeste'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SavingsIcon from '@mui/icons-material/Savings'
import InfoIcon from '@mui/icons-material/Info'
import { useTheme, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ReactComponent as NotViewIcon } from './NotRead.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { debounce } from 'lodash'
import 'src/modules/Ecogestes/components/ecogesteCard/ecogesteCard.scss'

/* eslint-disable jsdoc/require-jsdoc -- enough doc for now */
/* eslint-disable sonarjs/no-duplicate-string -- Styles literals :s */

const useResizeObserver = (ref: RefObject<HTMLElement>, callback: (entry: ResizeObserverEntry) => void) => {
    const notifyResize = useCallback(
        (entries: ResizeObserverEntry[]) => {
            if (!Array.isArray(entries)) {
                return
            }

            callback(entries[0])
        },
        [callback],
    )

    useLayoutEffect(() => {
        if (!ref.current) {
            return
        }
        let RO: ResizeObserver | undefined = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            notifyResize(entries)
        })

        RO.observe(ref.current)

        return () => {
            RO!.disconnect()
            RO = undefined
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])
}

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
    const [shouldEllipse, setShouldEllipse] = useState(false)
    const [seeFull, setSeeFull] = useState(false)

    const ref = useRef(null)

    useResizeObserver(
        ref,
        debounce((e: ResizeObserverEntry) => {
            const elementHeight = e.target.getBoundingClientRect().height
            const scrollHeight = e.target.scrollHeight
            const change = elementHeight < scrollHeight - 1
            setShouldEllipse(change)
        }, 100),
    )

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
                className="h-[12rem]"
                style={{
                    // Background color does not match, but best effort has been done.
                    // Can't hard-code any lightness change, or it might break other themes.
                    // Maybe a rework of the palette would help ?
                    background: viewed ? theme.palette.background.default : theme.palette.secondary.light,
                    maxHeight: seeFull ? 'min-content' : '12rem',
                    maxWidth: '60rem',
                    minWidth: '30%',
                    flex: '1 1 30%',
                }}
            >
                <CardContent className="flex flex-row justify-start gap-5 min-h-0 w-full max-h-full h-full px-10 pt-10 pb-15 relative">
                    <div className="flex flex-col place-content-center flex-auto basis-1/5 gap-5">
                        {/* Icon stack */}
                        <IconButton
                            className="p-0 text-5xl aspect-square"
                            style={{ aspectRatio: '1/1' }}
                            color="primary"
                            size="large"
                        >
                            <SavingsIcon className="p-2" fontSize="inherit" />
                            <span
                                className="absolute m-auto text-xs pt-7"
                                style={{ color: theme.palette.primary.contrastText }}
                            >
                                {ecogeste.savings && ecogeste.savings > 0 ? ecogeste.savings + '%' : ''}
                            </span>
                        </IconButton>

                        <IconButton
                            className="p-0 text-4xl rounded-lg aspect-square"
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
                                <VisibilityIcon className="p-2" fontSize="inherit" />
                            )}
                        </IconButton>
                    </div>
                    <div
                        className={
                            'w-full h-full basis-4/5 flex-auto  flex flex-col gap-1 pt-1 overflow-hidden ' +
                            (shouldEllipse ? 'ellipsis' : '')
                        }
                        ref={ref}
                    >
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
                                <InfoIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                        <TypographyFormatMessage className="text-13 text-justify pr-10">
                            {/* TODO: Proper multiline ellipsis
                            Maybe use: https://hackingui.com/a-pure-css-solution-for-multiline-text-truncation/ ?
                             */}
                            {ecogeste.shortdescription}
                        </TypographyFormatMessage>
                    </div>

                    <div className="absolute bottom-2 w-full">
                        {shouldEllipse ? (
                            <div
                                className="mx-auto w-fit"
                                style={{ width: 'fit-content' }}
                                onClick={() => setSeeFull(true)}
                            >
                                Voir plus
                            </div>
                        ) : seeFull ? (
                            <div
                                className="mx-auto w-fit"
                                style={{ width: 'fit-content' }}
                                onClick={() => setSeeFull(false)}
                            >
                                Voir moins
                            </div>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default EcogesteCard
