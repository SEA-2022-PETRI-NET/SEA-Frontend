import { styled, Theme, CSSObject } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import { Transition } from '../../models/PetrinetModels'
import { Button } from '@mui/material'

const drawerWidth = 180

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        position: 'absolute',
        zIndex: 1,
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
)

interface SidebarProps {
    openDrawer: boolean
    setOpenDrawer: (value: boolean) => void
    enabledTransitions: Transition[]
    fireTransition: (transitionId: number) => Promise<void>
}

export default function SidebarEnabledTransitions({
    openDrawer,
    setOpenDrawer,
    enabledTransitions,
    fireTransition,
}: SidebarProps) {
    return (
        <>
            <Drawer variant="permanent" open={openDrawer} style={{ zIndex: 5 }}>
                <div style={{ height: '60px' }}> </div>
                <div style={{ height: '60px' }}>
                    {openDrawer ? (
                        <IconButton
                            onClick={() => setOpenDrawer(false)}
                            style={{ marginTop: 10, marginLeft: drawerWidth - 50 }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={() => setOpenDrawer(true)}
                            style={{ marginTop: 10, marginLeft: 10 }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    )}
                </div>
                <Divider />
                <List>
                    {enabledTransitions.map((transition) => (
                        <ListItem
                            key={transition.transitionId}
                            disablePadding
                            sx={{ display: 'block', marginTop: '10px' }}
                        >
                            <Button
                                style={{ textTransform: 'none' }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    fireTransition(transition.transitionId)
                                }}
                            >
                                Id: {transition.transitionId}{' '}
                                {openDrawer && 'name: ' + transition.name}{' '}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    )
}
