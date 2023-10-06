import { useMemo, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton, TextField, Autocomplete } from '@mui/material'
import { Close } from '@mui/icons-material'
import { AddEquipmentPopupProps } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup/addEquipmentPopup'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useIntl } from 'react-intl'
import { mapppingEquipmentToLabel } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { orderBy } from 'lodash'
import { useState } from 'react'
import { ButtonLoader } from 'src/common/ui-kit'
import { equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * AddEquipmentPopup component.
 *
 * @param props N/A.
 * @returns AddEquipmentPopup JSX.
 */
export const AddEquipmentPopup = (props: AddEquipmentPopupProps) => {
    const { isOpen, onClosePopup, equipmentsList } = props
    const { formatMessage } = useIntl()
    const [equipmentValue, setEquipmentValue] = useState<string | equipmentType | null>(null)
    const [inputValue, setInputValue] = useState('')
    const customEquipmentRef = useRef('')

    const orderedEquipmentsList = useMemo(
        () => [
            ...orderBy(equipmentsList, (el) => el.name, 'asc').filter((el) => mapppingEquipmentToLabel[el.name]),
            { id: Math.random(), name: 'other', allowed_type: ['electricity'] } as unknown as equipmentType,
        ],
        [equipmentsList],
    )

    return (
        <Dialog
            open={isOpen}
            onClose={onClosePopup}
            sx={{
                '.MuiPaper-root': {
                    padding: 1,
                },
            }}
            fullWidth
            maxWidth="sm"
        >
            <div className="flex flex-row justify-between items-center">
                <DialogTitle>Nouvel Equipement</DialogTitle>
                <IconButton onClick={onClosePopup} className="p-10">
                    <Close />
                </IconButton>
            </div>
            <DialogContent>
                <TypographyFormatMessage className="text-15">Type of equipement :</TypographyFormatMessage>
                <div className="mt-10">
                    <Autocomplete
                        freeSolo
                        value={equipmentValue}
                        onChange={(_event, value) => setEquipmentValue(value as equipmentType)}
                        options={orderedEquipmentsList}
                        inputValue={inputValue}
                        onInputChange={(_event, newInputValue) => {
                            setInputValue(newInputValue)
                        }}
                        getOptionLabel={(option) =>
                            formatMessage({
                                id: mapppingEquipmentToLabel[option.name]!,
                                defaultMessage: mapppingEquipmentToLabel[option.name]!,
                            })
                        }
                        renderInput={(params) => <TextField {...params} />}
                    />
                    {inputValue === 'Autre' && (
                        <TextField
                            name="other"
                            placeholder="Saisisez votre équipement"
                            className="mt-16"
                            fullWidth
                            inputRef={customEquipmentRef}
                        />
                    )}
                </div>
                <div className="flex justify-center items-center mt-16">
                    <ButtonLoader disabled={!equipmentValue}>
                        <TypographyFormatMessage>Enregister</TypographyFormatMessage>
                    </ButtonLoader>
                </div>
            </DialogContent>
        </Dialog>
    )
}
