import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule, ThemeProps } from "styled-components";

export interface ITheme {
    colorBackground000: string;
    colorBackground100: string;

    colorBorder200: string;
}

const defaultTheme: ITheme = {
    colorBackground000: "#fff",
    colorBackground100: "#faf9f8",
    
    colorBorder200: "#afafaf",
};

const {
    default: styled,
    css,
    createGlobalStyle,
    keyframes,
    withTheme,
    ThemeProvider,
} = styledComponents as ThemedStyledComponentsModule<ITheme>;

export interface IWithTheme extends ThemeProps<ITheme> { }

const GlobalStyle = createGlobalStyle`
    html {
        background-color: ${s => s.theme.colorBackground100};
    }
`;

export {
    css,
    keyframes,
    ThemeProvider,
    defaultTheme,
    withTheme,
    createGlobalStyle,
    GlobalStyle,
};
export default styled;
