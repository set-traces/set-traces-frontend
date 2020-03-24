import React, { ReactElement, ReactNode } from "react"
import { ThemeProvider } from "styled-components"

export const theme = {
  colors: {
    negative: "#ed5e75",
    positive: "#689377",
    negativeIsh: "#ee7e5a",
    highlight: "#e8e678",
    undertone: "#6c9ca8",
    dull: "#ffe3be",
    dark: "#363140",
    darker: "#282430",
    darkest: "#16141a",
  },

  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em",
  },
}

type Props = {}

const Theme: React.FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme
