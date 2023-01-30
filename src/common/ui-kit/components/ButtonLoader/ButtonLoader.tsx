import { ButtonProps } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

import React, { FC } from 'react'

/**
 * TODO Documents.
 */
type ILoadingType = 'blank' | 'balls' | 'bars' | 'bubbles' | 'cubes' | 'cylon' | 'spin' | 'spinningBubbles' | 'spokes'

/**
 * TODO Documents.
 */
export interface ButtonLoaderProps extends ButtonProps {
    /**
     * TODO Documents.
     */
    inProgress?: boolean
    /**
     * TODO Documents.
     */
    loadingType?: ILoadingType
    /**
     * TODO Documents.
     */
    loadingHeight?: number | string
    /**
     * TODO Documents.
     */
    loadingWidth?: number | string
}

/**
 *  TODO Documents.
 *
 * @param props TODO Documents.
 * @returns  TODO Documents.
 */
export const ButtonLoader: FC<ButtonLoaderProps> = (
    props = {
        inProgress: false,
        loadingHeight: 20,
        loadingType: 'spokes',
        loadingWidth: 19,
    },
) => {
    const { children, inProgress, loadingHeight, loadingType, loadingWidth, ...rest } = props

    return (
        <LoadingButton variant="contained" loading={inProgress} color="primary" disabled={!!inProgress} {...rest}>
            {/**
             * Issue: .==> https://github.com/facebook/react/issues/11538#issuecomment-390386520  <==.
             * There is conflict with google translate and ReactDOM elements, thus wrapping Text Elements with span is the easiest way to solve the issue.
             */}
            <span>{children}</span>
        </LoadingButton>
    )
}
