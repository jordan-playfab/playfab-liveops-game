import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule, ThemeProps } from "styled-components";

export interface ITheme {
    color: IThemeColor;
    font: IThemeFont;
}

interface IThemeColor {
    background000: string;
    background100: string;

    border200: string;
}

interface IThemeFont {
    normal: string;
}

const defaultTheme: ITheme = {
    color: {
        background000: "#fff",
        background100: "#faf9f8",
        
        border200: "#afafaf",
    },
    font: {
        normal: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;`
    },
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
        background-color: ${s => s.theme.color.background100};
        font-family: ${s => s.theme.font.normal};
        margin: 0;
        padding: 0;
    }

    h1, h2, h3 {
        margin: 0;
    }

    p {
        margin: 0.5em 0 0 0;
    }

    h1 {
        font-size: 2.441em;
        margin: 0;
    }

    h2 {
        font-size: 1.935em;
    }

    h3 {
        font-size: 1.536em;
    }

    form {
        margin: 1em 0 0 0;
    }

    fieldset {
        margin: 1em 0 0 0;
        padding: 0;
        max-width: 20em;
        border: 0;
    }

    legend {
        text-transform: uppercase;
        font-weight: bold;
    }
`;

const DivConfirm = styled.div`
    margin-top: 1em;
`;

const UlNull = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
`;

const UlInline = styled(UlNull)`
    margin-top: 1em;

    > li {
        margin-left: 1em;
        display: inline-block;

        &:first-child {
            margin-left: 0;
        }
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
    DivConfirm,
    UlNull,
    UlInline,
};
export default styled;
