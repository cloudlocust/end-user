import { isEmpty, isNull } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import useEcogestes from 'src/modules/Ecogestes/ecogestesHook'
import { useParams } from 'react-router-dom'
import { EcogesteCard } from 'src/modules/Ecogestes'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Button, Menu, MenuItem, MenuList, SvgIcon } from '@mui/material'
import { useEffect, useState } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { ReactComponent as NotViewIcon } from 'src/modules/Ecogestes/components/ecogesteCard/NotRead.svg'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { EcogestViewedEnum } from 'src/modules/Ecogestes/components/ecogeste.d'

/**
 * Just a spinner to indicate that we're loading some datas.
 *
 * @returns JSX.Element - SpinningLoader.
 */
const EcogesteListLoadingComponent = () => {
    return (
        <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        </div>
    )
}
/**
 * Get an icon elment fragment corresponding to the given filter.
 *
 * @param filter The filter to get the icon for.
 * @returns The icon element JSX fragment, all subclasses of SvgIcon.
 */
const getFilterIcon = (filter: EcogestViewedEnum) => {
    switch (filter) {
        case EcogestViewedEnum.READ:
            return <VisibilityIcon />
        case EcogestViewedEnum.UNREAD:
            return (
                <SvgIcon className="pt-4" inheritViewBox fontSize="inherit">
                    <NotViewIcon />
                </SvgIcon>
            )
        default:
            return <FilterListIcon />
    }
}

/**
 * Given a category of ecogestes,
 * fetch and display a list of ecogestes.
 * Temporary display until we have category cards.
 *
 * @returns A Component which displays and filter a list of ecogestes.
 */
export const EcogestesList = () => {
    /**
     * Mandatory...
     * If we don't do that we got a Re-render and some bugs like all ecogeste instead of Ecogeste linked to a Category...
     */
    const { categoryId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes. Use 0 for all.
         */
        categoryId: string
    }>()

    const categoryIdInt = categoryId ? parseInt(categoryId) : undefined

    const {
        elementList: ecogestesList,
        loadingInProgress: isEcogestesLoadingInProgress,
        filterEcogestes,
    } = useEcogestes()

    const [currentViewFilter, setCurrentViewFilter] = useState<EcogestViewedEnum>(EcogestViewedEnum.ALL)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    /**
     * Handle the click event on the filter button dropdown.
     *
     * @param event The click event.
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    /**
     * Handle how to close the dropdown menu.
     */
    const handleClose = () => {
        setAnchorEl(null)
    }

    /**
     * Handled clicks on the filter menu items.
     *
     * @param viewed The filter to set.
     */
    const handleFilterClick = (viewed: EcogestViewedEnum) => {
        setCurrentViewFilter(viewed)
        filterEcogestes({ viewed, tag_id: categoryIdInt })
        handleClose()
    }

    useEffect(() => {
        if (categoryIdInt) {
            filterEcogestes({ viewed: currentViewFilter, tag_id: categoryIdInt })
        }
        // We don't want an update for every change in our deps, only at mount.
        // Hence why we have empty deps array.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="flex justify-between w-full">
                <TypographyFormatMessage variant="h2" className="text-20 mb-20 font-bold">
                    {categoryIdInt ? `Les écogestes associés` : 'Liste de tous les écogestes:'}
                </TypographyFormatMessage>
                <div>
                    <Button
                        variant="outlined"
                        startIcon={getFilterIcon(currentViewFilter)}
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={handleClick}
                        aria-label="button, filter"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <TypographyFormatMessage className="font-semibold text-center" color="ButtonText">
                            Filtrer
                        </TypographyFormatMessage>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'button, filter',
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{
                            sx: {
                                minWidth: '12rem',
                            },
                        }}
                    >
                        <MenuList dense>
                            <MenuItem onClick={() => handleFilterClick(EcogestViewedEnum.READ)}>
                                <TypographyFormatMessage>Lu</TypographyFormatMessage>
                            </MenuItem>
                            <MenuItem onClick={() => handleFilterClick(EcogestViewedEnum.UNREAD)}>
                                <TypographyFormatMessage>Non lu</TypographyFormatMessage>
                            </MenuItem>
                            <MenuItem onClick={() => handleFilterClick(EcogestViewedEnum.ALL)}>
                                <TypographyFormatMessage>Tous</TypographyFormatMessage>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>
            {(isEmpty(ecogestesList) || isNull(ecogestesList)) &&
                !isEcogestesLoadingInProgress &&
                "Aucun écogeste n'est disponible pour le moment."}
            <div
                className="flex flex-nowrap gap-5 flex-col sm:flex-row  w-full sm:flex-wrap h-full sm:h-auto"
                aria-label="list, ecogests, cards"
            >
                {isEcogestesLoadingInProgress ? (
                    <EcogesteListLoadingComponent />
                ) : (
                    ecogestesList?.map((ecogeste) => <EcogesteCard key={ecogeste.id} ecogeste={ecogeste} />)
                )}
            </div>
        </>
    )
}

export default EcogestesList
