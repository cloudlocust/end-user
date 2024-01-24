import { useTheme, alpha } from '@mui/material'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { truncate } from 'lodash'
import { SavingPercentage } from 'src/modules/Dashboard/AdviceContainer/components/SavingPercentage'
import { NewEcogesteCardProps } from 'src/modules/Ecogestes/components/NewEcogesteCard/NewEcogesteCard'

/**
 * NewEcogesteCard component.
 *
 * @param root0 N/A.
 * @param root0.ecogeste The ecogeste to display.
 * @param root0.showMoreDetails The function to call when the user click on details.
 * @returns NewEcogesteCard component.
 */
export const NewEcogesteCard = ({ ecogeste, showMoreDetails }: NewEcogesteCardProps) => {
    const theme = useTheme()

    return (
        <FuseCard
            className="flex flex-col p-20"
            key={ecogeste.id}
            sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}
            aria-label="ecogeste-card"
        >
            <div className="flex items-center mb-10 w-full flex-1">
                <div style={{ width: 25, height: 25 }} className="mr-10">
                    <img
                        style={{
                            width: '100%',
                            height: '100%',
                            filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main}) drop-shadow(0 0 0 ${theme.palette.primary.main})`,
                        }}
                        src={ecogeste.urlIcon}
                        alt={ecogeste.title}
                    />
                </div>
                <div className="flex justify-between items-center w-full">
                    <TypographyFormatMessage className="text-14 md:text-16 leading-none" fontWeight={600}>
                        {ecogeste.title}
                    </TypographyFormatMessage>
                    <SavingPercentage percentageSaved={ecogeste.percentageSaved} />
                </div>
            </div>
            <div className="flex flex-auto mb-10">
                <TypographyFormatMessage className="text-14 md:text-16 text-justify">
                    {truncate(ecogeste.description, { length: 150 })}
                </TypographyFormatMessage>
            </div>
            <div className="flex justify-end items-end flex-auto cursor-pointer" onClick={showMoreDetails}>
                <TypographyFormatMessage className="text-12 md:text-14 leading-none underline text-grey-700">
                    Détails &gt;
                </TypographyFormatMessage>
            </div>
        </FuseCard>
    )
}
