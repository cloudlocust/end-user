import React, { SyntheticEvent } from 'react'
import { PostPlaceholder } from 'src/common/ui-kit/components/MapElementList/components/ContentLoader/ContentLoader'
// import MapElementList from 'src/common/ui-kit/components/MapElementList'
import { useHousingList } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import HousingCard from 'src/modules/MyHouse/components/HousingList/components/HousingCard'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { useTheme } from '@mui/material/styles'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { styled } from '@mui/material/styles'
import { isEmpty } from 'lodash'
import EmptyTableMessage from 'src/common/ui-kit/components/Table/EmptyTableMessage'
import { useIntl } from 'src/common/react-platform-translation'
import ElementListGrid from 'src/common/ui-kit/components/MapElementList/components/ElementListGrid/ElementListGrid'
import { ButtonLoader } from 'src/common/ui-kit'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

const Root = styled(PageSimple)(({ theme }) => ({
    '& .PageSimple-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .PageSimple-content': {
        display: 'flex',
        position: 'relative',
    },
    '& .PageSimple-contentCard': {
        overflow: 'hidden',
    },
    [theme.breakpoints.down('md')]: {
        '& .PageSimple-toolbar': {
            height: 'auto',
        },
    },
}))

/**
 * HousingList view component containing Map & Housing Items.
 *
 * @returns HousingList page component.
 */
const HousingList = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    const {
        elementList: housingList,
        loadingInProgress: isHousingInProgress,
        loadMoreElements: loadMoreHousings,
        noMoreElementToLoad: noMoreHousingToLoad,
    } = useHousingList(10)

    // TODO - Refacto this component.
    return (
        <Root
            header={
                <div className="w-full relative flex flex-col justify-center items-center p-16">
                    <TypographyFormatMessage
                        className="text-18 md:text-24"
                        style={{ color: theme.palette.primary.contrastText }}
                    >
                        Logement
                    </TypographyFormatMessage>
                </div>
            }
            content={
                <div className="w-full mt-10">
                    {isEmpty(housingList) && !isHousingInProgress ? (
                        <EmptyTableMessage
                            message={formatMessage({
                                id: 'La liste est vide',
                                defaultMessage: 'La liste est vide',
                            })}
                        />
                    ) : (
                        <div className="w-full">
                            <ElementListGrid<IHousing>
                                data={housingList}
                                shrink={false}
                                loadingData={isHousingInProgress}
                                ElementCard={HousingCard}
                                placeholder={<PostPlaceholder />}
                            />
                            {!noMoreHousingToLoad && (
                                <div className="flex justify-center m-12">
                                    <ButtonLoader
                                        inProgress={isHousingInProgress}
                                        type="button"
                                        onClick={(e: SyntheticEvent) => loadMoreHousings()}
                                    >
                                        {formatMessage({ id: 'Afficher plus', defaultMessage: 'Afficher plus' })}
                                    </ButtonLoader>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            }
        />
    )
}

export default HousingList
