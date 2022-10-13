import NavLinkAdapter from 'src/common/ui-kit/fuse/utils/NavLinkAdapter'
import { styled, alpha } from '@mui/material/styles'
import { Tooltip } from '@mui/material'
import Icon from '@mui/material/Icon'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import clsx from 'clsx'
import { IFuseNavigationComponentProps } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { useIntl } from 'src/common/react-platform-translation'

const Root = styled('div')(({ theme }) => ({
    '& > .fuse-list-item': {
        minHeight: 100,
        height: 100,
        width: 100,
        borderRadius: 12,
        margin: '0 0 4px 0',
        color: alpha(theme.palette.text.primary, 0.7),
        cursor: 'pointer',
        textDecoration: 'none!important',
        padding: 0,
        '&.dense': {
            minHeight: 52,
            height: 52,
            width: 52,
        },
        '&.type-divider': {
            padding: 0,
            height: 2,
            minHeight: 2,
            margin: '12px 0',
            backgroundColor:
                theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
            pointerEvents: 'none',
        },
        '&:hover': {
            color: theme.palette.text.primary,
        },
        '&.active': {
            color: theme.palette.text.primary,
            backgroundColor:
                theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
            // pointerEvents: 'none',
            transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
            '& .fuse-list-item-text-primary': {
                color: 'inherit',
            },
            '& .fuse-list-item-icon': {
                color: 'inherit',
            },
        },
        '& .fuse-list-item-icon': {
            color: 'inherit',
        },
        '& .fuse-list-item-text': {},
    },
}))

/**
 * Component Render Navigation Items grouped vertically.
 *
 * @param props Props (mostly consist of the item and its children if there are, besides the curret ,estLevel).
 * @returns UI Component Vertical Nav Items Collapsed.
 */
function FuseNavVerticalTab(props: IFuseNavigationComponentProps) {
    const { item, onItemClick, dense, selectedId } = props
    const { formatMessage } = useIntl()

    return (
        <Root>
            <ListItemButton
                component={item!.url ? NavLinkAdapter : 'button'}
                to={item!.url}
                className={clsx(
                    `type-${item!.type}`,
                    dense && 'dense',
                    selectedId === item!.id && 'active',
                    'fuse-list-item flex flex-col items-center justify-center p-12',
                )}
                onClick={() => onItemClick && onItemClick(item)}
                exact={item!.exact!}
                role="button"
            >
                {dense ? (
                    <Tooltip
                        title={
                            formatMessage({
                                id: item!.label,
                                defaultMessage: item!.label,
                            }) || ''
                        }
                        placement="right"
                    >
                        <div className="w-32 h-32 min-h-32 flex items-center justify-center relative">
                            {item!.icon ? (
                                <Icon
                                    className={clsx('fuse-list-item-icon text-24', item!.iconClassName)}
                                    color="action"
                                >
                                    {item!.icon}
                                </Icon>
                            ) : (
                                formatMessage({
                                    id: item!.label,
                                    defaultMessage: item!.label,
                                }) && <div className="font-bold text-16">{item!.label![0]}</div>
                            )}
                        </div>
                    </Tooltip>
                ) : (
                    <>
                        <div className="w-32 h-32 min-h-32 flex items-center justify-center relative mb-8">
                            {item!.icon ? (
                                <Icon
                                    className={clsx('fuse-list-item-icon text-32', item!.iconClassName)}
                                    color="action"
                                >
                                    {item!.icon}
                                </Icon>
                            ) : (
                                formatMessage({
                                    id: item!.label,
                                    defaultMessage: item!.label,
                                }) && <div className="font-bold text-20">{item!.label![0]}</div>
                            )}
                        </div>

                        <ListItemText
                            className="fuse-list-item-text flex-grow-0 w-full m-0"
                            primary={formatMessage({
                                id: item!.label,
                                defaultMessage: item!.label,
                            })}
                            classes={{
                                primary:
                                    'text-12 font-medium whitespace-pre-wrap fuse-list-item-text-primary truncate text-center',
                            }}
                        />
                    </>
                )}
            </ListItemButton>
        </Root>
    )
}

FuseNavVerticalTab.defaultProps = {}

const NavVerticalTab = FuseNavVerticalTab

export default NavVerticalTab
