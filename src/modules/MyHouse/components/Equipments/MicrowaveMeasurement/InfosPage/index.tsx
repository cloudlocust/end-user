import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useIntl } from 'react-intl'
import {
    CustomOrderedListItemProps,
    CustomUnorderedListItemProps,
    InfosPageProps,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * CustomUnorderedListItem component.
 *
 * @param root0 N/A.
 * @param root0.children Children elements of the list item.
 * @returns The CustomUnorderedListItem component.
 */
const CustomUnorderedListItem = ({ children }: CustomUnorderedListItemProps) => {
    return (
        <div className="flex gap-7 mt-4">
            <Box
                height="8px"
                width="8px"
                borderRadius="50px"
                bgcolor={(theme) => theme.palette.primary.main}
                flexShrink="0"
                sx={{ transform: 'translateY(5px)' }}
            />
            {children}
        </div>
    )
}

/**
 * CustomOrderedListItem component.
 *
 * @param root0 N/A.
 * @param root0.children Children elements of the list item.
 * @param root0.order The order of the item list.
 * @returns The CustomOrderedListItem component.
 */
const CustomOrderedListItem = ({ children, order }: CustomOrderedListItemProps) => {
    return (
        <div className="flex gap-7 mt-4">
            <Typography width="8px" textAlign="right">
                {order}.
            </Typography>
            {children}
        </div>
    )
}

/**
 * InfosPage component.
 *
 * @param root0 N/A.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The InfosPage component.
 */
export const InfosPage = ({ stepSetter }: InfosPageProps) => {
    const { formatMessage } = useIntl()

    const testBenefits = [
        'Vérifier l’état de votre appareil',
        'Comparer votre utilisation à celui des autres utilisateurs',
        'Alimenter la rubrique “Conseils”',
    ]

    const testSteps = [
        'Selection de l’appareil et du mode à tester',
        'Mise en marche de l’appareil',
        'Visualisation en direct des résultats',
        'Analyse des résultats',
    ]

    /**
     * Click handler for the button Commencer.
     */
    const handleBtnClick = () => {
        stepSetter(1)
    }

    return (
        <>
            {/* Header */}
            <div className="text-center mb-20">
                <Typography component="h2" fontWeight="500" fontSize="18px">
                    {formatMessage({
                        id: "Mesure d'appareil",
                        defaultMessage: "Mesure d'appareil",
                    })}
                </Typography>
                <Typography component="h2" fontWeight="500" fontSize="18px" color="primary">
                    {formatMessage({
                        id: 'Micro Onde',
                        defaultMessage: 'Micro Onde',
                    })}
                </Typography>
            </div>

            {/* Content */}
            <div>
                {/* The measurement benefits */}
                <div className="mb-20">
                    <TypographyFormatMessage display="inline" fontWeight="500">
                        Tester votre appareil vous permet de
                    </TypographyFormatMessage>
                    &nbsp;:
                    <div className="pl-20">
                        {testBenefits.map((item, index) => (
                            <CustomUnorderedListItem key={index}>
                                <TypographyFormatMessage>{item}</TypographyFormatMessage>
                            </CustomUnorderedListItem>
                        ))}
                    </div>
                </div>

                {/* The measurement steps */}
                <div className="mb-20">
                    <TypographyFormatMessage display="inline" fontWeight="500">
                        Le test se déroule en 4 étapes
                    </TypographyFormatMessage>
                    &nbsp;:
                    <div className="pl-20">
                        {testSteps.map((item, index) => (
                            <CustomOrderedListItem order={index + 1} key={index}>
                                <TypographyFormatMessage>{item}</TypographyFormatMessage>
                            </CustomOrderedListItem>
                        ))}
                    </div>
                </div>

                {/* The measurement starting button */}
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={handleBtnClick}
                    >
                        {formatMessage({
                            id: 'Commencer',
                            defaultMessage: 'Commencer',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}
