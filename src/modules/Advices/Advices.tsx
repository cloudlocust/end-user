import { Divider, styled, useTheme } from '@mui/material'
import React from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { EcogestTagCard } from 'src/modules/Ecogestes/components/ecogesteTagsCard'
import useEcogesteTags from 'src/modules/Ecogestes/ecogestesTagsHook'

const Root = styled(PageSimple)(({ theme }) => ({
    '& .PageSimple-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .PageSimple-content': {
        display: 'flex',
        position: 'relative',
    },
    '& .PageSimple-contentCard': {
        overflow: 'hidden',
    },
    [theme.breakpoints.down('md')]: {
        '& .PageSimple-toolbar': {
            height: 'auto',
        },
    },
}))

/**
 * Form used for modify user Advices.
 *
 * @returns Modify form component.
 */
export const Advices = () => {
    const theme = useTheme()

    const { elementList } = useEcogesteTags()

    /* TODO:
    - Add some way to get to all categories
    - No carousel for now, but maybe just a slice of all tags (say, like 3)
    - 
    */

    return (
        <Root
            header={
                <div
                    className="w-full relative flex flex-col justify-center items-center p-16 h-full"
                    style={{ backgroundColor: theme.palette.primary.dark }}
                >
                    <TypographyFormatMessage
                        className="text-18 md:text-24"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        Conseils
                    </TypographyFormatMessage>
                </div>
            }
            content={
                <>
                    <div className="p-20">
                        {/* Placeholder for carousel */}
                        <TypographyFormatMessage className="text-16 md:text-20">
                            Catégories de conseils:
                        </TypographyFormatMessage>
                        <div className="m-10 p-10 flex flex-1 gap-9" aria-label="list, tags, cards">
                            {elementList?.map((element) => (
                                <EcogestTagCard ecogestTag={element} />
                            ))}
                        </div>
                    </div>
                    <Divider variant="middle" role="presentation" />
                    <div>{/* Challenge list -- Later */}</div>
                </>
            }
        />
    )
}
