import { FC, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { IEcogestCategory, IEcogesteListPageProps } from 'src/modules/Ecogestes/components/ecogeste'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'
import { useTheme, ThemeProvider, useMediaQuery, Button, Icon } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import MultiTab from 'src/common/ui-kit/components/MultiTab/MultiTab'
import { ReactComponent as AdvicesIcon } from 'src/assets/images/navbarItems/advice.svg'
import { ReactComponent as CircleCheckIcon } from 'src/assets/images/circleCheck.svg'
import { Ecogestes } from 'src/modules/Ecogestes'

/**
 * EcogestListPage.
 *
 * @param root0 N/A.
 * @param root0.categoryType The type of the Category of Ecogestes that we want to load.
 * @returns EcogestPage.
 */
const EcogestesPage: FC<IEcogesteListPageProps> = ({
    categoryType = IEcogesteCategoryTypes.CONSUMPTION,
}): JSX.Element => {
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('md'))
    const history = useHistory()
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

    const [currentCategory, setCurrentCategory] = useState<IEcogestCategory | undefined | null>()
    const { elementList } = useEcogestesCategories(categoryType)

    useEffect(() => {
        let _category = elementList?.find((element) => element.id === categoryIdInt)
        setCurrentCategory(_category ? _category : null)
    }, [elementList, categoryIdInt])

    const tabsContent = [
        {
            tabTitle: 'Nos conseils',
            tabSlug: 'nos-conseils',
            tabContent: <Ecogestes />,
            icon: <AdvicesIcon height={26} width={26} />,
        },
        {
            tabTitle: 'Réalisés',
            tabSlug: 'realises',
            tabContent: <Ecogestes isEcogestsViewed />,
            icon: <CircleCheckIcon height={26} width={26} />,
        },
    ]

    return (
        <MultiTab
            header={
                <ThemeProvider theme={theme}>
                    <div className="relative w-full flex justify-center">
                        <div className="absolute left-0 top-0 bottom-0 flex items-center">
                            <Button
                                className="flex justify-center items-center m-0 p-0"
                                variant="text"
                                onClick={() => history.goBack()}
                            >
                                <Icon sx={{ color: theme.palette.primary.contrastText }}>arrow_back</Icon>
                                <TypographyFormatMessage
                                    sx={{ color: theme.palette.primary.contrastText }}
                                    className="text-16 font-medium hidden sm:block"
                                >
                                    Retour
                                </TypographyFormatMessage>
                            </Button>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full flex gap-10 justify-center items-center text-18 md:text-24 flex-wrap text-center mx-52"
                        >
                            <TypographyFormatMessage
                                className="text-18 md:text-24"
                                style={{ color: theme.palette.primary.contrastText }}
                            >
                                Ecogestes
                            </TypographyFormatMessage>
                            &gt;
                            <TypographyFormatMessage
                                className="text-18 md:text-24"
                                style={{ color: theme.palette.primary.contrastText }}
                            >
                                {currentCategory?.name ?? '...'}
                            </TypographyFormatMessage>
                        </motion.div>
                    </div>
                </ThemeProvider>
            }
            content={tabsContent}
            innerScroll
            TabsProps={{ variant: 'fullWidth' }}
            TabProps={{ iconPosition: 'start', sx: { fontSize: 15 } }}
            rootCss={{
                height: 'auto',
                minHeight: 'auto',
                margin: `${!mdDown ? '0' : '0.5rem'}`,
            }}
            isUseRouting={false}
        />
    )
}

export default EcogestesPage
