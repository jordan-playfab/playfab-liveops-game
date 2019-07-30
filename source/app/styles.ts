import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule, ThemeProps } from "styled-components";
import { FontSizes } from "@uifabric/styling";
import { Spinner } from "office-ui-fabric-react";

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
    text700: string;
    text900: string;

    link500: string;
    linkVisited500: string;
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
    blue500: "rgb(0, 120, 212)",
    blue600: "#2578d9",
    blue700: "#1a5498",
    blue900: "#323a44",

    purple500: "#7a3a88",

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

const spacer = 1;
const unit = "rem";

const defaultTheme: ITheme = {
    color: {
        background000: colors.white,
        background100: colors.grey100,
        
        border200: colors.grey200,

        text000: colors.white,
        text700: "rgb(96, 94, 92)",
        text900: colors.grey900,

        link500: colors.blue500,
        linkVisited500: colors.purple500,
    },
    font: {
        normal: `"Segoe UI Web (West European)", Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif;`
    },
    fontSize: {
        h1: "48px", // FontSizes.mega was too big
        h2: FontSizes.xxLargePlus,
        h3: FontSizes.xLarge
    },
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
        background: ${s => s.theme.color.background100};
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;
        font-weight: normal;
        color: ${s => s.theme.color.text700};
    }

    p {
        margin: ${s => s.theme.size.spacerP75} 0 0 0;
    }

    h1 {
        font-size: ${s => s.theme.fontSize.h1};
        margin: 0;
    }

    h2 {
        font-size: ${s => s.theme.fontSize.h2};
    }

    h3 {
        font-size: ${s => s.theme.fontSize.h3};
    }

    form {
        margin: 0;
        padding: 0;
    }

    img {
        max-width: 100%;
    }

    a, a:visited {
        color: ${s => s.theme.color.link500};
        text-decoration: none;
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

const SpinnerLeft = styled(Spinner)`
    justify-content: flex-start;
    margin-top: ${s => s.theme.size.spacer2};
`;

const DivField = styled.div`
    margin-top: ${s => s.theme.size.spacer};
    max-width: ${s => s.theme.breakpointUnits.small};
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
    DivField,
    SpinnerLeft
};
export default styled;
