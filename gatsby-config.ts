import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `Therapy Search`,
        siteUrl: `https://therapy_search.chris-besch.com`
    },
    graphqlTypegen: true,
    plugins: ["gatsby-plugin-sass"]
};

export default config;
