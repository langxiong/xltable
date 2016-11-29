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
            "k09": { "k06-00": { "k06-10": { "k06-20": "v06-20" } } }
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
        "k12": { "k06-00": { "k06-10": { "k06-20": "v06-20" } } }
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