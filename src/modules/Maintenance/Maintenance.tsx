import { ReactSVG } from 'react-svg'
import { useTheme } from '@mui/material'
import MaintenanceSvg from 'src/assets/images/maintenance.svg'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Maintenance page.
 *
 * @returns Maintenance SVG.
 */
export const MaintenancePage = () => {
    const theme = useTheme()
    return (
        <div className="p-24 h-full flex flex-col items-center justify-center relative" style={{ flexGrow: 1 }}>
            <div className="flex justify-center w-full h-auto" style={{ maxWidth: '600px' }}>
                <ReactSVG
                    data-testid="react-svg"
                    src={MaintenanceSvg}
                    beforeInjection={(svg) => {
                        const paths = svg.querySelectorAll('path')
                        paths.forEach((p) => {
                            p.style.fill = theme.palette.primary.main
                        })
                        svg.setAttribute('style', 'width: 100%; height: 100%')
                    }}
                />
            </div>
            <div className="flex flex-col justify-center items-center">
                <TypographyFormatMessage
                    variant="h5"
                    className="mt-12 sm:mt-20 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
                >
                    Nous sommes en train d’effectuer des opérations de maintenance.
                </TypographyFormatMessage>
                <TypographyFormatMessage
                    variant="h5"
                    className="mt-12 sm:mt-20 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
                >
                    Veuillez nous excuser de la gène occasionnée.
                </TypographyFormatMessage>
            </div>
        </div>
    )
}
