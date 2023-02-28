import { useState, useRef } from 'react'
import { Card, CardContent, IconButton, SvgIcon } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SavingsIcon from '@mui/icons-material/Savings'
import { useTheme } from '@mui/material'
import { ReactComponent as NotViewIcon } from './NotRead.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { debounce, truncate } from 'lodash'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import useResizeObserver from 'src/modules/utils/useResizeObserver'
import { Icon } from 'src/common/ui-kit'

/**
 * A card that renders a given ecogeste.
 *
 * @param root0 N/A.
 * @param root0.ecogeste The ecogeste to display.
 * @returns Ecogeste component.
 */
export const EcogesteCard = ({
    ecogeste,
}: /**
 * Prams object.
 */
{
    /**
     * Ecogeste object to display. Cannot be null.
     */
    ecogeste: IEcogeste
}) => {
    const theme = useTheme()

    const [shouldEllipse, setShouldEllipse] = useState(false)
    const [seeFull, setSeeFull] = useState(false)

    const ref = useRef(null)

    useResizeObserver(
        ref,
        debounce((e: ResizeObserverEntry) => {
            // On each resize, check if the ellipse should be shown.
            // We check the height of the element on screen
            // Against the height the the element _should_ take (srcollHeigth)
            const elementHeight = e.target.getBoundingClientRect().height
            const scrollHeight = e.target.scrollHeight
            // Check if the element would overflow
            // The "5" at the end is necessary to make it a bit more lenient, unsure why.
            const change = elementHeight < scrollHeight - 5
            setShouldEllipse(change)
        }, 100),
        // Debounce the function, so that it does not fire _while_ we resize the element.
    )

    // Viewed feature, not yet implemented:
    // be sure to remove the display:none on the eye too.
    const [viewed, setViewed] = useState(false)
    /**
     * Change ecogeste visibility status.
     * Placeholder for now.
     * TODO: MYEM-3077, MYEM-3079.
     */
    const onVisbilityClick = () => {
        setViewed(!viewed)
        // TODO: Poke an API to get/set this?
    }

    return (
        <>
            <Card
                style={{
                    // Background color does not match, but best effort has been done.
                    // Can't hard-code any lightness change, or it might break other themes.
                    // Maybe a rework of the palette would help ?
                    // TODO: rework palette to match figma wireframes
                    background: viewed ? theme.palette.background.default : theme.palette.secondary.light,
                    maxHeight: seeFull ? 'max-content' : '15rem',
                    minHeight: '15rem',
                    maxWidth: '60rem',
                    minWidth: '30rem',
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
                                {`${ecogeste.percentageSaved}%`}
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
                        className={`w-full h-full basis-4/5 flex-auto  flex flex-col gap-1 pt-1 overflow-hidden`}
                        ref={ref}
                    >
                        {/* Text Content */}

                        <div className="w-full flex flex-row place-content-between">
                            <div className="mt-auto mb-auto flex-grow">
                                <TypographyFormatMessage className="font-bold text-15 whitespace-normal text-center">
                                    {ecogeste.title}
                                </TypographyFormatMessage>
                            </div>
                        </div>
                        <Icon aria-hidden="true" color="primary" style={{ height: '1.5rem', alignSelf: 'center' }}>
                            <img
                                // A note about the filter shenanigans under here:
                                // It works.
                                // If you have a better idea, that still allows for dynamic icons to be given, please, do make a PR for it.
                                // Until then, it works with black images :v
                                style={{
                                    filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                                    height: 'inherit',
                                }}
                                src={ecogeste.urlIcon}
                                alt=""
                            ></img>
                        </Icon>
                        <div className="relative text-13 text-justify pr-10 ">
                            <TypographyFormatMessage className="opacity-0" aria-hidden="true">
                                {/* Shadow-element used to know if we should ellipse or not */}
                                {ecogeste.description}
                            </TypographyFormatMessage>
                            <TypographyFormatMessage className="absolute top-0">
                                {/* Actual displayed element, with truncated text to fit ellipsis */}
                                {shouldEllipse && !seeFull
                                    ? // truncate to 100 characters, and only truncate on non-word char (\W+)
                                      truncate(ecogeste.description, { length: 70, separator: /\W+/ })
                                    : ecogeste.description}
                            </TypographyFormatMessage>
                        </div>
                    </div>

                    <div className="absolute bottom-2" style={{ width: '90%', cursor: 'pointer' }}>
                        {shouldEllipse && !seeFull ? (
                            <TypographyFormatMessage
                                color={theme.palette.primary.main}
                                fontWeight={500}
                                className="w-fit text-right mr-0 ml-auto underline cursor-pointer"
                                style={{ width: 'fit-content' }}
                                onClick={() => setSeeFull(true)}
                            >
                                Voir plus...
                            </TypographyFormatMessage>
                        ) : (
                            seeFull && (
                                <TypographyFormatMessage
                                    color={theme.palette.primary.main}
                                    fontWeight={500}
                                    className="mx-auto w-fit text-center underline cursor-pointer"
                                    style={{ width: 'fit-content' }}
                                    onClick={() => setSeeFull(false)}
                                >
                                    Voir moins
                                </TypographyFormatMessage>
                            )
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default EcogesteCard
