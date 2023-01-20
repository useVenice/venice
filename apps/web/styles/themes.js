/* Venice's Core Theme */

const VeniceTheme = {
  background: 'rgba(30, 30, 30, 1)',
  black: 'rgba(30, 30, 30, 1)',
  dropShadow: 'rgba(0,0,0,0.15)',
  footerBlack: 'rgba(25, 25, 25, 1)',
  githubGray: 'rgba(238, 241, 245, 1)',
  gray: 'rgba(125, 125, 125, 1)',
  green: 'rgba(18, 184, 134, 1)',
  greenGlow: 'rgba(18,184,134,0.15)',
  innerBevel: 'rgba(0, 0, 0, 0.102)',
  inputBackground: 'rgba(41, 41, 41, 1)',
  inputBorder: 'rgba(0, 0, 0, 0.5)',
  offwhite: 'rgba(233, 233, 233, 1)',
  primary: 'rgba(233, 233, 233, 1)',
  red: '#DB3E5A',
  secondary: 'rgba(18, 184, 134, 1)',
  primaryUIControl: 'rgba(255, 255, 255, 0.08)',
  white: 'rgba(255, 255, 255, 1)',
}

/* Data Grid Theme */

/* *** IMPORTANT *** */
/* Glide's data grid DOES NOT SUPPORT RGBA VALUES */
/* You must use HEX values for the data grid theme */
/* See https://github.com/glideapps/glide-data-grid/discussions/612 */
const dataGridThemeColors = {
  cellBackground: '#1E1E1E',
  accent: '#12B886',
  accentLight: '#031C14',

  cellText: '#ffffff99',
  textMedium: '#ffffff99',
  textLight: '#ffffff99',

  groupHeader: '#ffffff14',

  bgCellMedium: '#191919',
  bgHeader: '#262626',
  bgHeaderHovered: '#3D3D3D',
  bgHeaderHasFocus: '#4E4E4E',

  bgBubble: '#ffffff14',
  bgSearchResult: '#031C14',

  borderColor: '#ffffff14',
  drillDownBorder: '#00000000',
}

const VeniceDataGridTheme = {
  accentColor: dataGridThemeColors.accent,
  accentFg: dataGridThemeColors.cellBackground,
  accentLight: dataGridThemeColors.accentLight,

  textDark: dataGridThemeColors.cellText,
  textMedium: dataGridThemeColors.textMedium,
  textLight: dataGridThemeColors.textLight,
  textBubble: dataGridThemeColors.cellText,

  bgIconHeader: dataGridThemeColors.textMedium,
  fgIconHeader: dataGridThemeColors.cellBackground,

  textHeader: dataGridThemeColors.cellText,
  textGroupHeader: dataGridThemeColors.groupHeader,
  textHeaderSelected: dataGridThemeColors.cellBackground,

  bgCell: dataGridThemeColors.cellBackground,
  bgCellMedium: dataGridThemeColors.bgCellMedium,
  bgHeader: dataGridThemeColors.bgHeader,
  bgHeaderHasFocus: dataGridThemeColors.bgHeaderHasFocus,
  bgHeaderHovered: dataGridThemeColors.bgHeaderHovered,

  bgBubble: dataGridThemeColors.bgBubble,
  bgBubbleSelected: dataGridThemeColors.cellBackground,

  bgSearchResult: dataGridThemeColors.bgSearchResult,

  borderColor: dataGridThemeColors.borderColor,
  drilldownBorder: dataGridThemeColors.drillDownBorder,

  linkColor: dataGridThemeColors.accent,

  cellHorizontalPadding: 8,
  cellVerticalPadding: 3,

  headerIconSize: 18,

  headerFontStyle: '500 13px',
  baseFontStyle: '13px',
  fontFamily:
    'Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif',
  editorFontSize: '13px',
  lineHeight: 1.4, // unitless scaler, depends on your font
}

module.exports = {
  VeniceTheme,
  VeniceDataGridTheme,
}
