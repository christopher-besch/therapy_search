import { PageProps } from "gatsby";
import * as React from "react";
import Layout from "src/components/layout";
import { get_data } from "src/crawler/arztsuche_bw_de";

const TimetablePage = (props: PageProps) => {
    const params = new URLSearchParams(props.location.search);
    const url = params.get("url")!;
    // get_data(url, (therapists) => {
    //     console.log(therapists);
    // });


    return (
        <Layout>
            <h1>{url}</h1>
        </Layout>
    );
};

export default TimetablePage;

