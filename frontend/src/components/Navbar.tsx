import { Link, useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/utenti/utentiSlice';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.utenti.isLoggedIn);
  const user = useAppSelector((state) => state.utenti.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 2000 }}>
      <Toolbar className="container mx-auto flex justify-between">
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className="text-white no-underline hover:opacity-80 transition"
        >
          La Tua Libreria
        </Typography>

        {isLoggedIn ? (
          <div>
            <Tooltip title="Impostazioni utente">
              <IconButton onClick={handleMenuClick} color="inherit">
                <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                  {user?.nome?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>
                <Typography variant="body1">
                  {user?.nome} {user?.cognome}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/profilo">
                <AccountCircleIcon sx={{ mr: 1 }} />
                Profilo (in arrivo)
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Typography
            component={Link}
            to="/"
            className="text-white no-underline hover:opacity-80 transition"
          >
            Login / Registrazione
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
