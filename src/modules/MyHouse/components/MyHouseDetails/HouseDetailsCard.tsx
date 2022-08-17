import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import { useIntl } from 'react-intl'
import { HouseDetailsElementType } from 'src/modules/MyHouse/components/MyHouseDetails/houseDetails'
import HouseElementDetail from 'src/modules/MyHouse/components/MyHouseDetails/HouseElementDetail'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * This is a component to display different elements of equipements/home-configuration in a card.
 *
 * @param props Props.
 * @param props.title The title of the card.
 * @param props.elements List of Elements to display in the card.
 * @returns Void.
 */
const HouseDetailsCard = ({
    title,
    elements,
}: /**
 */ {
    /**
     * Title of the card.
     */
    title: string
    /**
     * Elements to display (element is a icon and a label).
     */
    elements: HouseDetailsElementType[]
}) => {
    const { formatMessage } = useIntl()

    return (
        <Card className="rounded-16 border border-slate-600 bg-gray-50 mb-20 mx-10 w-400 h-300">
            <TypographyFormatMessage className="font-bold mt-20 ml-20 text-14 whitespace-normal">
                {title}
            </TypographyFormatMessage>
            <CardContent className="flex content-center items-baseline">
                {elements.map((element) => (
                    <HouseElementDetail element={element} />
                ))}
            </CardContent>
            <CardActions className="flex items-center content-center justify-end">
                <Button variant="contained" color="primary" className="text-white">
                    {formatMessage({
                        id: 'Configuration',
                        defaultMessage: 'Configuration',
                    })}
                </Button>
            </CardActions>
        </Card>
    )
}

export default HouseDetailsCard
