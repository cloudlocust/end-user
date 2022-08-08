import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import { GoogleMapsAddressAutoCompleteField } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/GoogleMapsAddressAutoCompleteField'
import { requiredBuilder } from 'src/common/react-platform-components'
import { useForm, FormProvider } from 'react-hook-form'

import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * This is a card for adding Housing.
 *
 * @returns Form To Add Housing.
 */
const HousingForm = () => {
    const { formatMessage } = useIntl()
    const [raisedState, setRaisedState] = React.useState(false)

    const NEW_HOUSING = formatMessage({
        id: 'Mon Nouveau Logement',
        defaultMessage: 'Mon Nouveau Logement',
    })

    const methods = useForm()
    const { addElement: addHousing } = useHousingList()
    return (
        <>
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
                    <FormProvider {...methods}>
                        <form id="form" onSubmit={methods.handleSubmit((data: any) => addHousing(data))}>
                            <GoogleMapsAddressAutoCompleteField
                                name="address"
                                validateFunctions={[requiredBuilder()]}
                            />
                        </form>
                    </FormProvider>
                </CardContent>
                <CardActions className="flex items-center content-center justify-center">
                    <Button type="submit" size="large" form="form" variant="contained">
                        {formatMessage({
                            id: 'Enregistrer',
                            defaultMessage: 'Enregistrer',
                        })}
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}
export default HousingForm
