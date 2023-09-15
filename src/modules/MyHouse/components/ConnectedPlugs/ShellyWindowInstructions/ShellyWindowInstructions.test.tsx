import { reduxedRender } from 'src/common/react-platform-components/test'
import ShellyWindowInstructions, {
    getShellyWindowInstructionsHTML,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ShellyWindowInstructions'

const SHELLY_WINDOW_INSTRUCTION_MESSAGE_TEXT = 'Veuillez fermer votre espace Shelly une fois votre traitement terminé.'

const mockShellyUrl = 'mockShellyUrl'
describe('ShellyWindowInstructions Component', () => {
    const { getByText } = reduxedRender(<ShellyWindowInstructions />)
    expect(getByText(SHELLY_WINDOW_INSTRUCTION_MESSAGE_TEXT)).toBeTruthy()
})
describe('Test getShellyWindowInstructionsHTML', () => {
    test('When calling getShellyWindowInstructionsHTML', async () => {
        expect(
            getShellyWindowInstructionsHTML(mockShellyUrl).includes(SHELLY_WINDOW_INSTRUCTION_MESSAGE_TEXT),
        ).toBeTruthy()
    })
})
