import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
    MenuItem,
    Input,
    Divider,
    Tooltip,
    Button,
    SvgIcon,
    ListSubheader,
    Backdrop,
    useTheme,
    useMediaQuery,
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
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    // We use the dispatch to get the housing model from the redux state.
    const dispatch = useDispatch<Dispatch>()
    const { housingList, currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [modalAddHousingOpen, setModalAddHousingOpen] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(false)

    /**
     * Function to handle when selecting a housing.
     *
     * @param event Event from the select value.
     */
    const handleChange = async (event: SelectChangeEvent<number | string>) => {
        if (Number(event.target.value)) {
            // if it's a string it's ignored.
            dispatch.housingModel.setCurrentHousingState(event.target.value as number)
            await dispatch.housingModel.loadHousingScopesFromId(currentHousing?.id)
        }
    }
    return (
        <>
            <div className="w-full flex justify-start items-center truncate">
                <Select
                    className="w-full flex justify-center items-center"
                    displayEmpty={!currentHousing?.address.name}
                    labelId="select-housing-label"
                    id="select-housing"
                    value={currentHousing?.id ?? ''}
                    onChange={handleChange}
                    input={<Input disableUnderline />}
                    sx={{ maxWidth: smDown ? '100%' : '250px' }}
                    renderValue={() => {
                        return (
                            <div className="underline truncate">
                                {!currentHousing?.address.name
                                    ? 'Aucun logement disponible'
                                    : currentHousing?.address?.name}
                            </div>
                        )
                    }}
                    defaultValue={'Aucun logement disponible'}
                    MenuProps={MenuProps}
                    onOpen={() => setOpenBackdrop(true)}
                    onClose={() => setOpenBackdrop(false)}
                >
                    {housingList?.map((housing) => (
                        <MenuItem key={housing.id} value={housing.id} className="flex justify-between">
                            <TypographyFormatMessage className="mr-8 whitespace-normal">
                                {housing.address.name}
                            </TypographyFormatMessage>
                            <Link to={`/my-houses/${housing.id}`}>
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
                        </Tooltip>
                    </ListSubheader>
                </Select>
            </div>
            <Backdrop open={openBackdrop} onClick={() => setOpenBackdrop(true)} />
            <AddHousingModal modalOpen={modalAddHousingOpen} closeModal={() => setModalAddHousingOpen(false)} />
        </>
    )
}
