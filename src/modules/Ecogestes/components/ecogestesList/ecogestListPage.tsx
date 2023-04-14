import { FC, useEffect, useState } from 'react'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList'
import { Icon } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useParams } from 'react-router-dom'
import {
    IEcogestCategory,
    IEcogestHeaderProps,
    IEcogestPageComponentProps,
    IEcogesteListPageProps,
} from 'src/modules/Ecogestes/components/ecogeste'
import useEcogestePoles from '../../hooks/polesHooks'
import { IEcogesteCategoryTypes } from '../../EcogestesConfig'
import CircularProgress from '@mui/material/CircularProgress'

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

    return (
        <ThemeProvider theme={theme}>
            <div
                className="w-full h-full p-10 flex flex-nowrap flex-col gap-1 justify-around"
                style={{ backgroundColor: theme.palette.primary.dark }}
            >
                {!isLoading && currentCategory && currentCategory.name && currentCategory.icon ? (
                    <>
                        <Icon
                            sx={{ color: 'primary.contrastText' }}
                            aria-hidden="true"
                            color="inherit"
                            style={{ height: '75%', alignSelf: 'center', width: '100%', margin: 'auto' }}
                        >
                            <img
                                style={{
                                    filter: `opacity(0.1) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText}) drop-shadow(0 0 0 ${theme.palette.primary.contrastText})`,
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
        </ThemeProvider>
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
        <div className="m-10 p-10 flex flex-1 gap-9">Aucun écogeste n'est disponible pour le moment.</div>
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
