import * as React from "react"
import { Link, HeadFC } from "gatsby"

const NotFoundPage = () => {
    return (
        <Link to="/">Go home</Link>
    );
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>

