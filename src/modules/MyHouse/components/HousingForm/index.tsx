import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import CardActions from '@mui/material/CardActions'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { ButtonLoader } from 'src/common/ui-kit'
import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'

/**
 * This is a card for adding Housing.
 *
 * @param props Props.
 * @param props.onSuccess Close Form.
 * @returns Form To Add Housing.
 */
const HousingForm = ({
    onSuccess,
}: /**
 * Props Typing.
 */
{
    /**
     * Function on success.
     */
    onSuccess: () => void
}) => {
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState(false)

    const NEW_HOUSING = formatMessage({
        id: 'Mon Nouveau Logement',
        defaultMessage: 'Mon Nouveau Logement',
    })

    const { addElement: addHousing, loadingInProgress } = useHousingList()
    return (
        <Form
            onSubmit={async (data: defaultValueType) => {
                await addHousing(data)
                onSuccess()
            }}
        >
            <Card
                className="relative cursor-pointer flex-wrap rounded-16"
                onMouseOver={() => setRaisedState(true)}
                onMouseOut={() => setRaisedState(false)}
                raised={raisedState}
            >
                <CardContent>
                    <div className="flex justify-between">
                        <div className="flex items-center jutsify-center">
                            <Typography className="font-bold text-16 whitespace-normal">{NEW_HOUSING}</Typography>
                        </div>
                    </div>
                    <Divider className="my-16" />

                    <GoogleMapsAddressAutoCompleteField name="address" validateFunctions={[requiredBuilder()]} />
                </CardContent>
                <CardActions className="flex items-center content-center justify-center">
                    <ButtonLoader inProgress={loadingInProgress} type="submit" size="large" variant="contained">
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </ButtonLoader>
                </CardActions>
            </Card>
        </Form>
    )
}
export default HousingForm
