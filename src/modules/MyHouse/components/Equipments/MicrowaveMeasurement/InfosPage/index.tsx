import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useIntl } from 'src/common/react-platform-translation'
import {
    CustomOrderedListItemProps,
    InfosPageProps,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/InfosPage/InfosPage.d'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * ListItemCircle component.
 *
 * @returns The circle shape to decorate text items.
 */
const ListItemCircle = () => (
    <Box
        height="6px"
        width="6px"
        borderRadius="50px"
        bgcolor={(theme) => theme.palette.primary.main}
        flexShrink="0"
        sx={{ transform: 'translateY(7px)' }}
    />
)

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
        <div className="flex gap-7 mt-10">
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

    const testSteps = [
        "Choisissez le réglage de l'appareil que vous souhaitez mesurer",
        'Mettez en route de votre appareil',
        'Lancez la mesure',
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
            <div className="flex-1 flex flex-col justify-center gap-14">
                <div className="flex gap-7 mb-20">
                    <ListItemCircle />
                    <TypographyFormatMessage fontWeight="500">
                        Grâce à votre nrLINK, vous avez la possibilité de surveiller l'efficacité énergétique de vos
                        appareils.
                    </TypographyFormatMessage>
                </div>

                {/* The measurement steps */}
                <div className="mb-20">
                    <div className="flex gap-7">
                        <ListItemCircle />
                        <div>
                            <TypographyFormatMessage display="inline" fontWeight="500">
                                Analysons ensemble la consommation moyenne de votre appareil en suivant 3 étapes simples
                            </TypographyFormatMessage>
                            &nbsp;:
                        </div>
                    </div>

                    <div className="pl-20">
                        {testSteps.map((item, index) => (
                            <CustomOrderedListItem order={index + 1} key={index}>
                                <TypographyFormatMessage>{item}</TypographyFormatMessage>
                            </CustomOrderedListItem>
                        ))}
                    </div>
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
        </>
    )
}
