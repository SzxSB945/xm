/**
 * 表格组件2
 * @author hq
 */

(function () {
  var pluginName = "ms-table2";

  $.plugins.registPlugin(pluginName, function() {
    $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
      avalon.component(pluginName, {
        template: pluginTpl,
        defaults: {
          // 是否隐藏头部
          hideHead: false,
          // 标题
          title: "",
          // 最大总数
          maxTotal: Number.MAX_VALUE,

          // 总数
          total: 0,
          // 原始数据
          rowData: [],
          // 5个一组的数据(便于前端显示)
          rowData2: [],

          // 点击+号按钮最大的总数
          maxGotTotal: 0,
  
          // 处理行数据
          processRowData: function() {
            // 生成前端渲染需要的数据
            var maxId = -1;
            $.each(this.rowData, function(i, rd) {
              maxId = Math.max(maxId, parseInt(rd.id));
            });

            this.rowData2.clear();
  
            // 如果没有数据，则生成5个空数据
            if(!this.rowData.length) {
              this.total = 0;
  
              var tmpData = [];
  
              for(var i = 0; i < 5; i++) {
                tmpData.push({
                  id: i + 1,
                  value: ""
                });
              }
              
              this.rowData2.push(tmpData);
              this.total = tmpData.length;
  
              return;
            }
  
            // maxId后最近一个能整除5的数
            var lastId = maxId;
  
            while(lastId % 5 != 0) {
              lastId++;
            }
  
            var rowData = [];
            // 生成数据
            for(var i = 1; i <= lastId; i++) {
              // 是否是已有数据
              var existData = $.grep(this.rowData, function(rd) {
                return i == parseInt(rd.id);
              });
  
              rowData.push({
                id: i,
                // 如果是已有的数据，则填入对应的值，否则填入空值
                value: existData.length ? existData[0].value : ""
              });
  
              if(i % 5 == 0) {
                this.rowData2.push(rowData);
                rowData = [];
              }
            }
  
            this.total = lastId;
            
            this.maxGotTotal = lastId;
          },
  
          onInit: function() {
            var _this = this;
  
            this.processRowData();
  
            this.$watch("rowData", function() {
              _this.processRowData();
            });
          },
  
          onReady: function() {
            // $("#" + this.$id + " .table-container").niceScroll({ cursorcolor: "#b9b9b9" });
          },
  
          getData: function() {
            var rowData = [];
  
            $.each(this.rowData2, function(i, rd) {
              rowData = rowData.concat(rd.$model);
            });

            // 遍历当前总数到曾经获取到的最大总数，从原始数据中获取到当前被删除了的数据
            // 将这部分数据设为空值传入到返回值中
            for(var id = this.total + 1; id <= this.maxGotTotal; id++) {
              var rd = $.grep(this.rowData, function(rd) { return rd.id == id });

              if(rd.length && rd[0].value) {
                rowData.push({
                  id: id,
                  value: ""
                });
              }
            }
  
            return rowData;
          },
  
          // 添加行
          addRow: function() {
              if(this.total >= this.maxTotal) {
                  $.alert($.lang.get("maxCountLimit", this.maxTotal));
                  return;
              }

              this.rowData2.push([
                  {id: ++this.total, value: ""},
                  {id: ++this.total, value: ""},
                  {id: ++this.total, value: ""},
                  {id: ++this.total, value: ""},
                  {id: ++this.total, value: ""}
              ]);

              // 存入获取到的最大总数
              this.maxGotTotal = Math.max(this.maxGotTotal, this.total);
          },

          // 移除最后一行数据
          removeRow: function() {
            this.rowData2.splice(this.rowData2.length - 1, 1);
            this.total -= 5;
          },
  
          handleChange: function(id, value) {
            $.each(this.rowData2, function(index, rd) {
              for(var i = 0;  i < rd.length; i++) {
                if(rd[i].id == id) {
                  rd[i].value = value;
                }
              }
            });
          }
        }
      });
    });
  });
})();