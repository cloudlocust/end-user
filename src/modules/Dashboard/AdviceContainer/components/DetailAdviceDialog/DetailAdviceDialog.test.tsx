import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import { DetailAdviceDialog } from 'src/modules/Dashboard/AdviceContainer/components/DetailAdviceDialog'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'

describe('DetailAdviceDialog', () => {
    describe('DetailAdviceDialog for Dashboard page', () => {
        test('should render with the correct props', () => {
            const isOpen = true
            const onClose = jest.fn()
            const currentEcogeste: IEcogeste = applyCamelCase(TEST_ECOGESTES[1])

            const { getByText } = reduxedRender(
                <Router>
                    <DetailAdviceDialog
                        isDetailAdvicePopupOpen={isOpen}
                        onCloseDetailAdvicePopup={onClose}
                        currentEcogeste={currentEcogeste}
                        isDashboardAdvice
                    />
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
                    <DetailAdviceDialog
                        isDetailAdvicePopupOpen={isOpen}
                        onCloseDetailAdvicePopup={onClose}
                        currentEcogeste={currentEcogeste}
                        isDashboardAdvice
                    />
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
                    <DetailAdviceDialog
                        isDetailAdvicePopupOpen={isOpen}
                        onCloseDetailAdvicePopup={onClose}
                        currentEcogeste={currentEcogeste}
                        isDashboardAdvice
                    />
                </Router>,
            )

            userEvent.click(getByText('Plus de conseils'))

            expect(window.location.pathname).toBe('/advices')
        })
    })
    describe('DetailAdviceDialog for Advices page', () => {
        test('should render with the correct props when the ecogeste has been seen', async () => {
            const isOpen = true
            const mockOnClose = jest.fn()
            const mockSetViewStatus = jest.fn()
            const currentEcogeste: IEcogeste = applyCamelCase({ ...TEST_ECOGESTES[1], seen_by_customer: true })
            const { getByText } = reduxedRender(
                <Router>
                    <DetailAdviceDialog
                        isDetailAdvicePopupOpen={isOpen}
                        onCloseDetailAdvicePopup={mockOnClose}
                        currentEcogeste={currentEcogeste}
                        setViewStatus={mockSetViewStatus}
                    />
                </Router>,
            )

            const markAsDoneButton = getByText('Retirer')
            expect(markAsDoneButton).toBeInTheDocument()
            userEvent.click(markAsDoneButton)
            await waitFor(() => {
                expect(mockSetViewStatus).toHaveBeenCalledWith(currentEcogeste.id, false)
            })
        })
        test('should render with the correct props when the ecogeste has not been seen', async () => {
            const isOpen = true
            const mockOnClose = jest.fn()
            const mockSetViewStatus = jest.fn()
            const currentEcogeste: IEcogeste = applyCamelCase({ ...TEST_ECOGESTES[1], seen_by_customer: false })
            const { getByText } = reduxedRender(
                <Router>
                    <DetailAdviceDialog
                        isDetailAdvicePopupOpen={isOpen}
                        onCloseDetailAdvicePopup={mockOnClose}
                        currentEcogeste={currentEcogeste}
                        setViewStatus={mockSetViewStatus}
                    />
                </Router>,
            )

            const markAsDoneButton = getByText('C’est fait !')
            expect(markAsDoneButton).toBeInTheDocument()
            userEvent.click(markAsDoneButton)
            await waitFor(() => {
                expect(mockSetViewStatus).toHaveBeenCalledWith(currentEcogeste.id, true)
            })
        })
    })
})
