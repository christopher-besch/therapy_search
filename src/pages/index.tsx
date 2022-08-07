import * as React from "react";
import type { HeadFC } from "gatsby";
import Layout from "src/components/layout";

const IndexPage = () => {
    return (
        <Layout>
            <h1>Hello World!</h1>
        </Layout>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Therapy Search</title>

