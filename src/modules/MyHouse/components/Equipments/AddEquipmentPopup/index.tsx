import { useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle, IconButton, TextField, Select, MenuItem } from '@mui/material'
import { Close } from '@mui/icons-material'
import { AddEquipmentPopupProps } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup/addEquipmentPopup'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useIntl } from 'react-intl'
import { mapppingEquipmentToLabel } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { orderBy } from 'lodash'
import { useState } from 'react'
import { ButtonLoader } from 'src/common/ui-kit'
import { equipmentNameType, equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'

/**
 * AddEquipmentPopup component.
 *
 * @param props N/A.
 * @returns AddEquipmentPopup JSX.
 */
export const AddEquipmentPopup = (props: AddEquipmentPopupProps) => {
    const { isOpen, onClosePopup, equipmentsList, addEquipment, isaAdEquipmentLoading } = props
    const { formatMessage } = useIntl()
    const [equipmentValue, setEquipmentValue] = useState<equipmentType | 'other' | ''>('')
    const [customEquipmentValue, setCustomEquipmentValue] = useState('')

    const orderedEquipmentsList = useMemo(
        () => [
            ...orderBy(equipmentsList, (el) => el.name, 'asc').filter(
                (el) => mapppingEquipmentToLabel[el.name as unknown as equipmentNameType],
            ),
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
            <div className="flex flex-row justify-center items-center relative">
                <DialogTitle>Nouvel Equipement</DialogTitle>
                <IconButton onClick={onClosePopup} className="p-10 absolute right-0 top-0">
                    <Close />
                </IconButton>
            </div>
            <DialogContent>
                <TypographyFormatMessage className="text-15">Type d'equipement :</TypographyFormatMessage>
                <div className="mt-10">
                    <Select
                        value={equipmentValue}
                        onChange={(event) => setEquipmentValue(event.target.value as equipmentType)}
                        fullWidth
                        data-testid={'equipments-select'}
                    >
                        {orderedEquipmentsList.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {formatMessage({
                                    id: mapppingEquipmentToLabel[option.name as unknown as equipmentNameType]!,
                                    defaultMessage:
                                        mapppingEquipmentToLabel[option.name as unknown as equipmentNameType]!,
                                })}
                            </MenuItem>
                        ))}
                    </Select>
                    {equipmentValue === 'other' && (
                        <TextField
                            name="other"
                            placeholder="Saisisez votre équipement"
                            className="mt-16"
                            fullWidth
                            onChange={(e) => setCustomEquipmentValue(e.target.value)}
                            error={customEquipmentValue.length <= 0}
                            helperText={customEquipmentValue.length <= 0 && "Veuillez saisir un nom d'équipement"}
                        />
                    )}
                </div>
                <div className="flex justify-center items-center mt-16">
                    <ButtonLoader
                        disabled={
                            equipmentValue.toString().length <= 0 ||
                            (equipmentValue === 'other' && customEquipmentValue.length <= 0)
                        }
                        onClick={async () => {
                            await addEquipment({
                                name: equipmentValue === 'other' ? customEquipmentValue : (equipmentValue as string),
                                allowedType: ['electricity'],
                            })
                            onClosePopup()
                        }}
                        inProgress={isaAdEquipmentLoading}
                    >
                        <TypographyFormatMessage>Enregistrer</TypographyFormatMessage>
                    </ButtonLoader>
                </div>
            </DialogContent>
        </Dialog>
    )
}
