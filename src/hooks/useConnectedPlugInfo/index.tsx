import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import { useConnectedPlugList } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { HouseDetailsElementType } from 'src/modules/MyHouse/components/HousingDetails/housingDetails.d'

const defaultConnectedPlugsDisplay = [
    {
        icon: <MoreHorizIcon color="primary" fontSize="large" />,
        label: 'Prise 1',
    },
    {
        icon: <MoreHorizIcon color="primary" fontSize="large" />,
        label: 'Prise 2',
    },
    {
        icon: <MoreHorizIcon color="primary" fontSize="large" />,
        label: 'Prise 3',
    },
]

/**
 * Custom hook to fetch and manage connected plug data for display.
 * Provides connected plug elements, loading status, and utility functions.
 *
 * @param {number} housingId - The ID of the housing to retrieve connected plug information for.
 * @returns An object containing connected plug information and utility functions.
 */
export const useConnectedPlugInfo = (housingId?: number) => {
    const history = useHistory()
    const theme = useTheme()

    const {
        connectedPlugList,
        loadingInProgress: isConnectedPlugListLoading,
        loadConnectedPlugList,
    } = useConnectedPlugList(housingId)

    const [connectedPlugsElements, setConnectedPlugsElements] =
        useState<HouseDetailsElementType[]>(defaultConnectedPlugsDisplay)

    useEffect(() => {
        setConnectedPlugsElements((prevConnectedPlugsElements) => {
            const copyPrevConnectedPlugsElements = cloneDeep(prevConnectedPlugsElements)

            copyPrevConnectedPlugsElements.forEach((connectedPlugElement, index) => {
                connectedPlugElement.label = `Prise ${index + 1}`
                connectedPlugElement.icon = <MoreHorizIcon color="primary" fontSize="large" />
            })

            connectedPlugList.slice(0, 3).forEach((connectedPlug, index) => {
                copyPrevConnectedPlugsElements[index].label = connectedPlug.deviceName
                copyPrevConnectedPlugsElements[index].icon = <ElectricalServicesIcon color="primary" fontSize="large" />
            })

            return copyPrevConnectedPlugsElements
        })
    }, [connectedPlugList])

    useEffect(() => {
        loadConnectedPlugList()
    }, [loadConnectedPlugList])

    return {
        history,
        theme,
        connectedPlugsElements,
        isConnectedPlugListLoading,
        connectedPlugList,
    }
}
