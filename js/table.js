var data = [
    // array + colspan
    // object + rowspan
    {
        "k00": "v00",
        "k01": ["v01-00", "v01-01"],
        "k02": ["v02-00", "v02-01", "v02-02"],
        "k03": { "k03-00": "v03-00", "k03-01": "v03-01" },
        "k04": { "k04-00": "v04-00", "k04-01": "v04-01", "k04-02": "v04-02" },
        "k05": { "k05-00": ["v05-00", "v05-01", "v05-02"] },
        "k06": { "k06-00": { "k06-10": { "k06-20": "v06-20" } } },
        "k07": {
            "k04-00": "v04-00", "k04-01": "v04-01", "k04-02": "v04-02", "ktttt": {
                "k10": {
                    "k04-00": "v04-00", "k04-01": "v04-01", "k04-02": "v04-02",
                    "k20": { "k04-00": "v04-00", "k04-01": "v04-01", "k04-02": "v04-02" }
                }
            },
            "k08": { "k05-00": ["v05-00", "v05-01", "v05-02"] },
            "k09": { "k06-00": { "k06-10": { "k06-20": "v06-20" } } },
        }
    },
    {
        "k00": "v10",
        "k01": ["v11-00", "v11-01"],
        "k02": ["v12-00", "v12-01", "v12-02"],
        "k03": { "k13-00": "v13-00", "k13-01": "v13-01" },
        "k04": { "k14-00": "v14-00", "k14-01": "v14-01", "k14-02": "v14-02" },
        "k05": { "k15-00": ["v15-00", "v15-01", "v15-02"] },
        "k06": "v06",
        "k07": { "k04-00": "v04-00", "k04-01": "v04-01", "k04-02": "v04-02" },
        "k08": { "k05-00": ["v05-00", "v05-01", "v05-02"] },
        "k09": { "k06-00": { "k06-10": { "k06-20": "v06-20" } } },
        "k10": { "k04-00": "v04-00", "k04-01": "v04-01", "k04-02": "v04-02" },
        "k11": { "k05-00": ["v05-00", "v05-01", "v05-02"] },
        "k12": { "k06-00": { "k06-10": { "k06-20": "v06-20" } } },
    },
    {
        "中文纷纷": {
            "左": [
                "天之道",
                "损有余而补不足",
                {
                    "人之道":
                    {
                        "则不然": "损不足以奉有余"
                    },
                    "孰能有余以奉天下": "唯有道者。 出自哪里"
                }
            ],
            "右": {
                "天上第一": {
                    "有容乃大": "受益惟谦，有容乃大"
                },
                "地上第二": {
                    "人": false,
                    "鸟": 1,
                    "大将": null
                }
            }
        }
    }
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
    data.forEach(function(row) {
        xlTable._parseRow(row);
    });
};

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

function XLRowCol(v, rows, rIndex, nRowSpan, nColSpan) {
    if (typeof v === 'string') {
        var r = XLSpan(nRowSpan, 1);
        rows[rIndex].push(XLTd(v, r));
        return r;
    }

    if (Array.isArray(v)) {
        if (v.length === 0) {
            var r = XLSpan(nRowSpan, 1);
            rows[rIndex].push(XLTd('', r));
            return r;
        }

        var r = XLSpan(nRowSpan, 0);
        for (var i = 0; i < v.length; ++i) {
            var nLenBefore = rows[rIndex].length;
            var tmp = XLRowCol(v[i], rows, rIndex, r.nRow, r.nCol);
            var nLenAfter = rows[rIndex].length;

            if (r.nRow < tmp.nRow) {
                r.nRow = tmp.nRow;
            }

            r.nCol += tmp.nCol;
        }
        return r;
    }

    if (typeof v === 'object') {
        if (!v) {
            var r = XLSpan(nRowSpan, 1);
            rows[rIndex].push(XLTd('', r));
            return r;
        }

        var keys = Object.keys(v);
        if (keys.length === 0) {
            var r = XLSpan(nRowSpan, 1);
            rows[rIndex].push(XLTd('', r));
            return r;
        }

        var r = XLSpan(1, 0);
        rows.push(new Array());
        for (var i = 0; i < keys.length; ++i) {
            var k = keys[i];

            var nLenBefore = rows[rIndex].length;
            var tmp = XLRowCol(v[k], rows, rIndex + 1, nRowSpan - 1, r.nCol);
            var nLenAfter = rows[rIndex].length;

            if (r.nRow < tmp.nRow) {
                r.nRow = tmp.nRow;
            }

            r.nCol += tmp.nCol;
            // keys always as one row
            tmp.nRow = 1;
            rows[rIndex].push(XLTd(k, tmp));
        }
        r.nRow += 1;
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

    var nDepth = getDepth(row);
    for (var i = 0; i < tmpKeys.length; ++i) {
        var k = tmpKeys[i];
        var r = XLRowCol(row[k], this._rows, 0, nDepth);
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

function getDepth(obj) {
    var nDepth = 1;
    if (typeof obj === 'string') {
        return nDepth;
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return nDepth;
        }

        var nObjDepth = 0;
        for (var i = 0; i < obj.length; ++i) {
            var nTmpDepth = getDepth(obj[k]);

            nObjDepth = nTmpDepth > nObjDepth ? nTmpDepth : nObjDepth;
        }
        nDepth += nObjDepth;
        return nDepth;
    }

    if (typeof obj === 'object') {
        if (!obj) {
            return nDepth;
        }

        var nObjDepth = 0;
        for (var k in obj) {
            var nTmpDepth = getDepth(obj[k]);

            nObjDepth = nTmpDepth > nObjDepth ? nTmpDepth : nObjDepth;
        }
        nDepth += nObjDepth;
        return nDepth;
    }

    return nDepth;
}

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