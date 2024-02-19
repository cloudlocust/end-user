import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmProvider } from 'material-ui-confirm'
import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import ConsumptionLabelCard from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard'
import { ConsumptionLabelCardProps } from 'src/modules/MyConsumption/components/LabelizationContainer/ConsumptionLabelCard/ConsumptionLabelCard.types'

jest.mock('src/modules/MyConsumption/utils/unitConversionFunction', () => ({
    ...jest.requireActual('src/modules/MyConsumption/utils/unitConversionFunction'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    consumptionWattUnitConversion: (value: number) => ({ value, unit: 'kWh' }),
}))

const mockDeleteLabel = jest.fn()

const LABEL_ID = 14

let mockConsumptionLabelCardProp: ConsumptionLabelCardProps = {
    labelData: {
        labelId: LABEL_ID,
        equipmentName: 'Micro-onde',
        day: '2022-11-19',
        startTime: '02:50',
        endTime: '04:23',
        consumption: 54,
        consumptionPrice: 24,
        useType: 'Standard',
    },
    deleteLabel: mockDeleteLabel,
}

const POPUP_DIALOG_TEXT = 'Vous êtes sur le point de supprimer le label. Êtes-vous sûr de vouloir continuer ?'

describe('ConsumptionLabelCard', () => {
    test('render correctly the label card and opens the dialog when the delete button is clicked', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <ConfirmProvider>
                    <ConsumptionLabelCard {...mockConsumptionLabelCardProp} />
                </ConfirmProvider>
            </Router>,
        )

        expect(getByText(mockConsumptionLabelCardProp.labelData.equipmentName)).toBeInTheDocument()
        expect(getByText('Le')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.labelData.day)).toBeInTheDocument()
        expect(getByText('de')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.labelData.startTime)).toBeInTheDocument()
        expect(getByText('à')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.labelData.endTime)).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.labelData.consumption)).toBeInTheDocument()
        expect(getByText('kWh')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.labelData.consumptionPrice)).toBeInTheDocument()
        expect(getByText('€')).toBeInTheDocument()
        expect(getByText(mockConsumptionLabelCardProp.labelData.useType!)).toBeInTheDocument()
        const deleteButton = screen.getByRole('button', { name: /delete/i })
        userEvent.click(deleteButton)
        await waitFor(() => {
            expect(screen.getByText(POPUP_DIALOG_TEXT)).toBeInTheDocument()
        })
    })

    test('closes the dialog and call the revokeNrlinkConsent function when the button Continuer is clicked', async () => {
        reduxedRender(
            <Router>
                <ConfirmProvider>
                    <ConsumptionLabelCard {...mockConsumptionLabelCardProp} />
                </ConfirmProvider>
            </Router>,
        )

        const deleteButton = screen.getByRole('button', { name: /delete/i })
        userEvent.click(deleteButton)
        await waitFor(async () => {
            const continueButton = screen.getByRole('button', { name: 'Continuer' })
            userEvent.click(continueButton)
            await waitFor(() => {
                expect(screen.queryByText(POPUP_DIALOG_TEXT)).toBeNull()
                expect(mockDeleteLabel).toHaveBeenCalledWith(LABEL_ID)
            })
        })
    })

    test('should render correctly when useType is not specified', () => {
        mockConsumptionLabelCardProp.labelData.useType = undefined
        const { queryByLabelText } = reduxedRender(
            <Router>
                <ConsumptionLabelCard {...mockConsumptionLabelCardProp} />
            </Router>,
        )

        expect(queryByLabelText('useType')).toBeNull()
    })
})
