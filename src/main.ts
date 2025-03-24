// Typescriptで作成　Claspでpush
function pushToChat(message: string){
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    if(sheet.getName() !== "Google chat webhook") return;

    const url = PropertiesService.getScriptProperties().getProperty("WEBHOOK_URL");
    if(!url) return;
    const payload = JSON.stringify({"text": message})

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: "post",
        contentType: "application/json",
        payload: payload,
    }
    UrlFetchApp.fetch(url, options)
}

function sheetOnEdit(e){
    
}