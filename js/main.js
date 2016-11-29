var data = [
    {
        "保险责任": ["个人重大疾病保险", null],
        "热销款": "20万元",
        "基本款": "10万元",
        "自定义": [
            "10万元",
            "20万元"
        ]
    },
    {
        "保险责任": ["意外身故／伤残", null],
        "热销款": "50万元",
        "基本款": "10万元",
        "自定义": [
            "10万元",
            "20万元"
        ]
    },
    {
        "保险责任": ["轻度重大疾病", null],
        "热销款": "6万元",
        "基本款": "3万元",
        "自定义": [
            "10万元",
            "20万元"
        ]
    },
    {
        "保险责任": ["男性高发癌症", {"肺癌": {"大肠癌": "胃癌"}} ],
        "热销款": {"20万": {"20万":"20万"}},
        "基本款": {"5万": {"5万":"5万"}},
        "自定义": [
            "10万元",
            "20万元"
        ]
    }
]

var container = document.getElementById("jsoneditor");
var tb = document.getElementById('testTable');
var options = {
    mode: 'code',
    onChange: function () {
        try {

            var jsonData = editor.get();
            while (tb.firstChild) {
                tb.removeChild(tb.firstChild);
            }
            var newTable = new XLTable(jsonData);
            tb.insertAdjacentHTML('beforeend', newTable.renderWithOutTableTag());
            newTable = null;
        }
        catch (e) {
            console.error(e);
        }
    }
};

var editor = new JSONEditor(container, options);
editor.set(data);

var newTable = new XLTable(data);
tb.insertAdjacentHTML('beforeend', newTable.renderWithOutTableTag());
newTable = null;