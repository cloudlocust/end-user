// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Form, requiredBuilder } from 'src/common/react-platform-components'
import { ButtonLoader } from 'src/common/ui-kit'
import {
    GoogleMapsAddressAutoCompleteField,
    UiAddressAutoCompleteFieldOutputProps,
} from './GoogleMapsAddressAutoCompleteField'

const exported = {
    title: 'Address',
}
export default exported

// eslint-disable-next-line jsdoc/require-jsdoc
export const googleMapsAddressAutoComplete2 = (): JSX.Element => (
    <Form
        onSubmit={async (_data: // eslint-disable-next-line jsdoc/require-jsdoc
        {
            /**
             *
             */
            address: UiAddressAutoCompleteFieldOutputProps
        }) => {}}
    >
        <GoogleMapsAddressAutoCompleteField name="address" validateFunctions={[requiredBuilder()]} />
        <ButtonLoader type="submit">Submit</ButtonLoader>
    </Form>
)
