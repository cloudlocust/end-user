import { Divider, styled, useTheme } from '@mui/material'
import React from 'react'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { EcogestTagCard } from 'src/modules/Ecogestes/components/ecogesteTagsCard'

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
                    <div>
                        <EcogestTagCard
                            ecogestTag={{
                                id: 1,
                                name: 'Isolation et Ventilation',
                                ecogestAmount: 220,
                                icon: 'https://drive.google.com/uc?export=view&id=10NPb2PC1bWaKDZJXuwWly7_b11W-S46O',
                                type: 'POLE',
                            }}
                        ></EcogestTagCard>
                    </div>
                    <Divider variant="middle" role="presentation" />
                    <div>{/* Challenge list -- Later */}</div>
                </>
            }
        />
    )
}
