// create hidden iframe and return document of that page -> virtual document
export function load_virtual_document(url_handler: URL, onload: (vdocument: Document) => void): void {
    const cors_anywhere_url = `http://192.168.188.40:8080/${url_handler.toString()}`;

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
