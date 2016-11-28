
function XLSpan(nRow, nCol) {
    return {
        nRow: nRow,
        nCol: nCol
    };
}

function XLRowCol(v) {
    if (typeof v === 'string') {
        return XLSpan(1, 1);
    }

    if (Array.isArray(v)) {
        if (v.length === 0) {
            return XLSpan(1, 1);
        }

        var r = XLSpan(0, 0);
        for (var i = 0; i < v.length; ++i) {
            var tmp = XLRowCol(v[i]);
            r.nRow = r.nRow > tmp.nRow ? r.nRow : tmp.nRow;
            r.nCol += tmp.nCol;
        }
        return r;
    }

    if (typeof v === 'object') {
        var k = Object.keys(v);
        if (k.length === 0) {
            return XLSpan(1, 1);
        }

        var r = XLSpan(0, 0);
        for (var i = 0; i < k.length; ++i) {
            var tmp = XLRowCol(v[k[i]]);
            r.nRow = r.nRow > tmp.nRow ? r.nRow : tmp.nRow;
            r.nCol += tmp.nCol;
        }
        r.nRow += 1;
        return r;
    }

    return XLRowCol(1, 1);
}
