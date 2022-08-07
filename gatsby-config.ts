import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    graphqlTypegen: true,
    plugins: [
        {
            resolve: "gatsby-plugin-root-import",
        },
        {
            resolve: "gatsby-plugin-sass",
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "static",
                path: `${__dirname}/static`,
            }
        },
    ],
};

export default config;
