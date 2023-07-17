import { useState } from 'react'
import { Button, Box, FormControlLabel, FormControl, RadioGroup, Radio } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { ISelectConnectedPlugProductionList } from 'src/modules/MyHouse/components/MeterStatus/MeterStatus.d'

/**
 * Select Connected Plug Production List.
 *
 * @param props N/A.
 * @param props.connectedPlugList Connected Plug List.
 * @param props.onSubmit Callback when selecting a connected plug.
 * @returns Select Connected Plug Production List.
 */
const ConnectedPlugProductionListSelect = ({ connectedPlugList, onSubmit }: ISelectConnectedPlugProductionList) => {
    const [selectedConnectedPlug, setSelectedConnectedPlug] = useState<string | null>(null)

    /**
     * Handle Connected Plug Select Change.
     *
     * @param event Event.
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedConnectedPlug((event.target as HTMLInputElement).value)
    }

    return (
        <Box>
            <div className="flex flex-col items-center justify-center h-full gap-20">
                <TypographyFormatMessage variant="h6" className="text-center font-semibold text-16 md:text-20">
                    Prises connectées
                </TypographyFormatMessage>

                <TypographyFormatMessage className="text-13 md:text-16">
                    {`Sélectionnez la prise connectée Shelly utilisée pour panneau plug&play`}
                </TypographyFormatMessage>

                <Box
                    className="w-full px-16"
                    sx={{
                        borderRadius: 0,
                        height: 250,
                        overflowY: 'auto',
                        borderColor: 'text.primary',
                        borderWidth: 0.25,
                        borderStyle: 'solid',
                    }}
                >
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={selectedConnectedPlug}
                            onChange={handleChange}
                        >
                            {connectedPlugList?.map((connectedPlug) => (
                                <FormControlLabel
                                    sx={{
                                        color:
                                            selectedConnectedPlug === connectedPlug.deviceId
                                                ? 'primary.main'
                                                : 'text.primary',
                                    }}
                                    value={connectedPlug.deviceId}
                                    control={<Radio color="primary" />}
                                    label={'Prise ' + connectedPlug.deviceId}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Button
                    className="whitespace-nowrap mt-10"
                    variant="contained"
                    disabled={!selectedConnectedPlug}
                    onClick={() => onSubmit(selectedConnectedPlug!)}
                >
                    <TypographyFormatMessage>Enregistrer</TypographyFormatMessage>{' '}
                </Button>
            </div>
        </Box>
    )
}

export default ConnectedPlugProductionListSelect
