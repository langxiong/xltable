// var data = [
//     [
//         {
//             "courseName": 　"语文",
//             "class": [
//                 {
//                     "className": "一班",
//                     "scores": {
//                         "midtermScore": ,
//                         "finalScore": 
//                     }
//                 }

//             ]
//         }
//     ],
// ]

function XLTable(nRow, nCol) {
    this._cells = [];
    this._nRow = nRow > 1 ? nRow : 1;
    this._nCol = nCol > 1 ? nCol : 1;

XLTable.prototype.reset = function() {
    this._cells = [];
    this.reset();
};

XLTable.prototype.reset = function() {
    this._cells = [];

    for (var r = 0; r < this._nRow; ++r) {
        var tmpRow = [];
        for (var c = 0; c < this._nCol; ++c) {
            var id = r * this._nCol + c;
            tmpRow.push({
                _id: id,
                _followId: id,
                rowspan: 1,
                colspan: 1,
                _debugText: id.toString()
            });
        }
        this._cells.push(tmpRow);
    }
};

XLTable.prototype.addRow = function() {
    var tmpRow = [];
    for (var c = 0; c < this._nCol; ++c) {
        var id = (this._nRow) * this._nCol + c
        tmpRow.push({
            _id: id,
            _debugText: id.toString()
        });
    }
    this._cells.push(tmpRow);
    this._nRow++;
};

XLTable.prototype.removeRow = function() {
    this._cells.pop();
    this._nRow--;
};

XLTable.prototype.addCol = function() {
    this._nCol++;
    this.reset();
};

XLTable.prototype.removeCol = function() {
    this._nCol--;
    this.reset();
};

XLTable.prototype.mergeCells = function(cellIds) {
    // 
    if (!Array.isArray(cellIds) || cellIds.length < 2) {
        return;
    }

    cellIds.sort(function(lhs, rhs) {
        return lhs - rhs;
    });

    var leaderCellId = cellIds[0];
    var r0 = Math.floor(leaderCellId / this._nCol);
    var c0 = leaderCellId % this._nCol;

    var endCellId = cellIds[cellIds.length - 1];
    var rE = Math.floor(endCellId / this._nCol);
    var cE = endCellId % this._nCol;

    for (var r = r0; r <= rE; ++r) {
        for (var c = c0; c <= cE; ++c) {
            this._cells[r][c]._followId = leaderCellId;
        }
    }

    this._cells[r0][c0].rowspan = rE - r0 + 1;
    this._cells[r0][c0].colspan = cE - c0 + 1;
};

XLTable.prototype.fillData = function(data) {

};

XLTable.prototype.renderHtml = function() {
    var html = '<table border=\"1\"><tbody>';

    this._cells.forEach(function(row) {
        html += '<tr>';
        row.forEach(function(col) {
            if (col._followId === col._id) {
                html += '<td';
                if (col.rowspan > 1) {
                    html += ' rowspan=\"';
                    html += col.rowspan.toString();
                    html += "\"";
                }
                if (col.colspan > 1) {
                    html += ' colspan=\"';
                    html += col.colspan.toString();
                    html += "\"";
                }
                html += ">";
                html += col._debugText;
                html += "</td>"
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
};


var myTable = new XLTable(15, 30);

myTable.mergeCells([
    0, 449
]);
document.write(myTable.renderHtml());

// var tbId = document.getElementById('tb');
// var tmpHtml = '';

// data.forEach(function(row) {
//     tmpHtml += "<tr>";
//     row.forEach(function(col) {
//         tmpHtml += formatHtml(col);
//     })
//     tmpHtml += "</tr>";
// });

// tbId.insertAdjacentHTML('beforeend', tmpHtml);