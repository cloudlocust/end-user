import { FC, useEffect, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useTheme } from '@mui/material/styles'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList'
import { Icon } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useHistory, useParams } from 'react-router-dom'
import {
    IEcogestCategory,
    IEcogestHeaderProps,
    IEcogestPageComponentProps,
    IEcogesteListPageProps,
} from 'src/modules/Ecogestes/components/ecogeste'
import useEcogestePoles from '../../hooks/polesHooks'
import { IEcogesteCategoryTypes } from '../../EcogestesConfig'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'

/**
 * EcogestList Header Component.
 *
 * @param root0 Props (extend default component Props).
 * @param root0.isLoading Loading State of @useEcogestPoles Hooks.
 * @param root0.currentCategory Current Ecogest Category.
 * @returns HeaderComponent.
 */
const EcogestListHeader = ({ isLoading, currentCategory }: IEcogestHeaderProps): JSX.Element => {
    const theme = useTheme()
    const history = useHistory()

    return (
        <div className="w-full h-full p-10 flex flex-nowrap flex-col gap-1 justify-around">
            {!isLoading && currentCategory && currentCategory.name && currentCategory.icon ? (
                <>
                    <IconButton
                        aria-label="Previous"
                        onClick={() => history.goBack()}
                        size="large"
                        style={{ color: theme.palette.secondary.light, position: 'absolute' }}
                    >
                        <Icon>chevron_left </Icon>
                    </IconButton>
                    <Icon
                        sx={{ color: theme.palette.secondary.light }}
                        aria-hidden="true"
                        color="inherit"
                        style={{ height: '75%', alignSelf: 'center', width: '100%', margin: 'auto' }}
                    >
                        <img
                            style={{
                                filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light}) drop-shadow(0 0 0 ${theme.palette.primary.light})`,
                                height: '100%',
                                margin: 'auto',
                            }}
                            src={currentCategory!.icon}
                            alt=""
                        ></img>
                    </Icon>

                    <TypographyFormatMessage className="text-center text-20 font-semibold">
                        {currentCategory!.name}
                    </TypographyFormatMessage>
                </>
            ) : (
                <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                        <CircularProgress size={32} />
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * EcogestList Content Component.
 *
 * @param root0 Props.
 * @param root0.currentCategory Current Ecogeste Category.
 * @param root0.elementList Current List of Ecogeste filtered by Ecogeste Category.
 * @returns JSX.Element.
 */
const EcogestListContent = ({ currentCategory, elementList }: IEcogestPageComponentProps): JSX.Element => {
    return currentCategory?.id && elementList ? (
        <div className="m-10 p-10">
            <EcogestesList />
        </div>
    ) : (
        <div className="w-full h-full justify-center relative flex flex-col items-center align-center p-16">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                <CircularProgress size={32} />
            </div>
        </div>
    )
}

/**
 * EcogestListPage.
 *
 * @param root0 Props.
 * @param root0.categoryType Category of the Ecogeste.
 * @returns EcogestPage.
 */
const EcogestListPage: FC<IEcogesteListPageProps> = ({
    categoryType = IEcogesteCategoryTypes.CONSUMPTION,
}): JSX.Element => {
    const { categoryId } = useParams</**
     * Params object.
     */
    {
        /**
         * The category id of the ecogestes.
         */
        categoryId: string
    }>()

    const categoryIdInt = categoryId ? parseInt(categoryId) : undefined
    const { loadingInProgress, elementList } = useEcogestePoles()

    const [currentCategory, setCurrentCategory] = useState<IEcogestCategory | undefined | null>()

    useEffect(() => {
        let _category = elementList?.find((element) => element.id === categoryIdInt)
        setCurrentCategory(_category ? _category : null)
    }, [elementList, categoryIdInt])

    return (
        <PageSimple
            header={<EcogestListHeader isLoading={loadingInProgress} currentCategory={currentCategory} />}
            content={<EcogestListContent currentCategory={currentCategory} elementList={elementList} />}
        />
    )
}

export default EcogestListPage
