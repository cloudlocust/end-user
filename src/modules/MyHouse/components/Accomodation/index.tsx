import React from 'react'
import { useHistory, useParams } from 'react-router'
import { styled } from '@mui/material/styles'
import { AccomodationForm } from 'src/modules/MyHouse/components/Accomodation/AccomodationForm'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { motion } from 'framer-motion'
import Icon from '@mui/material/Icon'
import { useIntl } from 'src/common/react-platform-translation'
import { Button } from '@mui/material'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {
        minHeight: 90,
        height: 90,
        alignItems: 'center',
    },
    '& .FusePageCarded-content': {
        margin: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

/**
 * Accomodation Page.
 *
 * @returns JSX Element.
 */
const Accomodation = () => {
    const { formatMessage } = useIntl()

    const { houseId } = useParams</**
     *
     */
    {
        // eslint-disable-next-line jsdoc/require-jsdoc
        houseId: string
    }>()

    const housingId = parseInt(houseId)

    const history = useHistory()
    return (
        <Root
            header={
                <Button
                    color="primary"
                    onClick={() => history.push(`${URL_MY_HOUSE}/${housingId}`)}
                    className="text-16 ml-12"
                >
                    <Icon
                        component={motion.span}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { delay: 0.2 } }}
                        className="text-24 mr-2 text"
                    >
                        arrow_back
                    </Icon>
                    {formatMessage({ id: 'Retour', defaultMessage: 'Retour' })}
                </Button>
            }
            content={<AccomodationForm />}
        />
    )
}

export default Accomodation
