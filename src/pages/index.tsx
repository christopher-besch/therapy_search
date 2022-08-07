import * as React from "react";
import { HeadFC, navigate } from "gatsby";
import Layout from "src/components/layout";

const IndexPage = () => {
    let url_input_ref = React.createRef<HTMLInputElement>();

    // type Event doesn't work because of react weirdness
    function start_search(e: any) {
        let url = url_input_ref.current?.value!;
        let params = new URLSearchParams();
        params.set("url", url);
        navigate(`/timetable?${params.toString}`);

        e.preventDefault();
    }

    return (
        <Layout>
            <h1>Therapy Search</h1>
            <form onSubmit={start_search}>
                <input ref={url_input_ref} type="url" placeholder="https://example.com/..."></input>
                <button type="submit">Compile</button>
            </form>
        </Layout>
    );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Therapy Search</title>

