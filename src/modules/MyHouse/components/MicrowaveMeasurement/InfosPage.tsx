import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
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
        <Box display="flex" gap="10px" marginTop="5px">
            <Box
                height="8px"
                width="8px"
                borderRadius="50px"
                bgcolor={(theme) => theme.palette.primary.main}
                flexShrink="0"
                sx={{ transform: 'translateY(5px)' }}
            />
            <Typography>{children}</Typography>
        </Box>
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
        <Box display="flex" gap="10px" marginTop="5px">
            <Typography width="8px" textAlign="right">
                {index}.
            </Typography>
            <Typography>{children}</Typography>
        </Box>
    )
}

/**
 * InfosPage component.
 *
 * @param root0 N/A.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The InfosPage component.
 */
const InfosPage = ({ stepSetter }: InfosPageProps) => {
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
        <Box>
            {/* Header */}
            <Box textAlign="center" marginBottom="20px">
                <Typography component="h2" fontWeight="500" fontSize="18px">
                    Mesure d'appareil
                </Typography>
                <Typography component="h2" fontWeight="500" fontSize="18px" color="primary">
                    Micro Onde
                </Typography>
            </Box>

            {/* Content */}
            <Box>
                <Typography fontWeight="500">Tester votre appareil vous permet de&nbsp;:</Typography>
                <Box paddingLeft="20px" marginBottom="20px">
                    {testBenefits.map((item, i) => (
                        <CustomUnorderedListItem key={i}>{item}</CustomUnorderedListItem>
                    ))}
                </Box>

                <Typography fontWeight="500">Le test se déroule en 4 étapes&nbsp;:</Typography>
                <Box paddingLeft="20px" marginBottom="15px">
                    {testSteps.map((item, i) => (
                        <CustomOrderedListItem index={i + 1} key={i}>
                            {item}
                        </CustomOrderedListItem>
                    ))}
                </Box>

                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        sx={{ textAlign: 'center', padding: '6px 40px' }}
                        onClick={handleBtnClick}
                    >
                        Commencer
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default InfosPage
