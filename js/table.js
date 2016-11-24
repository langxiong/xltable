var data = [
    [
        {
            "pos": "0,0,1,1",
            "text": "1"
        },
        {
            "pos": "1,0,2,1",
            "text": "2 & 3"
        },
        {
            "pos": "3,0,1,1",
            "text": "4"
        }
    ],
    [
        {
            "pos": "0,1,1,3",
            "text": "5, 9, 13"
        },
        {
            "pos": "1,1,1,1",
            "text": "6"
        },
        {
            "pos": "2,1,1,2",
            "text": "7, 11"
        },
        {
            "pos": "3,1,1,1",
            "text": "8"
        }
    ],
    [
        {
            "pos": "1,2,1,1",
            "text": "10"
        },
        {
            "pos": "3,2,1,1",
            "text": "12"
        }
    ],
    [
        {
            "pos": "1,3,3,1",
            "text": "14, 15, 16"
        }
    ],
]

function formatHtml(colObj) {
    var tmp = colObj.pos.split(",");
    var tmpHtml = "<td";
    if (tmp[2] != "1") {
        tmpHtml += " colspan=\"";
        tmpHtml += tmp[2];
        tmpHtml += "\"";
    }

    if (tmp[3] != "1") {
        tmpHtml += " rowspan=\"";
        tmpHtml += tmp[3];
        tmpHtml += "\"";
    }

    tmpHtml += ">";
    tmpHtml += colObj.text;
    tmpHtml += "</td>";
    return tmpHtml;
}

var tbId = document.getElementById('tb');
var tmpHtml = '';

data.forEach(function (row) {
    tmpHtml += "<tr>";
    row.forEach(function (col) {
        tmpHtml += formatHtml(col);
    })
    tmpHtml += "</tr>";
});

tbId.insertAdjacentHTML('beforeend', tmpHtml);