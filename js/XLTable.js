(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["XLTable"] = factory();
	else
		root["XLTable"] = factory();
})(this, function() {
    function XLTable(data) {
        if (!(this instanceof XLTable)) {
            return new XLTable(data);
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

    function XLRowCol(v, rows, rIndex, nRowSpan) {
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
                var tmp = XLRowCol(v[i], rows, rIndex, r.nRow);
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
                var tmp = XLRowCol(v[k], rows, rIndex + 1, nRowSpan - 1);
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

        var r = XLSpan(nRowSpan, 1);
        rows[rIndex].push(XLTd(v.toString(), r));
        return r;
    }

    function XLGetDepth(obj) {
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
                var nTmpDepth = XLGetDepth(obj[k]);

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
                var nTmpDepth = XLGetDepth(obj[k]);

                nObjDepth = nTmpDepth > nObjDepth ? nTmpDepth : nObjDepth;
            }
            nDepth += nObjDepth;
            return nDepth;
        }

        return nDepth;
    }
    XLTable.prototype._parseRow = function (row) {
        // keys
        var tmpKeys = Object.keys(row);

        this._rows = [];
        this._rows.push(new Array());

        var tmpFirstRow = [];

        var nDepth = XLGetDepth(row);
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

    XLTable.prototype.renderHtml = function () {
        var html = '<table border=\"1\"><tbody>';

        this._data.forEach(function (row) {
            html += '<tr>';
            row.forEach(function (col) {
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

    XLTable.prototype.renderWithOutTableTag = function () {
        var html = '';

        this._data.forEach(function (row) {
            html += '<tr>';
            row.forEach(function (col) {
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
        return html;
    };

    return XLTable;
}); 
