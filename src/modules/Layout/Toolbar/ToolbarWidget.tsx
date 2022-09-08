import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'src/redux'
import UserMenu from 'src/modules/Layout/Toolbar/components/UserMenu'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import OutlinedInput from '@mui/material/OutlinedInput'
import { FormControl } from '@mui/material'
import { useIntl } from 'react-intl'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

/**
 * Styling applied to the menu (options) of the select.
 */
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

/**
 * ToolbarWidget include the content of the Toolbar.
 *
 * @returns ToolbarWidget Component.
 */
export const ToolbarWidget = () => {
    const { formatMessage } = useIntl()
    // We use the dispatch to get the housing model from the redux state.
    const dispatch = useDispatch<Dispatch>()
    const { housingList, currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    // when the toolbar mount we refetch the housings (this insure that the housings are updated when refresh the page)
    useEffect(() => {
        dispatch.housingModel.loadHousingsList()
    }, [dispatch.housingModel])

    /**
     * Function to handle when selecting a housing.
     *
     * @param event Event from the select value.
     */
    const handleChange = (event: SelectChangeEvent<number | string>) => {
        // if it's a string it's ignored.
        dispatch.housingModel.setCurrentHousingState(event.target.value as number)
    }

    return (
        <div className="flex flex-1 my-20 justify-between">
            <FormControl
                sx={{
                    '&.MuiFormControl-root': { marginBottom: '0px' },
                    width: 240,
                }}
            >
                <InputLabel id="select-housing-label">
                    {!currentHousing?.id
                        ? formatMessage({
                              id: 'Aucun logement disponible',
                              defaultMessage: 'Aucun logement disponible',
                          })
                        : formatMessage({
                              id: 'Logements',
                              defaultMessage: 'Logements',
                          })}
                </InputLabel>
                <Select
                    labelId="select-housing-label"
                    id="select-housing"
                    value={currentHousing?.id ?? ''}
                    onChange={handleChange}
                    input={<OutlinedInput label="Logement" />}
                    MenuProps={MenuProps}
                    disabled={!currentHousing?.id}
                >
                    {housingList?.map((housing) => (
                        <MenuItem key={housing.id} value={housing.id}>
                            {housing.address.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <UserMenu />
        </div>
    )
}
