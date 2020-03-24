import React, {ReactElement, ReactNode} from "react";
import { ThemeProvider } from "styled-components";


export const theme = {
  colors: {
    negative: "#de4c60",
    highlight: "#2d7dd2",
    dark: "#393d3f",
    positive: "#0dab76"
  },

  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em"
  }
}

type Props = {
}

const Theme: React.FC<Props> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme