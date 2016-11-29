/*!
 * XLTable.js
 *
 * @brief
 * XLTable is a table creator with json data specified.
 * Copyright (c) 2016-2017, https://github.com/langxiong/XLTable
 *
 * @author  xionglang x583194811l@gmail.com
 * @date    2016-11-29
 */

(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["XLTable"] = factory();
    else
        root["XLTable"] = factory();
})(this, function () {
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

    function XLTd(text, XLSpan, isNeedMerge) {
        if (!(this instanceof XLTd)) {
            return new XLTd(text, XLSpan, isNeedMerge);
        }

        this.text = text;
        this.rowspan = XLSpan.nRow;
        this.colspan = XLSpan.nCol;
        this.isNeedMerge = isNeedMerge ? true : false;
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
                rows[rIndex].push(XLTd('', r, true));
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

            nDepth = 0;
            for (var i = 0; i < obj.length; ++i) {
                var nTmpDepth = XLGetDepth(obj[k]);

                nDepth = nTmpDepth > nDepth ? nTmpDepth : nDepth;
            }
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

    XLTable.prototype._isEqual = function(arrFirst, arrSecond) {
        if (!Array.isArray(arrFirst) || !Array.isArray(arrSecond)) {
            return false;
        }

        var firstLen = arrFirst.length;
        var secondLen = arrSecond.length;

        if (firstLen !== secondLen) {
            return false;
        }

        for (var i = 0; i < firstLen; ++i) {
            if (arrFirst[i].text !== arrSecond[i].text) {
                return false;
            }
        }

        return true;
    };
    
    XLTable.prototype._parseRow = function (row) {
        // keys
        var tmpKeys = Object.keys(row);

        this._rows = [];
        this._rows.push(new Array());

        var tmpFirstRow = [];

        var nDepth = XLGetDepth(row);
        for (var i = 0; i < tmpKeys.length; ++i) {
            var k = tmpKeys[i];
            var r = XLRowCol(row[k], this._rows, 0, nDepth - 1);
            r.nRow = 1;
            tmpFirstRow.push(XLTd(k, r));
        }

        if (!this._isEqual(tmpFirstRow, this._firstRow)) {
            this._data.push(tmpFirstRow);
            this._firstRow = tmpFirstRow;
        }

        var rLen = this._rows.length;
        for (var i = 0; i < rLen; ++i) {
            var subRow = this._rows[i];
            var rSubLen = subRow.length;
            for (var j = rSubLen - 1; j > 0; --j) {
                if (subRow[j].isNeedMerge) {
                    subRow[j - 1].colspan += subRow[j].colspan;
                }
            }
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
                if (!col.isNeedMerge) {
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
                }
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
                if (!col.isNeedMerge) {
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
                }
            });
            html += '</tr>';
        });
        return html;
    };

    return XLTable;
}); 
