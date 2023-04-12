import { styled, useTheme } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { EcogestesWrapper } from '../Ecogestes/EcogestesWrapper'

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
            content={<EcogestesWrapper />}
        />
    )
}
