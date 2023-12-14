import React from 'react'
import { Card, CircularProgress } from '@mui/material'
import { FuseCardProps } from 'src/modules/shared/FuseCard/fuseCard'

/**
 * FuseCard component.
 *
 * This component wraps the MUI Card component and applies
 * default styles and classes.
 *
 * @param props Fuse card props.
 * @returns CustomCard JSX.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const FuseCard: React.FC<FuseCardProps> = (props) => {
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
            {props.isLoading ? (
                <div className="flex flex-col justify-center items-center w-full h-full" style={{ height: '100%' }}>
                    <CircularProgress style={{ color: props.loadingColor }} />
                </div>
            ) : (
                props.children
            )}
        </Card>
    )
}
