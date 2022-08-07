import * as React from "react";
// import type { PageProps } from "gatsby"
import "src/styles/global.scss";
import * as styles from "src/styles/layout.module.scss";

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    );
};

export default Layout;

