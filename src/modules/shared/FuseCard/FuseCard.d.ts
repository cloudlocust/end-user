import { CardProps } from '@mui/material'

/**
 * Fuse card props.
 */
export interface FuseCardProps extends CardProps {
    /**
     * Loading state.
     */
    isLoading?: boolean
    /**
     * Loading color.
     *
     * It depends on isLoading.
     */
    loadingColor?: string
}
