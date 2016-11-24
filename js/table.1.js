var data = [
    [
        {
            "pos": "0,0,1,1",
            "html": "<td>1</td>"
        },
        {
            "pos": "1,0,2,1",
            "html": "<td colspan=\"2\">2 & 3</td>"
        },
        {
            "pos": "3,0,1,1",
            "html": "<td>4</td>"
        }
    ],
    [
        {
            "pos": "0,1,1,3",
            "html": "<td rowspan=\"3\">5, 9, 13</td>"
        },
        {
            "pos": "1,1,1,1",
            "html": "<td>6</td>"
        },
        {
            "pos": "2,1,1,1",
            "html": "<td>7</td>"
        },
        {
            "pos": "3,1,1,1",
            "html": "<td>8</td>"
        }
    ],
    [
        {
            "pos": "1,2,1,1",
            "html": "<td>10</td>"
        },
        {
            "pos": "2,2,1,1",
            "html": "<td>11</td>"
        },
        {
            "pos": "3,2,1,1",
            "html": "<td>12</td>"
        }
    ],
    [
        {
            "pos": "1,3,3,1",
            "html": "<td colspan=\"3\">14, 15, 16</td>"
        }
    ],
]

var tbId = document.getElementById('tb');
var tmpHtml = '';

data.forEach(function (row) {
    tmpHtml += "<tr>";
    row.forEach(function (col) {
        tmpHtml += col.html;
    })
    tmpHtml += "</tr>";
});

tbId.insertAdjacentHTML('beforeend', tmpHtml);