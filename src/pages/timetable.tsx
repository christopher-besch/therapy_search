import { PageProps } from "gatsby";
import * as React from "react";
import Layout from "src/components/layout";
import { get_data } from "./crawler/crawler";

const TimetablePage = (props: PageProps) => {
    const params = new URLSearchParams(props.location.search);
    const url = params.get("url")!;
    get_data(url);

    return (
        <Layout>
            <h1>{url}</h1>
        </Layout>
    );
};

export default TimetablePage;

