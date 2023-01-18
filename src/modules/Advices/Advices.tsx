import React from 'react'

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
                    <div className="flex flex-col w-full">
                        {/* Ecogestes header + All... link */}
                        {/* Ecogestes carousel w/ dots */}
                        <p>Here will be a carousel. Meanwhile, have a link: insert_link_here</p>
                        <EcogestesList></EcogestesList>
                    </div>
                    <Divider variant="middle" role="presentation" />
                    <div>{/* Challenge list */}</div>
                </>
            }
        />
    )
}
