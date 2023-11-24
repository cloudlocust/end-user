import React from 'react'
import { Card, CardProps } from '@mui/material'

/**
 * FuseCard component.
 *
 * This component wraps the MUI Card component and applies
 * default styles and classes.
 *
 * @param props React.ComponentProps without ref for `@mui/material/Card`.
 * @returns CustomCard JSX.
 */
export const FuseCard: React.FC<CardProps> = (props) => {
    // You can add more default styles here
    const defaultStyles = {
        bgcolor: 'background.paper',
        // Any other default styles...
    }

    return (
        <Card
            {...props}
            className={`rounded-20 shadow ${props.className || ''}`}
            sx={{ ...defaultStyles, ...props.sx }}
        >
            {props.children}
        </Card>
    )
}
