import { reduxedRender } from 'src/common/react-platform-components/test'
import ShellyWindowInstructions, {
    getShellyWindowInstructionsHTML,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ShellyWindowInstructions'

const SHELLY_WINDOW_INSTRUCTION_MESSAGE_TEXT = 'Veuillez fermer votre espace Shelly une fois votre liaison terminé.'
const SHELLY_WINDOW_INSTRUCTION_MESSAGE_DESCRIPTION_TEXT =
    'Actuellement, les prises Shelly peuvent être liées à l’application uniquement dans le cadre d’une connexion avec des panneaux solaires Plug&play afin de visualiser la production solaire.'

const mockShellyUrl = 'mockShellyUrl'
describe('ShellyWindowInstructions Component', () => {
    const { getByText } = reduxedRender(<ShellyWindowInstructions />)
    expect(getByText(SHELLY_WINDOW_INSTRUCTION_MESSAGE_TEXT)).toBeTruthy()
    expect(getByText(SHELLY_WINDOW_INSTRUCTION_MESSAGE_DESCRIPTION_TEXT)).toBeTruthy()
})
describe('Test getShellyWindowInstructionsHTML', () => {
    test('When calling getShellyWindowInstructionsHTML', async () => {
        expect(
            getShellyWindowInstructionsHTML(mockShellyUrl).includes(SHELLY_WINDOW_INSTRUCTION_MESSAGE_TEXT),
        ).toBeTruthy()
    })
})
