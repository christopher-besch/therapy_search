// create hidden iframe and return document of that page -> virtual document
export function load_virtual_document(url: string, onload: (vdocument: Document) => void): void {
    // const cors_anywhere_url = `https://cors-anywhere.herokuapp.com/${url}`;
    const cors_anywhere_url = `http://localhost:8080/${url}`;

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
