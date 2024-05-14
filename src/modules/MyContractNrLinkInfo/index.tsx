import { isEmpty } from 'lodash'
import { motion } from 'framer-motion'
import Button from '@mui/material/Button'

import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Icon } from 'src/common/ui-kit'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/MyHouseConfig'
import { useCurrentHousing, useCurrentHousingScopes } from 'src/hooks/CurrentHousing'
import { HousingDetailsCard } from 'src/modules/MyHouse/components/HousingDetails/HousingDetailsCard'
import { HousingCardTypeOfDetailsEnum } from 'src/modules/MyHouse/components/HousingDetails/housingDetails.d'
import { useConnectedPlugInfo } from 'src/hooks/useConnectedPlugInfo'

/**
 * Renders a page displaying contract, nrLINK, and PDL settings along with connected plugs information.
 *
 * @returns  The JSX element representing the MyContractNrLinkInfo component.
 */
export const MyContractNrLinkInfo = () => {
    const currentHousingScopes = useCurrentHousingScopes()
    const currentHousing = useCurrentHousing()

    const { history, theme, connectedPlugsElements, isConnectedPlugListLoading, connectedPlugList } =
        useConnectedPlugInfo(currentHousing?.id)

    return (
        <PageSimple
            header={
                <div className="w-full h-full px-10" style={{ backgroundColor: theme.palette.primary.dark }}>
                    <Button
                        sx={{ color: 'primary.contrastText' }}
                        onClick={history.goBack}
                        className="text-12 md:text-16 mt-10"
                        color="inherit"
                    >
                        <Icon
                            component={motion.span}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 mr-2"
                        >
                            arrow_back
                        </Icon>

                        <TypographyFormatMessage className="text-12 md:text-16">retour</TypographyFormatMessage>
                    </Button>
                    <div className="flex pl-16 mt-6 md:mt-0 justify-between w-full">
                        <div className="flex">
                            <Icon
                                component={motion.span}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { delay: 0.2 } }}
                                className="text-24 md:text-32"
                            >
                                assignment
                            </Icon>
                            <TypographyFormatMessage className="sm:flex text-18 sm:text-20 md:text-24 mx-12 font-semibold">
                                Mes paramètres (Contrat, nrLINK, PDL)
                            </TypographyFormatMessage>
                        </div>
                    </div>
                </div>
            }
            content={
                <>
                    <MeterStatus />
                    <div className="flex flex-col md:flex-row px-16 max-w-512 mx-auto md:mx-0">
                        {arePlugsUsedBasedOnProductionStatus(currentHousingScopes) && (
                            <HousingDetailsCard
                                title="Mes prises connectées"
                                elements={connectedPlugsElements}
                                typeOfDetails={HousingCardTypeOfDetailsEnum.CONNECTED_PLUGS}
                                isConfigured={!isEmpty(connectedPlugList)}
                                loadingInProgress={isConnectedPlugListLoading}
                            />
                        )}
                    </div>
                </>
            }
        />
    )
}
