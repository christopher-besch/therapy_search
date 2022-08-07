interface CSSModule {
    [className: string]: string;
}

declare module '*.module.scss' {
    const styles: CSSModule;
    export = styles;
};

