import { render } from '@testing-library/react'
import { Theme } from '@mui/material'
import { EquipmentIcon } from 'src/modules/MyHouse/components/Equipments/EquipmentIcon'

describe('EquipmentIcon', () => {
    test('should render the correct icon component', () => {
        const theme = {
            palette: {
                grey: {
                    300: '#ccc',
                },
                primary: {
                    main: '#000',
                },
            },
        } as Theme
        const isDisabled = false
        const fill = theme.palette.primary.main

        const { container } = render(
            <EquipmentIcon equipmentName={'air_conditioner'} theme={theme} isDisabled={isDisabled} fill={fill} />,
        )
        expect(container.querySelector('svg')).toBeInTheDocument()
    })

    test('should render with the correct fill color when not disabled', () => {
        const theme = {
            palette: {
                grey: {
                    300: '#ccc',
                },
                primary: {
                    main: '#000',
                },
            },
        } as Theme
        const isDisabled = false
        const fill = theme.palette.primary.main

        const { container } = render(
            <EquipmentIcon equipmentName={'dryer'} theme={theme} isDisabled={isDisabled} fill={fill} />,
        )

        // Assert that the fill color is the same as the provided fill prop
        expect(container.querySelector('svg')).toHaveAttribute('fill', fill)
    })

    test('should render with the correct fill color when disabled', () => {
        const theme = {
            palette: {
                grey: {
                    300: '#ccc',
                },
                primary: {
                    main: '#000',
                },
            },
        } as Theme
        const isDisabled = true
        const fill = theme.palette.primary.main

        const { container } = render(
            <EquipmentIcon equipmentName={'tv'} theme={theme} isDisabled={isDisabled} fill={fill} />,
        )

        // Assert that the fill color is the same as the grey[300] color from the theme palette
        expect(container.querySelector('svg')).toHaveAttribute('fill', theme.palette.grey[300])
    })
})
