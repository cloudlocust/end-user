import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { convertUserDataToQueryString } from 'src/modules/User/Register/utils'

const data = applyCamelCase(TEST_SUCCESS_USER)
const mockedResult =
    'civilite=Mr&nom=Orlando&prenom=Jackson&email=user%2540success.com&phone=0123456789&adresse=Apt%2520556&code=92998-3874&ville=Gwenborough'

describe('Test convertUserDataToQueryString', () => {
    test('when convertUserDataToQueryString returns data', async () => {
        const queryString = convertUserDataToQueryString(data)

        expect(queryString).toStrictEqual(mockedResult)
    })
})
