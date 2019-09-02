/**
 * 表格渲染
 * author hq
 */

(function () {
  $.extend({
    table: {
      // 初始化并渲染表格系统
      init: function() {
        // 渲染表格
        var renderTable = function (dom, table) {
          var controllerId = "table-" + Math.random().toString().substr(2);
          var tableHtml = "<div ms-controller=\"" + controllerId + "\" class=\"ms-table-container\" style=\"width: 100%; height: 100%;\"><wbr ms-widget=\"{is: 'ms-table', tableDefine: @tableDefine}\"></div>";
      
          dom.replaceWith(tableHtml);
      
          // 表格定义
          var tableDefine = {
            tableId: table.tableId,
            pageSize: DEFAULT_PAGE_SIZE, //table.pageSize,
            disablePagination: (table.disablePagination == "true" || table.disablePagination == true) ? true : false,
            disablePageInfo: (table.disablePageInfo == "true" || table.disablePageInfo == true) ? true : false,
            clickEdit: (table.clickEdit == "true" || table.clickEdit == true) ? true : false,
            saveButton: (table.saveButton == "true" || table.saveButton == true) ? true : false,
            rowDataLoad: "",
            rowTotalLoad: "",
            rowData: [],
            rowTotal: 0,
            style: table.style,
            // 是否自动加载数据
            autoLoadData: $.isUndefined(table.autoLoadData) ? true : table.autoLoadData,
            pageSNField: $.isUndefined(table.pageSNField) ? "" : table.pageSNField,
            isTableReady: false,
            onReadyCallback: ""
          };
      
          // 表数据加载脚本
          tableDefine.loadRowData = Function("table", "startIdx", "page", "pageSize", "searchCondition", table.dataLoadScript);
      
          // 表总数加载脚本
          tableDefine.loadRowTotal = Function("table", "searchCondition", table.totalLoadScript);
      
          // 点击保存按钮
          if (tableDefine.saveButton) {
            tableDefine.clickSaveButton = Function("table", "modifiedRows", table.saveButtonScript);
          }
      
          if (table.clickRowScript) {
            tableDefine.clickRowScript = Function("table", "row", table.clickRowScript);
          }
      
          // 处理列定义
          var columnDefines = [];
          avalon.each(table.columns, function (index, column) {
            column.showRawData = false;
            var columnDefine = {};
            avalon.mix(true, columnDefine, column);
      
            // 处理列内容格式化函数
            if (!$.isUndefined(columnDefine.formatter) &&
              columnDefine.formatter !== "") {
              columnDefine.formatter = Function("value", "row", columnDefine.formatter);
            }
      
            // 处理按钮回调函数
            if (columnDefine.type == "button") {
              avalon.each(columnDefine.buttons, function (index, button) {
                if (!$.isUndefined(button.click) &&
                  button.click !== "") {
                  button.click = Function("row", "event", "table", "columnIndex", button.click);
                }
              });
            }
      
            columnDefines.push(columnDefine);
          });
      
          tableDefine.columns = columnDefines;
      
          var vm = avalon.define({
            $id: controllerId,
            tableDefine: tableDefine
          });
      
          avalon.scan(document.body);
          // TODO avalon.scan(dom[0]);
          //avalon.scan(dom[0]);
      
          $.table._tables.push({
            tableId: table.tableId,
            vmodel: vm
          });
        };
      
        // 渲染页面上的表格
        var renderTables = function (tables) {
          $("[data-table]").each(function () {
            var _this = $(this);
            var table = $.grep(tables, function (n, i) { return n.tableId == _this.data("table"); });
      
            if (!table.length) {
              _this.html("表格未定义");
              return;
            }
      
            renderTable(_this, table[0]);
          });
        };
      
        var loadTables = function (callback) {
          $.getJSON("/modules/table/table.json", function (tables) {
            $.localCache.set("tables", JSON.stringify(tables));
      
            callback(tables);
          });
        };
        
        // 在插件加载完后执行
        $.plugins.registerPluginInitializedObserver(function() {
          // 获取表格模板
          $.localCache.get("tablesVersion", function (version) {
            // 如果表格版本号与配置文件中的不同（说明有更新）
            // 则需要加载表格内容
            if ($.isUndefined(version) ||
              version != WEB_VERSION_CODE) {
              loadTables(function (tables) {
                // 版本号
                $.localCache.set("tablesVersion", WEB_VERSION_CODE);
                
                renderTables(tables);
              });
            }
            else {
              $.localCache.get("tables", function(value) {
                renderTables(JSON.parse(value));
              });
            }
          });
        });
      },

      _tables: [],

      // /**
      //  * 设置table的数据
      //  * @param {*} tableId 
      //  * @param {*} data 
      //  */
      // setData: function(tableId, data) {
      //   var table = $.grep(this._tables, function(n, i) { return n.tableId == tableId});

      //   if(!table.length) {
      //     $.console.log("tableId不存在");
      //     return;
      //   }

      //   avalon.each(data, function(index, d) {
      //     d._isEditing = false;
      //     d._rowClass = "";
      //   });

      //   table[0].vmodel.tableDefine.rowData = data;
      // },

      _getTableById: function (tableId) {
        var table = $.grep(this._tables, function (n, i) { return n.tableId == tableId });

        if (!table.length) {
          return null;
        }

        return table[0];
      },

      /**
       * 获取table已选择的数据
       * @param {String} tableId 
       */
      getSelectedRows: function (tableId) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        var selectedRows = [];

        avalon.each(table.vmodel.$model.tableDefine.rowData, function (index, rd) {
          if (rd._isSelected) {
            selectedRows.push(rd);
          }
        });

        return selectedRows;
      },

      /**
       * 重新加载表格数据
       * @param {String} tableId 
       * @param {Boolean} reloadFirstPage 重新加载第1页并且重新加载分页
       */
      reload: function (tableId, opts) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        if(opts) {
          if(opts.reloadFirstPage == true) {
            table.vmodel.tableDefine.clearPaginationCache();
            table.vmodel.tableDefine.reload(1);
          }
        }
        else {
          table.vmodel.tableDefine.reload();
        }
      },

      /**
       * 删除行
       * @param {String} tableId 
       * @param {Object} rows
       */
      removeRows: function (tableId, rows) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        table.vmodel.tableDefine.removeRows(rows);
      },

      /**
       * 创建新行
       * @param {*} tableId 
       * @param {*} data 
       * @param {*} isEditing 
       */
      newRow: function (tableId, initData, isEditing) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        table.vmodel.tableDefine.addEmptyRow(initData);
      },

      /**
       * 获取修改的表格数据
       * @param {String} tableId 
       */
      getModifiedRows: function (tableId) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        return table.vmodel.tableDefine.getModifiedRows();
      },

      /**
       * 获取所有数据
       * @param {*} tableId 
       */
      getRows: function (tableId) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        return table.vmodel.tableDefine.getRows();
      },

      /**
       * 获取搜索条件
       * @param {String} tableId 
       * @param {Boolean} raw 
       */
      getSearchCondition: function (tableId, raw) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        return !raw ? table.vmodel.tableDefine.getTable().searchCondition :
          table.vmodel.tableDefine.getTable().rawSearchCondition;
      },

      /**
       * 设置搜索条件
       * @param {*} tableId 
       * @param {*} searchCondition 对象或数组形式的搜索条件。
       *   {cid401: 1, sid401: 1, eid401: 5} 或
       *   [{name:"分机", type:"partial/condition/start/end", id:"401", value:"1"}]
       */
      setSearchCondition: function (tableId, searchCondition, reload) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }
        table.vmodel.tableDefine.setSearchCondition(searchCondition);

        if (reload) {
          table.vmodel.tableDefine.clearPaginationCache();
          table.vmodel.tableDefine.reload(1);
        }
      },

      /**
       * 清空搜索条件
       * @param {*} tableId 
       * @param {*} reload 
       */
      clearSearchCondition: function (tableId, reload) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        table.vmodel.tableDefine.setSearchCondition({});

        if (reload) {
          table.vmodel.tableDefine.reload();
        }
      },

      // tableReadyCallback: {},

      // registOnReadyCallback: function(tableId, callback) {
      //   this.tableReadyCallback[tableId] = callback;
      // },

      // getOnReadyCallback: function(tableId) {
      //   return this.tableReadyCallback(tableId);
      // },

      // 开始加载数据
      startLoadData: function(tableId) {
        var table = this._getTableById(tableId);

        if (!table) {
          $.console.log("tableId不存在");
          return null;
        }

        if(table.vmodel.tableDefine.isTableReady) {
          table.vmodel.tableDefine.reload();
        }
        else {
          table.vmodel.tableDefine.onReadyCallback = function() {
            table.vmodel.tableDefine.reload();
          };
        }

        // if(table.vmodel.tableDefine.table &&
        //   table.vmodel.tableDefine.table.isTableReady) {
        //   table.vmodel.tableDefine.reload();
        // }
        // else {
        //   this.registOnReadyCallback(tableId, function() {
        //     table.vmodel.tableDefine.reload();
        //   });
        // }
      }
    }
  });
})();