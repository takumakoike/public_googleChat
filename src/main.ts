// Typescriptで作成　Claspでpush
function pushToChat(message: string){
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    if(sheet.getName() !== "要件定義") return;

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
    const col = cell.getColumn();
    const row = cell.getRow();
    const editedValue = cell.getValue();
    const statusLists = getStatusList();
    if(sheet.getName() !== "要件定義") return;

    const statusEditMessage = `${row}行目のステータス変更通知\n【ステータス】　${editedValue}　に変更されました\n【担当者】　${cell.offset(0,1).getValue()}\n【詳細】\n${cell.offset(0, 2).getValue()}` 
    const staffEditMessage = `${row}行目の担当者変更通知\n【ステータス】　${cell.offset(0, -1).getValue()}\n【担当者】　${editedValue} が割り当てられました\n【詳細】\n${cell.offset(0, 1).getValue()}`
    
    // M列：担当者の更新があったら通知
    if(col === 13 && !editedValue.match("担当")){
        pushToChat(staffEditMessage);
        console.log(staffEditMessage);
        return
    }
    
    // L列：ステータスの更新があったら通知
    if(col === 12 && statusLists.some(status => status === editedValue) && !cell.offset(0,1).getValue().match("担当")){
        pushToChat(statusEditMessage);
        console.log(statusEditMessage);
        return
    }
}

function getStatusList(): string[]{
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