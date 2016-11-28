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

var data = [
    {                        
        "k00": "v00", 
        "k01": ["v01-0", "v01-1"], // keys span + array.length. 
        "k02": {"k02-00": "v02-00", "k02-01": "v02-01"},
        "k03": {"k03-0": ["v03-0", "v03-1"]}
    },
    {                        
        "k00": "v10", 
        "k01": ["v11-0", "v11-1"], 
        "k02": {"k12-00": "v12-00", "k12-01": "v12-01"},
        "k03": {"k13-0": ["v13-0", "v13-1"]}
    },
]

function XLNewTable(data) {
    if (!(this instanceof XLNewTable)) {
        return new XLNewTable(data);
    }
    if (!Array.isArray(data) || data.length < 1) {
        return;
    }

    this._nInitRow = data.length;

    this._data = [];
    this._cachedKeys = [];
    this._firstRow = [];

    var xlTable = this;
    // parse main rows.
    data.forEach(function (row) {
        xlTable._parseRow(row);
    });

    this._data.unshift(this._firstRow);    
};

function XLCol(strInitText) {
    if (!(this instanceof XLCol)) {
        return new XLCol(strInitText);
    }
    this.text = strInitText;
    this.rowspan = 0;
    this.colspan = 0;
}

function XLSubObjCol(strInitText) {
    if (!(this instanceof XLSubObjCol)) {
        return new XLSubObjCol(strInitText);
    };

    this.text = strInitText;
    this.rowspan = 0;
    this.colspan = 0;
}


XLNewTable.prototype._parseRow = function(row) {
    // keys
    var tmpKeys = Object.keys(row);
    
    var isNeedInsertFirstRow = false;
    if (!_.isEqual(tmpKeys, this._cachedKeys)) {
        isNeedInsertFirstRow = true;
        this._cachedKeys = tmpKeys;

        for (var i = 0; i < tmpKeys.length; ++i) {
            this._firstRow.push(XLCol(tmpKeys[i]));
        }
    };

    var tmpRow = [];
    var subObjRow = [];
    var nRowSpan = 0;
    for (var i = 0; i < tmpKeys.length; ++i) {
        var tmpV = row[tmpKeys[i]];
        if (typeof tmpV === 'string') {
            tmpRow.push(XLCol(tmpV));
        } 
        else if (Array.isArray(tmpV)) {
            if (tmpV.length === 0) {
                tmpRow.push(XLCol(''));
            } else {
                // add firstRows span.
                this._firstRow[i].colspan = this._firstRow[i].colspan < tmpV.length ? 
                    tmpV.length : this._firstRow[i].colspan;
                for (var j = 0; j < tmpV.length; ++j) {
                    tmpRow.push(XLCol(tmpV[j]));
                }
            }
        }
        else if (typeof tmpV === 'object') {
            nRowSpan = 2;

            var nSubObjColSpan = 0;
            for (var k in tmpV) {
                var subObjCol = XLSubObjCol(k);
                var subObjVal = tmpV[k];
                if (typeof subObjVal === 'string') {
                    subObjRow.push(XLCol(tmpV[k]));
                    nSubObjColSpan += 1;
                } 
                else if (Array.isArray(subObjVal)) {
                    nSubObjColSpan += subObjVal.length;
                    subObjCol.colspan = subObjVal.length;
                    
                    for (var j = 0; j < subObjVal.length; ++j) {
                        subObjRow.push(XLCol(subObjVal[j]));
                    }
                }
                tmpRow.push(subObjCol);
            }

            // add firstRows span.
            this._firstRow[i].colspan = this._firstRow[i].colspan < nSubObjColSpan ? 
                nSubObjColSpan : this._firstRow[i].colspan;

        }
    }

    for (var i = 0; i < tmpRow.length; ++i) {
        if (tmpRow[i] instanceof XLCol) {
            tmpRow[i].rowspan = nRowSpan;
        }
    }
    this._data.push(tmpRow);
    if (subObjRow.length !== 0) {
        this._data.push(subObjRow);
    }
};

XLNewTable.prototype.renderHtml = function() {
    var html = '<table border=\"1\"><tbody>';

    this._data.forEach(function(row) {
        html += '<tr>';
        row.forEach(function(col) {
            html += '<td';
            if (col.rowspan !== 0) {
                html += ' rowspan=\"';
                html += col.rowspan.toString();
                html += '\"';
            }
            if (col.colspan !== 0) {
                html += ' colspan=\"';
                html += col.colspan.toString();
                html += '\"';
            }
            html += '>';
            html += col.text;
            html += '</td>';
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
};

var newTable = XLNewTable(data);

document.write(newTable.renderHtml());

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