import * as React from "react"
import type { HeadFC } from "gatsby"

const IndexPage = () => {
    return (
        <h1>Hello World!</h1>
    );
}

export default IndexPage

export const Head: HeadFC = () => <title>Therapy Search</title>

