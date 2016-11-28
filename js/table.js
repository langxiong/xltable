var data = [
    // array + colspan
    // object + rowspan
    {                        
        "k00": "v00", 
        "k01": ["v01-00", "v01-01"], 
        "k02": ["v02-00", "v02-01", "v03-01"], 
        "k03": {"k03-00": "v03-00", "k03-01": "v03-01"},
        "k04": {"k04-00": "v04-00", "k04-01": "v04-01" , "k04-02": "v04-02"},
        "k05": {"k05-00": ["v05-00", "v05-01", "v05-02"]}
    },
    {                        
        "k00": "v10", 
        "k01": ["v11-00", "v11-01"], 
        "k02": ["v12-00", "v12-01", "v13-01"], 
        "k03": {"k13-00": "v13-00", "k13-01": "v13-01"},
        "k04": {"k14-00": "v14-00", "k14-01": "v14-01", "k14-02": "v14-02"},
        "k05": {"k15-00": ["v15-00", "v15-01", "v15-02"]}
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
    this._firstRow = [];

    var xlTable = this;
    // parse main rows.
    data.forEach(function (row) {
        xlTable._parseRow(row);
    });
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


function XLSpan(nRow, nCol) {
    return {
        nRow: nRow,
        nCol: nCol
    };
}

function XLTd(text, XLSpan) {
    if (!(this instanceof XLTd)) {
        return new XLTd(text, XLSpan);
    }

    this.text = text;
    this.rowspan = XLSpan.nRow;
    this.colspan = XLSpan.nCol;
}

function XLRowCol(v, rows) {
    var rIndex = rows.length - 1;

    function updateRowSpan(rows, nRowIndex, nRowSpan) {
        for (var i = 0; i < rows[nRowIndex].length; ++i) {
            rows[nRowIndex][i].rowspan = nRowSpan + 1 - rows[nRowIndex][i].rowspan;
        }
    }

    if (typeof v === 'string') {
        var r = XLSpan(1, 1);
        rows[rIndex].push(XLTd(v, r));
        return r;
    }

    if (Array.isArray(v)) {
        if (v.length === 0) {
            var r = XLSpan(1, 1);
            rows[rIndex].push(XLTd('', r));
            return r;
        }

        var r = XLSpan(0, 0);
        for (var i = 0; i < v.length; ++i) {
            var tmp = XLRowCol(v[i], rows);
            r.nRow = r.nRow > tmp.nRow ? r.nRow : tmp.nRow;
            r.nCol += tmp.nCol;
        }

        updateRowSpan(rows, rIndex, r.nRow);

        return r;
    }

    if (typeof v === 'object') {
        var keys = Object.keys(v);
        if (keys.length === 0) {
            var r = XLSpan(1, 1);
            rows[rIndex].push(XLTd('', r));
            return r;
        }

        var r = XLSpan(0, 0);
        rows.push(new Array());
        for (var i = 0; i < keys.length; ++i) {
            var k = keys[i];
            var tmp = XLRowCol(v[k], rows);

            r.nRow = r.nRow > tmp.nRow ? r.nRow : tmp.nRow;
            r.nCol += tmp.nCol;

            rows[rIndex].push(XLTd(k, tmp));
        }
        r.nRow += 1;

        updateRowSpan(rows, rIndex, r.nRow);
        return r;
    }

    var r = XLSpan(0, 0);
    rows[rIndex].push(XLTd(v.toString(), r));
    return r;
}


XLNewTable.prototype._parseRow = function(row) {
    // keys
    var tmpKeys = Object.keys(row);
    
    this._rows = [];
    this._rows.push(new Array());

    var tmpFirstRow = [];

    for (var i = 0; i < tmpKeys.length; ++i) {
        var k = tmpKeys[i];
        var r = XLRowCol(row[k], this._rows);
        r.nRow = 1;
        tmpFirstRow.push(XLTd(k, r));
    }

    if (!_.isEqual(tmpFirstRow, this._firstRow)) {
        this._data.push(tmpFirstRow);
        this._firstRow = tmpFirstRow;
    }

    for (var i = 0; i < this._rows.length; ++i) {
        this._data.push(this._rows[i]);
    }

};

XLNewTable.prototype.renderHtml = function() {
    var html = '<table border=\"1\"><tbody>';

    this._data.forEach(function(row) {
        html += '<tr>';
        row.forEach(function(col) {
            html += '<td';
            if (col.rowspan > 1) {
                html += ' rowspan=\"';
                html += col.rowspan.toString();
                html += '\"';
            }
            if (col.colspan > 1) {
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