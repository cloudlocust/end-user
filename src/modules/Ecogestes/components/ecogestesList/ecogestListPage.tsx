import React, { useEffect, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList'
import { Icon, Skeleton } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useParams } from 'react-router-dom'
import useEcogesteTags from 'src/modules/Ecogestes/ecogestesTagsHook'
import { IEcogestTag } from 'src/modules/Ecogestes/components/ecogeste'
import { EcogestTagCard } from 'src/modules/Ecogestes/components/ecogesteTagsCard'

const PLACEHOLDER_ALL_TAGS_HEADER: IEcogestTag = {
    ecogestAmount: 0,
    id: 0,
    name: 'Toutes les catégories',
    type: '',
    icon: 'an icon',
}

/**
 * Props to pass to <EcogesteListContent.
 */
type IEcogestListContentProps =
    /**
     * Props to pass to <EcogesteListContent.
     */
    {
        /**
         * Current EcogesteTag used.
         */
        currentTag: IEcogestTag | null | undefined
        /**
         * Current List of Ecogeste Tags.
         */
        elementList: IEcogestTag[] | null
    }

/**
 * EcogestListContent Component.
 *
 * @param root0 Props.
 * @param root0.currentTag Current Ecogest Tag.
 * @param root0.elementList Current List of Ecogeste Tags.
 * @returns JSX.Element.
 */
const EcogestListContent = ({ currentTag, elementList }: IEcogestListContentProps): JSX.Element => {
    return currentTag?.id && currentTag.id > 0 && elementList ? (
        <div className="m-10 p-10">
            <EcogestesList />
        </div>
    ) : (
        <div className="m-10 p-10 flex flex-1 gap-9" aria-label="list, tags, cards">
            {elementList?.map((element) => (
                <EcogestTagCard ecogestTag={element} />
            ))}
        </div>
    )
}

/**
 * Ecogest List, but the page itself.
 *
 * @returns A page with a list of ecogestes.
 */
const EcogestListPage = () => {
    const theme = useTheme()

    const { tagId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes. Use 0 for all.
         */
        tagId: string
    }>()

    const tagIdInt = tagId ? parseInt(tagId) : 0

    const { loadingInProgress, elementList } = useEcogesteTags()

    const [curr_tag, setCurrTag] = useState<null | undefined | IEcogestTag>(PLACEHOLDER_ALL_TAGS_HEADER)

    useEffect(() => {
        let tag = elementList?.find((element) => element.id === tagIdInt)
        setCurrTag(tag ? tag : PLACEHOLDER_ALL_TAGS_HEADER)
    }, [elementList, tagIdInt])

    return (
        <PageSimple
            header={
                <ThemeProvider theme={theme}>
                    <div
                        className="w-full h-full p-10 flex flex-nowrap flex-col gap-1 justify-around"
                        style={{ backgroundColor: theme.palette.primary.dark }}
                    >
                        {!loadingInProgress && curr_tag && curr_tag.name && curr_tag.icon ? (
                            <>
                                <Icon
                                    sx={{ color: 'primary.contrastText' }}
                                    aria-hidden="true"
                                    color="inherit"
                                    style={{ height: '75%', alignSelf: 'center', width: '100%', margin: 'auto' }}
                                >
                                    <img
                                        // A note about the filter shenanigans under here:
                                        // It works.
                                        // If you have a better idea, that still allows for dynamic icons to be given, please, do make a PR for it.
                                        // Until then, it works with black images :v
                                        style={{
                                            filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText})`,
                                            height: '100%',
                                            margin: 'auto',
                                        }}
                                        src={curr_tag!.icon}
                                        alt=""
                                    ></img>
                                </Icon>

                                <TypographyFormatMessage className="text-center text-20 font-semibold">
                                    {curr_tag!.name}
                                </TypographyFormatMessage>
                            </>
                        ) : (
                            <>
                                <Skeleton variant="rectangular" width={'30%'} height={'75%'} sx={{ margin: 'auto' }} />
                                <Skeleton variant="text" sx={{ fontSize: '2rem', margin: 'auto' }} width={'40%'} />
                            </>
                        )}
                    </div>
                </ThemeProvider>
            }
            content={<EcogestListContent currentTag={curr_tag} elementList={elementList} />}
        />
    )
}

export default EcogestListPage
