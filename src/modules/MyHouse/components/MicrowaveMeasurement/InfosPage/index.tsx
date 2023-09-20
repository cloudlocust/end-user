import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useIntl } from 'react-intl'
import {
    CustomOrderedListItemProps,
    CustomUnorderedListItemProps,
    InfosPageProps,
} from 'src/modules/MyHouse/components/MicrowaveMeasurement/MicrowaveMeasurement.d'

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
            <Typography>{children}</Typography>
        </div>
    )
}

/**
 * CustomOrderedListItem component.
 *
 * @param root0 N/A.
 * @param root0.children Children elements of the list item.
 * @param root0.index The order of the item list.
 * @returns The CustomOrderedListItem component.
 */
const CustomOrderedListItem = ({ children, index }: CustomOrderedListItemProps) => {
    return (
        <div className="flex gap-7 mt-4">
            <Typography width="8px" textAlign="right">
                {index}.
            </Typography>
            <Typography>{children}</Typography>
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
        formatMessage({
            id: 'Vérifier l’état de votre appareil',
            defaultMessage: 'Vérifier l’état de votre appareil',
        }),
        formatMessage({
            id: 'Comparer votre utilisation à celui des autres utilisateurs',
            defaultMessage: 'Comparer votre utilisation à celui des autres utilisateurs',
        }),
        formatMessage({
            id: 'Alimenter la rubrique “Conseils”',
            defaultMessage: 'Alimenter la rubrique “Conseils”',
        }),
    ]

    const testSteps = [
        formatMessage({
            id: 'Selection de l’appareil et du mode à tester',
            defaultMessage: 'Selection de l’appareil et du mode à tester',
        }),
        formatMessage({
            id: 'Mise en marche de l’appareil',
            defaultMessage: 'Mise en marche de l’appareil',
        }),
        formatMessage({
            id: 'Visualisation en direct des résultats',
            defaultMessage: 'Visualisation en direct des résultats',
        }),
        formatMessage({
            id: 'Analyse des résultats',
            defaultMessage: 'Analyse des résultats',
        }),
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
                {/* The test benefits */}
                <div className="mb-20">
                    <Typography fontWeight="500">
                        {formatMessage({
                            id: 'Tester votre appareil vous permet de',
                            defaultMessage: 'Tester votre appareil vous permet de',
                        })}
                        &nbsp;:
                    </Typography>
                    <div className="pl-20">
                        {testBenefits.map((item, i) => (
                            <CustomUnorderedListItem key={i}>{item}</CustomUnorderedListItem>
                        ))}
                    </div>
                </div>

                {/* The test steps */}
                <div className="mb-20">
                    <Typography fontWeight="500">
                        {formatMessage({
                            id: 'Le test se déroule en 4 étapes',
                            defaultMessage: 'Le test se déroule en 4 étapes',
                        })}
                        &nbsp;:
                    </Typography>
                    <div className="pl-20">
                        {testSteps.map((item, i) => (
                            <CustomOrderedListItem index={i + 1} key={i}>
                                {item}
                            </CustomOrderedListItem>
                        ))}
                    </div>
                </div>

                {/* The test starting button */}
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
