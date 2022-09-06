import React from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { styled } from '@mui/material/styles'
import { AccomodationForm } from 'src/modules/MyHouse/components/Accomodation/AccomodationForm'

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
 * Accomodation Page.
 *
 * @returns JSX Element.
 */
const Accomodation = () => {
    return <Root content={<AccomodationForm />} />
}

export default Accomodation
