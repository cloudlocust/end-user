import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import { MoreAdviceInformationPopup } from 'src/modules/Dashboard/AdviceContainer/components/MoreAdviceInformationPopup'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('MoreAdviceInformationPopup', () => {
    test('should render with the correct props', () => {
        const isOpen = true
        const onClose = jest.fn()
        const currentEcogeste: IEcogeste = applyCamelCase(TEST_ECOGESTES[1])

        const { getByText } = reduxedRender(
            <Router>
                <MoreAdviceInformationPopup isOpen={isOpen} onClose={onClose} currentEcogeste={currentEcogeste} />,
            </Router>,
        )

        expect(getByText(currentEcogeste.title)).toBeInTheDocument()
        expect(getByText(currentEcogeste.description)).toBeInTheDocument()
        expect(getByText(currentEcogeste.infos)).toBeInTheDocument()
    })
    test('when clicked on close button, should call onClose', () => {
        const isOpen = true
        const onClose = jest.fn()
        const currentEcogeste: IEcogeste = applyCamelCase(TEST_ECOGESTES[1])

        const { getByTestId } = reduxedRender(
            <Router>
                <MoreAdviceInformationPopup isOpen={isOpen} onClose={onClose} currentEcogeste={currentEcogeste} />,
            </Router>,
        )

        userEvent.click(getByTestId('CloseIcon'))

        expect(onClose).toHaveBeenCalled()
    })
    test('when clicked on more advice button, user is redirect to /advices route', () => {
        const isOpen = true
        const onClose = jest.fn()
        const currentEcogeste: IEcogeste = applyCamelCase(TEST_ECOGESTES[1])

        const { getByText } = reduxedRender(
            <Router>
                <MoreAdviceInformationPopup isOpen={isOpen} onClose={onClose} currentEcogeste={currentEcogeste} />,
            </Router>,
        )

        userEvent.click(getByText('Plus de conseils'))

        expect(window.location.pathname).toBe('/advices')
    })
})
