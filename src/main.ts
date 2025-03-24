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

function sheetOnEdit(e: GoogleAppsScript.Events.SheetsOnEdit){
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const cell = sheet.getActiveCell();
    // const col = cell.getColumn();
    const row = cell.getRow();
    const editedValue = cell.getValue();
    if(sheet.getName() !== "Google chat webhook") return;

    if(editedValue === "開発開始"){
        const message = `${row}行目のステータスが【開発開始】になりました。\n詳細：${cell.offset(0, 1).getValue()}`
        pushToChat(message);
    }
}