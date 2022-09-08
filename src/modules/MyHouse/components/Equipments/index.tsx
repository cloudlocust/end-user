import React from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { styled } from '@mui/material/styles'
import { EquipmentForm } from 'src/modules/MyHouse/components/Equipments/EquipmentForm'

const Root = styled(PageSimple)(({ theme }) => ({
    '& .PageSimple-content': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '15px',
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
 * Equipment Page.
 *
 * @returns JSX Element.
 */
const Equipments = () => {
    return <Root content={<EquipmentForm />} />
}

export default Equipments
