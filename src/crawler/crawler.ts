// TODO: don't hardcode
const cors_anywhere = "http://localhost:8080";

// create hidden iframe and return document of that page -> virtual document
export function load_virtual_document(url_handler: URL, onload: (vdocument: Document) => void): void {
    const cors_anywhere_url = `${cors_anywhere}/${url_handler.toString()}`;

    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    // required for iframe to load
    document.body.appendChild(iframe);
    fetch(cors_anywhere_url).then(response => {
        response.text().then(text => {
            iframe.srcdoc = text;
            iframe.addEventListener("load", () => {
                onload(iframe.contentDocument!);
                document.body.removeChild(iframe);
            });
        });
    });
}

export function test_cors_anywhere(): void {
    const cors_anywhere_url = `${cors_anywhere}/http://chris-besch.com`;
    fetch(cors_anywhere_url).catch(_ => {
        throw `cors_anywhere at '${cors_anywhere}' is broken`;
    });
}

