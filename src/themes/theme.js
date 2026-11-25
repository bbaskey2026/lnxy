import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b5cff', dark: '#0847c6', light: '#edf4ff' },
    secondary: { main: '#232323', dark: '#111111', light: '#f3f3f3' },
    success: { main: '#16a34a' },
    warning: { main: '#f59e0b' },
    error: { main: '#dc2626' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
    text: { primary: '#232323', secondary: '#686868' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontSize: 13,
    fontFamily: "'Switzer', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 900 },
    h4: { fontWeight: 900 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 800 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 16, fontWeight: 700, textTransform: 'none' },
        containedPrimary: {
          backgroundColor: '#0b5cff',
          '&:hover': { backgroundColor: '#0847c6' },
        },
        containedSecondary: {
          backgroundColor: '#232323',
          '&:hover': { backgroundColor: '#111111' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #e3e7ef', borderRadius: 12, boxShadow: '0 1px 3px rgba(23,32,51,.05)' },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 12, fontWeight: 700 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#fff',
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#98a2b3' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0b5cff' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { '&.Mui-focused': { color: '#c2410c' } },
      },
    },
    MuiCheckbox: {
      styleOverrides: { root: { '&.Mui-checked': { color: '#0b5cff' } } },
    },
    MuiRadio: {
      styleOverrides: { root: { '&.Mui-checked': { color: '#0b5cff' } } },
    },
    MuiTabs: {
      styleOverrides: { indicator: { height: 2, backgroundColor: '#0b5cff' } },
    },
    MuiTab: {
      styleOverrides: { root: { minHeight: 44, textTransform: 'none', fontWeight: 700 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 12 },
        bar: { backgroundColor: '#0b5cff', borderRadius: 12 },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 12 } },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          '&:before': { display: 'none' },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: 12, border: '1px solid #e3e7ef' } },
    },
    MuiPaginationItem: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { borderRadius: 12 } },
    },
  },
})
