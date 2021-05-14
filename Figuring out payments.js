// columns of the OG table
var whoPaid = 1;
var whoOwesTheMoney = 5;
var amount = 4;

// OG starting points
var ogRow = 6;
var ogCol = 7;

// struct of pairs
function coords(r, c) {
  this.r = r;
  this.c = c;
}
// coord1 being (N1->N2) and coord2 is (N2->N1)
function pairs(coord1, coord2, N1, N2) {
  this.coord1 = coord1;
  this.coord2 = coord2;
  this.N1 = N1;
  this.N2 = N2;
}
var items = [
  new pairs(new coords(ogRow    , ogCol)    , new coords(ogRow - 3, ogCol + 1), "Angela", "Athena"),
  new pairs(new coords(ogRow + 3, ogCol)    , new coords(ogRow - 3, ogCol + 2), "Angela", "Bo"   ),
  new pairs(new coords(ogRow + 6, ogCol)    , new coords(ogRow - 3, ogCol + 3), "Angela", "Jason"),
  new pairs(new coords(ogRow + 9, ogCol)    , new coords(ogRow - 3, ogCol + 4), "Angela", "Nikki"),
  new pairs(new coords(ogRow + 3, ogCol + 1), new coords(ogRow    , ogCol + 2), "Athena", "Bo"   ),
  new pairs(new coords(ogRow + 6, ogCol + 1), new coords(ogRow    , ogCol + 3), "Athena", "Jason"),
  new pairs(new coords(ogRow + 9, ogCol + 1), new coords(ogRow    , ogCol + 4), "Athena", "Nikki"),
  new pairs(new coords(ogRow + 6, ogCol + 2), new coords(ogRow + 3, ogCol + 3), "Bo"    , "Jason"),
  new pairs(new coords(ogRow + 9, ogCol + 2), new coords(ogRow + 3, ogCol + 4), "Bo"    , "Nikki"),
  new pairs(new coords(ogRow + 9, ogCol + 3), new coords(ogRow + 6, ogCol + 4), "Jason" , "Nikki"),
];
var itemLen = items.length;

// original getPayment function to put in every chart val
function getPayment(perOwing, perOwed, $A$1) {
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sheet=ss.getSheets()[0];
  var selection=sheet.getDataRange();
  var rows=selection.getNumRows();
  var count = 0;
  // go through all the rows
  for (var row=1; row < rows; row++) {
    // set a row row function in case of empty
    var row2 = row;
    var row3 = row;
    var owed = SpreadsheetApp.getActiveSheet().getRange(row, whoPaid).getValue();
    var owing = SpreadsheetApp.getActiveSheet().getRange(row, whoOwesTheMoney).getValue();
    // consider end
    if (owing == "") {
      return count;
    }
    // considering merged
    while (owed == "") {
      row2 -= 1;
      owed = SpreadsheetApp.getActiveSheet().getRange(row2, whoPaid).getValue();
    }
    var val = SpreadsheetApp.getActiveSheet().getRange(row3, amount).getValue();
    while (val == "") {
      row3 -= 1;
      val = SpreadsheetApp.getActiveSheet().getRange(row3, amount).getValue();
    }
    if (owed == perOwed && owing == perOwing) {
      count += val;
    }
  }
  return count;
}

// function to refresh the chart
function changeVal() {
  let row = 18;
  let col = ogCol;
  var input = SpreadsheetApp.getActiveSheet().getRange(row, col).getValue();
  if (input == true) {
    SpreadsheetApp.getActiveSheet().getRange(row, col).setValue(false);
  } else {
    SpreadsheetApp.getActiveSheet().getRange(row, col).setValue(true);
  }
}

// helper function to simplify the chart
function changeLarger(r1, c1, r2, c2) {
  let v1 = SpreadsheetApp.getActiveSheet().getRange(r1, c1).getValue();
  let v2 = SpreadsheetApp.getActiveSheet().getRange(r2, c2).getValue();
  if (v1 > v2) {
    var diff = v1 - v2;
    SpreadsheetApp.getActiveSheet().getRange(r1, c1).setValue(diff);
    SpreadsheetApp.getActiveSheet().getRange(r2, c2).setValue(0);
  } else if (v2 > v1) {
    var diff = v2 - v1;
    SpreadsheetApp.getActiveSheet().getRange(r1, c1).setValue(0);
    SpreadsheetApp.getActiveSheet().getRange(r2, c2).setValue(diff);
  }
}
// simplify the chart! :3
function simplify() {
  for (let i = 0; i < itemLen; i++) {
    changeLarger(items[i].coord1.r, items[i].coord1.c, items[i].coord2.r, items[i].coord2.c);
  }
}

// will put the get payment function into the charts with the correct names for each location
function unsimplified() {
  var baseString = "=getPayment(\"x\",\"z\",G18)";
  for (let i = 0; i < itemLen; i++) {
    let newString1 = baseString.replace("x", items[i].N1).replace("z", items[i].N2);
    SpreadsheetApp.getActiveSheet().getRange(items[i].coord1.r, items[i].coord1.c).setValue(newString1);
    let newString2 = baseString.replace("x", items[i].N2).replace("z", items[i].N1);
    SpreadsheetApp.getActiveSheet().getRange(items[i].coord2.r, items[i].coord2.c).setValue(newString2);
  }
}
