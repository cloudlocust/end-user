import React from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList'
import { Icon } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Ecogest List, but the page itself.
 *
 * @returns A page with a list of ecogestes.
 */
const EcogestListPage = () => {
    const theme = useTheme()

    return (
        <PageSimple
            header={
                <ThemeProvider theme={theme}>
                    <div
                        className="w-full h-full p-10 flex flex-nowrap flex-col gap-1 justify-around"
                        style={{ backgroundColor: theme.palette.primary.dark }}
                    >
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
                                src={'https://drive.google.com/uc?export=view&id=10NPb2PC1bWaKDZJXuwWly7_b11W-S46O'}
                                alt=""
                            ></img>
                        </Icon>
                        <TypographyFormatMessage className="text-center text-20 font-semibold">
                            Ecogest Tag Name Yadda Yadda
                        </TypographyFormatMessage>
                    </div>
                </ThemeProvider>
            }
            content={
                <div className="m-10 p-10">
                    <EcogestesList />
                </div>
            }
        />
    )
}

export default EcogestListPage
