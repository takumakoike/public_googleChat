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

function statusList(): string[]{
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("date");
    const lastRow = sheet?.getRange(1,1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
    if(!lastRow || lastRow < 2) return [];
    
    const lists = sheet?.getRange(2,1,lastRow-1,1).getValues();
    if(!lists || lists.length === 0) return [];
    // console.log(lists);
    // console.log(lists.flat())
    return lists.flat()
}