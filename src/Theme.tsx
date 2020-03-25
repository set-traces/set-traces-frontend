import React, { ReactElement, ReactNode } from "react"
import { ThemeProvider } from "styled-components"

const colors = {
  negative: "#ed5e75",
  positive: "#689377",
  negativeIsh: "#ee7e5a",
  highlight: "#e8e678",
  undertone: "#6c9ca8",
  dull: "#ffe3be",
  dark: "#363140",
  darker: "#282430",
  darkest: "#16141a",
}

export const theme = {
  colors,

  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em",
  },

  scrollbarStyling: `
    &::-webkit-scrollbar-track {
    //-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f500;
  }

  &::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f500;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    //-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: ${colors.undertone}55;
  `,
}

type Props = {}

const Theme: React.FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme
