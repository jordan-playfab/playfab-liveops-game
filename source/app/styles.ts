import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule, ThemeProps } from "styled-components";

export interface ITheme {
    color: IThemeColor;
    font: IThemeFont;
    fontSize: IThemeFontSize;
    size: IThemeSize;
    breakpoint: IThemeBreakpoint;
    breakpointUnits: IThemeBreakpoint;
}

interface IThemeColor {
    background000: string;
    background100: string;

    border200: string;

    text000: string;
    text900: string;
}

interface IThemeFont {
    normal: string;
}

interface IThemeFontSize {
    h1: string;
    h2: string;
    h3: string;
}

interface IThemeSize {
    spacerD6: string;
    spacerD4: string;
    spacerD3: string;
    spacerD2: string;
    spacerD1p5: string;
    spacerD1p2: string;
    spacerP75: string;
    spacer: string;
    spacer1p5: string;
    spacer2: string;
    spacer3: string;
    spacer4: string;
    spacer5: string;
    spacer6: string;
    spacer7: string;
    spacer8: string;
    spacer9: string;
    unit: string;
}

interface IThemeBreakpoint {
    tiny: string;
    small: string;
    medium: string;
    large: string;
    huge: string;
}

const breakpoints: IThemeBreakpoint = {
    tiny: "320px",
    small: "480px",
    medium: "768px",
    large: "1024px",
    huge: "1280px",
};

const colors = {
    white: "#fff",

    grey050: "#f5f5f5",
    grey100: "#f5f5f5",
    grey150: "#eaeaea",
    grey200: "#d9d9d9",
    grey300: "#afafaf",
    grey600: "#5c5c5c",
    grey650: "#747b8e",
    grey700: "#5d6372",
    grey800: "#464a56",
    grey900: "#2f323a",

    transparent: "rgba(0,0,0,0)",
    shadow100: "rgba(0,0,0,0.18)",

    blue400: "#7caee8",
    blue500: "#5093e1",
    blue600: "#2578d9",
    blue700: "#1a5498",
    blue900: "#323a44",

    orange500: "#ff6d21",
    orange600: "#cd602a",

    red150: "#fdeded",
    red200: "#fdf5f5",
    red300: "#eccfcf",
    yellow150: "#FFE6C2",
    yellow600: "#FA9D2D",
    red500: "#f65177",
    red550: "#FA2D2D",
    red600: "#997574",

    redPink500: "#f65177",

    green100: "#DFF9D8",
    green050: "#E9F9EF",
    green150: "#d8f5e8",
    green200: "#8ECC97",
    green300: "#d1ecdd",
    green500: "#53bd49",
    green600: "#678b7c",

    yellow100: "#fff4ce",
    yellow300: "#f3e5b3",
    yellow500: "#fba841",

    translucent100: "rgba(217, 217, 217, 0.75)",
};

const fontSize: IThemeFontSize = {
    h1: "2.441em",
    h2: "1.935em",
    h3: "1.536em",
};

const spacer = 1;
const unit = "em";

const defaultTheme: ITheme = {
    color: {
        background000: colors.white,
        background100: colors.grey100,
        
        border200: colors.grey200,

        text000: colors.white,
        text900: colors.grey900,
    },
    font: {
        normal: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;`
    },
    fontSize,
    size: {
        spacerD6: `${spacer / 6 + unit}`,
        spacerD4: `${spacer / 4 + unit}`,
        spacerD3: `${spacer / 3 + unit}`,
        spacerD2: `${spacer / 2 + unit}`,
        spacerD1p2: `${spacer / 1.2 + unit}`,
        spacerD1p5: `${spacer / 1.5 + unit}`,
        spacerP75: `${spacer * 0.75 + unit}`,
        spacer: `${spacer + unit}`,
        spacer1p5: `${spacer * 1.5 + unit}`,
        spacer2: `${spacer * 2 + unit}`,
        spacer3: `${spacer * 3 + unit}`,
        spacer4: `${spacer * 4 + unit}`,
        spacer5: `${spacer * 5 + unit}`,
        spacer6: `${spacer * 6 + unit}`,
        spacer7: `${spacer * 7 + unit}`,
        spacer8: `${spacer * 8 + unit}`,
        spacer9: `${spacer * 9 + unit}`,
        unit,
    },
    breakpoint: {
        tiny: `(min-width: ${breakpoints.tiny})`,
        small: `(min-width: ${breakpoints.small})`,
        medium: `(min-width: ${breakpoints.medium})`,
        large: `(min-width: ${breakpoints.large})`,
        huge: `(min-width: ${breakpoints.huge})`,
    },
    breakpointUnits: breakpoints,
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
        font-family: ${s => s.theme.font.normal};
        margin: 0;
        padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
        font-weight: normal;
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
