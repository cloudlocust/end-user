import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Divider,
    Tooltip,
    Button,
    SvgIcon,
    ListSubheader,
} from '@mui/material'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import SettingsIcon from '@mui/icons-material/Settings'
import { deleteAddFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import AddHousingModal from 'src/modules/Layout/Toolbar/components/AddHousingModal'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

/**
 * Styling applied to the menu (options) of the select.
 */
const MenuProps = {
    PaperProps: {
        sx: {
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
export const SelectHousing = () => {
    const { formatMessage } = useIntl()
    // We use the dispatch to get the housing model from the redux state.
    const dispatch = useDispatch<Dispatch>()
    const { housingList, currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [modalAddHousingOpen, setModalAddHousingOpen] = useState(false)

    /**
     * Function to handle when selecting a housing.
     *
     * @param event Event from the select value.
     */
    const handleChange = (event: SelectChangeEvent<number | string>) => {
        if (Number(event.target.value))
            // if it's a string it's ignored.
            dispatch.housingModel.setCurrentHousingState(event.target.value as number)
    }
    return (
        <>
            <FormControl>
                <InputLabel id="select-housing-label">
                    {currentHousing?.id
                        ? formatMessage({
                              id: 'Logements',
                              defaultMessage: 'Logements',
                          })
                        : formatMessage({
                              id: 'Aucun logement disponible',
                              defaultMessage: 'Aucun logement disponible',
                          })}
                </InputLabel>
                <Select
                    labelId="select-housing-label"
                    id="select-housing"
                    value={currentHousing?.id ?? ''}
                    onChange={handleChange}
                    input={<OutlinedInput label="Logement" />}
                    renderValue={() => <>{currentHousing?.address.name}</>}
                    MenuProps={MenuProps}
                    disabled={!currentHousing?.id}
                >
                    {housingList?.map((housing) => (
                        <MenuItem key={housing.id} value={housing.id} className="flex justify-between">
                            <TypographyFormatMessage className="mr-8" noWrap>
                                {housing.address.name}
                            </TypographyFormatMessage>
                            <Link
                                to={'/my-houses/' + housing.id}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <SettingsIcon sx={{ color: 'grey.600' }} />
                            </Link>
                        </MenuItem>
                    ))}
                    <ListSubheader>
                        <Divider className="my-8" />
                        <Tooltip
                            arrow
                            placement="top"
                            disableHoverListener={!deleteAddFeatureState}
                            title={formatMessage({
                                id: "Cette fonctionnalité n'est pas encore disponible",
                                defaultMessage: "Cette fonctionnalité n'est pas encore disponible",
                            })}
                        >
                            <div className={`flex justify-center ${deleteAddFeatureState && 'cursor-not-allowed'}`}>
                                <Button
                                    variant="text"
                                    disabled={deleteAddFeatureState}
                                    startIcon={
                                        <SvgIcon color={deleteAddFeatureState ? 'disabled' : 'inherit'}>
                                            <AddIcon />
                                        </SvgIcon>
                                    }
                                    onClick={() => setModalAddHousingOpen(true)}
                                >
                                    {formatMessage({
                                        id: 'Ajouter un logement',
                                        defaultMessage: 'Ajouter un logement',
                                    })}
                                </Button>
                            </div>
                        </Tooltip>{' '}
                    </ListSubheader>
                </Select>
            </FormControl>
            <AddHousingModal modalOpen={modalAddHousingOpen} closeModal={() => setModalAddHousingOpen(false)} />
        </>
    )
}
