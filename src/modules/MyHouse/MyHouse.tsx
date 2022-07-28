import React from 'react'
// import MultiTab from 'src/modules/shared/MultiTab/MultiTab'
// import { useMeterList } from 'src/modules/Meters/metersHook'
// import { EquipmentForm } from 'src/modules/MyHouse/components/Equipments/EquipmentForm'
import HousingList from 'src/modules/MyHouse/components/HousingList'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useTheme } from '@mui/material'

/**
 * Form used for modify MyHouse.
 *
 * @returns MyHouse form component.
 */
export const MyHouse = () => {
    const theme = useTheme()

    return (
        <div>
            <div
                style={{ background: theme.palette.primary.main, minHeight: '64px' }}
                className="w-full relative flex flex-col justify-center items-center p-16"
            >
                <div>
                    <TypographyFormatMessage
                        className="text-18 md:text-24"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        Logement
                    </TypographyFormatMessage>
                </div>
            </div>
            <HousingList />
        </div>
    )
}
