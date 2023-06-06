import React from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { ButtonLoader, TextField } from 'src/common/ui-kit'
import { Form, max, min, requiredBuilder } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { useMeterForHousing } from 'src/modules/Meters/metersHook'
import { addMeterInputType } from 'src/modules/Meters/Meters'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'src/redux'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * This is a card for the display of a housing item.
 *
 * @param props Props.
 * @param props.element Logement object we cant to display.
 * @returns Card.
 */
const MeterInfos = ({
    element: housing,
}: /**
 * Props Typing.
 */
{
    /**
     * The fields required for the display of the housing.
     */
    element?: IHousing
}) => {
    const { formatMessage } = useIntl()

    const [addMeterOpen, setAddMeterOpen] = React.useState(false)

    const { addMeter, loadingInProgress: isMeterInProgress } = useMeterForHousing()

    const dispatch = useDispatch<Dispatch>()

    /**
     * What should be done when closing the add meter popup.
     */
    const handleCloseAddMeterOpen = () => {
        setAddMeterOpen(false)
    }

    /**
     * What should be done when opening add meter pop up.
     */
    const handleOpenAddMeterOpen = () => {
        setAddMeterOpen(true)
    }

    /**
     * Handler onAfterDeleteUpdateSuccess function when updating or delete housing.
     */
    const onAfterDeleteUpdateSuccess = () => {
        dispatch.housingModel.loadHousingsList()
    }

    return (
        <>
            {housing && housing?.meter?.guid ? (
                <div className="flex flex-col justify-between">
                    <div className="flex flex-row items-center">
                        <TypographyFormatMessage className="text-base font-medium mr-8">
                            Compteur
                        </TypographyFormatMessage>
                    </div>
                    <Typography className="text-grey-600 text-base">{`n° ${housing?.meter.guid}`}</Typography>
                </div>
            ) : (
                <Typography variant="subtitle1" className="text-13 md:text-16 flex">
                    <div
                        onClick={handleOpenAddMeterOpen}
                        className="underline opacity-100 hover:opacity-70"
                        style={{ color: linksColor || warningMainHashColor, cursor: 'pointer' }}
                    >
                        {formatMessage({
                            id: 'Veuillez renseigner votre compteur',
                            defaultMessage: 'Veuillez renseigner votre compteur',
                        })}
                    </div>
                </Typography>
            )}
            <Modal open={addMeterOpen} onClose={handleCloseAddMeterOpen}>
                <Form
                    onSubmit={async (value: addMeterInputType) => {
                        if (!housing) return
                        await addMeter(housing.id, value)
                        onAfterDeleteUpdateSuccess()
                        handleCloseAddMeterOpen()
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                        }}
                    >
                        <Card className="relative cursor-pointer flex-wrap rounded-16">
                            <CardContent className="mt-10">
                                <TextField
                                    name="guid"
                                    label="Numéro de PDL ou PRM"
                                    placeholder={formatMessage({
                                        id: 'Ex: 12345678912345',
                                        defaultMessage: 'Ex: 12345678912345',
                                    })}
                                    validateFunctions={[requiredBuilder(), min(14), max(14)]}
                                />
                            </CardContent>
                            <CardActions className="flex items-center content-center justify-center mb-10">
                                <Button variant="outlined" className="mr-4" onClick={handleCloseAddMeterOpen}>
                                    {formatMessage({
                                        id: 'Annuler',
                                        defaultMessage: 'Annuler',
                                    })}
                                </Button>
                                <ButtonLoader
                                    inProgress={isMeterInProgress}
                                    variant="contained"
                                    type="submit"
                                    className="ml-4"
                                >
                                    {formatMessage({ id: 'Enregistrer', defaultMessage: 'Enregistrer' })}
                                </ButtonLoader>
                            </CardActions>
                        </Card>
                    </Box>
                </Form>
            </Modal>
        </>
    )
}
export default MeterInfos
