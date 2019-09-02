// 测试数据
var mockData = [
            {
                method: "gw.config.set",
                id753: 2,
                resp: {
                    success: true
                }
            },

    //储存使用情况
        {
            method: "gw.config.get",
            line_id: 1,
            id: 970,
            resp: {
                line_id1: {
                    id970: "SYS 976 974|DATA 1952 1900|VOICE 4125 4000|LOG 7742 7000"
                }
            }
        }, {
            method: "gw.config.get",
            line_id: 2,
            id: 970,
            resp: {
                line_id2: {
                    id970: "SYS 976 974|DATA 1952 1948|VOICE 4125 4125|LOG 7742 7742"
                }
            }
        },

    //ip分机在线
    {
        method: "gw.config.get",
        id: 1373,
        resp: {
            id1373: 300
        }
    },
    {
        method: "gw.status.get", line_id: 1, id: 100,
        resp: { line_id1: { id100: 9 } }
    },
    {
        method: "gw.status.get", line_id: 2, id: 100,
        resp: { line_id2: { id100: 1 } }
    },
    {
        method: "gw.status.get", line_id: 3, id: 100,
        resp: { line_id3: { id100: 1 } }
    },
    {
        method: "gw.status.get", line_id: 4, id: 100,
        resp: { line_id4: { id100: 1 } }
    },
    {
        method: "gw.status.get", line_id: 5, id: 100,
        resp: { line_id5: { id100: 0 } }
    },
    {
        method: "gw.status.get", line_id: 6, id: 100,
        resp: { line_id6: { id100: 1 } }
    },
    {
        method: "gw.status.get", line_id: 7, id: 100,
        resp: { line_id7: { id100: 1 } }
    },
    {
        method: "gw.status.get", line_id: 8, id: 100,
        resp: { line_id8: { id100: 1 } }
    },
    {
        method: "gw.status.get", line_id: 9, id: 100,
        resp: { line_id9: { id100: 0 } }
    },
    {
        method: "gw.status.get", line_id: 10, id: 100,
        resp: { line_id10: { id100: 1 } }
    },
    {
        method: "gw.config.get",  id: 770,
        resp: { id770: "english|chinese" }
    },
    {
        method: "gw.config.get", id: 1062,
        resp: { id1062: "chinese" }
    }
];