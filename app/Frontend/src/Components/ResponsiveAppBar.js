import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import avatarImage from '../assets/images/avatar.png';


const pages = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Admins', path: '/admin' },
    { label: 'Trainer', path: '/trainer' },
    { label: 'Trainee', path: '/trainee' },
    { label: 'Payments', path: '/payments' },
    { label: 'Packages', path: '/packages' }
];

const settings = ['Account', 'Logout'];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="sticky" sx={{ bgcolor: 'rgba(0, 0, 0, 0.8)', height: '75px', backdropFilter: 'blur(10px)' }}>
            <Container maxWidth="xl"> 
                <Toolbar disableGutters>
                    <FitnessCenterIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/dashboard"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Gym MS
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.label}
                                    component={RouterLink}
                                    to={page.path}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        backgroundColor: location.pathname === page.path ? 'rgba(240, 240, 240, 0.9)' : 'inherit',
                                    }}
                                >
                                    <Typography textAlign="center" sx={{ color: location.pathname === page.path ? 'black' : 'white' }}>{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <FitnessCenterIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                component={RouterLink}
                                to={page.path}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: location.pathname === page.path ? 'black' : 'white',
                                    display: 'block',
                                    backgroundColor: location.pathname === page.path ? 'rgba(240, 240, 240, 0.9)' : 'inherit',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(224, 224, 224, 0.9)',
                                    },
                                }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={avatarImage} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ 
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    component={RouterLink}
                                    to={setting === 'Account' ? '/account' : '#'}
                                    onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}
                                >
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;