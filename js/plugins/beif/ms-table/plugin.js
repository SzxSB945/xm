/**
 * 表格组件
 * @author hq
 */
(function () {
  var pluginName = "ms-table";

  $.plugins.registPlugin(pluginName, function () {
    $.plugins.getPluginTpl(pluginName, function (pluginTpl) {
      avalon.component(pluginName, {
        template: pluginTpl,

        defaults: {
          // 这个id用来绑定点击页面其他地方退出编辑模式事件时使用
          tbodyId: "",

          // 行组件模型
          $rowWidgetVModels: [],

          // 组件onReady事件
          widgetReady: function (e) {
            // 保存记录的组件模型
            this.$rowWidgetVModels.push(e.vmodel);
          },

          // 组件onDispose事件
          widgetDispose: function (e) {
            var _this = this;

            $.each(this.$rowWidgetVModels, function (i, vm) {
              if (vm == e.vmodel) {
                // 如果有关闭tip的方法，直接调用一次
                if (vm.closeTip) {
                  vm.closeTip();
                }
                _this.$rowWidgetVModels.splice(i, 1);
              }
            });
          },

          resizeScroll: function () {
            if ($(".ms-table .table-body").getNiceScroll().length) {
              $(".ms-table .table-body").getNiceScroll().resize();
            }
          },

          reloadScroll: function () {
            if (!$(".ms-table .table-body").getNiceScroll().length) {
              $(".ms-table .table-body").niceScroll({ cursorcolor: "#b9b9b9" });
            }
          },

          onViewChange: function () {
            this.reloadScroll();
            this.resizeScroll();

            // 扫描权限
            $.auth.scanPage();
          },

          // // 绑定事件
          // bindDocumentEvent: function() {
          //   var _this = this;

          //   $(document).on("click.confirm-edit", function (e) {
          //     console.log("click.confirm-edit");
          //     // 如果点击的不是table里的tbody
          //     if (!$("#" + _this.tbodyId).has(e.target).length) {
          //       avalon.each(_this.tableDefine.rowData, function (index, row) {
          //         // 取消选择
          //         //row._isSelected = false;

          //         // 点击修改时退出编辑状态
          //         if (_this.tableDefine.clickEdit &&
          //           row._isEditing) {
          //           _this.confirmEditing(row);
          //         }
          //       });
          //     }
          //   });
          // },

          // // 解绑事件
          // unbindDocumentEvent: function() {
          //   $(document).off(".confirm-edit");
          // },

          // 列渲染模板
          columnRenderTpl: "",

          // 渲染每行列内容
          renderColumn: function (column, row) {
            return this.columnRenderTpl({
              column: column,
              row: row,
              // 计算序号的模板方法
              pageCalculate: "{{(@page - 1) * @tableDefine.pageSize + @index + 1}}"
            });
          },

          onInit: function () {
            var _this = this;

            this.tbodyId = $.getRandStr("an", 6);

            // 初始化列渲染模板
            this.columnRenderTpl = template.compile($("#column-render-tpl").html());

            _this.tableDefine.table = this;

            // 绑定点击页面其他地方退出编辑模式的事件
            if (_this.tableDefine.clickEdit) {
              $(document).on("click.confirm-edit", function (e) {
                // 表格中如果使用了ms-sip-select控件，点击弹出窗口时表格会退出编辑状态
                // 加入这个防止点击弹出窗口界面上的内容时退出编辑状态
                if ($(".layui-layer:not(.layui-layer-msg)").length) {
                  return;
                }

                // 如果点击的不是table里的tbody
                if (!$("#" + _this.tbodyId).has(e.target).length) {
                  avalon.each(_this.tableDefine.rowData, function (index, row) {
                    // 取消选择
                    //row._isSelected = false;

                    // 点击修改时退出编辑状态
                    if (_this.tableDefine.clickEdit &&
                      row._isEditing &&
                      // 临时解决方案。详见onReady的__isNew处的说明
                      !row.__isNew) {
                      _this.confirmEditing(row);
                    }
                    else {
                      // 临时解决方案。详见onReady的__isNew处的说明
                      delete row.__isNew;
                    }
                  });
                }
              });
            }
          },

          // 数据加载中
          isLoading: false,

          // 搜索条件
          searchCondition: {},
          // 数组形式的搜索条件
          rawSearchCondition: [],

          // 所有行被选中
          allRowSelected: false,

          // 处理控件初始数据
          processControlData: function (data, row) {
            return Function("row", data)(row);
          },

          // 获取按钮的icon class
          getButtonIconClass: function (row, button) {
            if (button.iconClassType == "1") {
              return Function("row", button.iconClass)(row);
            }
            else {
              return button.iconClass;
            }
          },

          // 新建行的index
          _newRowIndex: 1,

          // 获取每行数据中固定的数据
          // 如果不是创建新行，则必须传入当前数据的index
          getRowStaticData: function (isNewRow, index) {
            var data = {
              _isEditing: false,
              _isSelected: false,
              _isNew: false,
              _isModified: false,
              _isRemove: false,
              _modifiedColumns: []
            };

            // _index用来唯一标识一行数据
            // 在表格内直接创建新行与普通模式的_index产生方式不一样
            // 这里生成的_index的唯一性基于二个约定
            // 1. 如果表格允许创建新行，那它就没有分页
            // 2. 如果表格有分页，那它就不允许创建新行
            // 如果表格即有分页，又能创建新行，这种情况下生成的_index唯一性不能保证，会导致某些功能出错
            if (isNewRow) {
              data._index = "_" + this._newRowIndex++;
            }
            else {
              data._index = (this.page - 1) * this.tableDefine.pageSize + index;
            }

            return data;
          },

          startLoadTime: "",

          onReady: function (vm) {
            var _this = this;

            // 加载样式
            if (this.tableDefine.style) {
              var style = $('<style type="text/css"></style>');
              style.html(this.tableDefine.style);
              $('body').append(style);
            }

            // reload方法映射
            this.tableDefine.reload = vm.vmodel.reload;
            this.tableDefine.clearPaginationCache = vm.vmodel.clearPaginationCache;

            // 添加新的空白行
            this.tableDefine.addEmptyRow = function (initData) {
              // if(!$.isUndefined(event)) {
              //   event.stopPropagation();
              // }

              // 输入校验出现错误
              if (!_this.cancelEditing()) {
                return;
              }

              var emptyRow = {};

              $.each(_this.tableDefine.columns, function (index, column) {
                if (column.type == "field") {
                  emptyRow[column.field] = initData && initData[column.field] ? initData[column.field] : "";
                }
                else if (column.type == "checkbox2") {
                  emptyRow[column.field] = initData && initData[column.field] ? initData[column.field] : false;
                }
              });

              // 初始化数据
              var sdata = _this.getRowStaticData(true);
              sdata._isEditing = true;
              sdata._isNew = true;
              sdata._isSelected = true;

              // 因为firefox浏览器无法使用event.stopPropagation，这个点击事件会冒泡到document上的退出编辑模式的事件，临时使用这个解决方案
              sdata.__isNew = true;

              $.extend(emptyRow, sdata);

              $.each(_this.tableDefine.rowData, function (i, row) {
                row._isSelected = false;
              });

              _this.modifiedRows.new.push(emptyRow);
              _this.tableDefine.rowData.push(emptyRow);
              
              // 添加完数据后滚动到最后
              // todo 这里要延迟一点时间才能正常滚动，暂时这样处理
              window.setTimeout(function() {
                $(".ms-table .table-body").getNiceScroll(0).doScrollTop(Number.MAX_VALUE, 0);
              }, 100);
            }

            // 移除数据
            this.tableDefine.removeRows = function (rows) {
              var removeRow = function (row) {
                for (var i = 0; i < _this.tableDefine.rowData.length; i++) {
                  if (_this.tableDefine.rowData[i]._index == row._index) {
                    // 如果当前删除的行正在编辑状态，则关闭所有tip
                    if (_this.tableDefine.rowData[i]._isEditing) {
                      $.each(_this.$rowWidgetVModels, function (i, vm) {
                        if (!$.isUndefined(vm.closeTip)) {
                          vm.closeTip();
                        }
                      });

                      _this.$rowWidgetVModels = [];
                    }

                    _this.tableDefine.rowData[i]._isRemove = true;
                  }
                }
              };

              if ($.isArray(rows)) {
                $.each(rows, function (index, row) {
                  removeRow(row);
                });
              }
              else {
                removeRow(rows);
              }
            }

            // 获取修改的数据
            this.tableDefine.getModifiedRows = function () {
              // 输入校验出现错误
              if (!_this.cancelEditing()) {
                // 返回一个空数组
                return {
                  new: [],
                  modified: [],
                  remove: [],
                  validateFail: true
                };
              }

              _this.modifiedRows.new.clear();
              _this.modifiedRows.modified.clear();
              _this.modifiedRows.remove.clear();

              $.each(_this.tableDefine.rowData, function (index, rd) {
                // 初始化行数据修改状态
                rd._isModified = false;
                rd._modifiedColumns.clear();

                // 跳过新建后删除了的数据
                if (rd._isNew && rd._isRemove) {
                  return;
                }
                // 获取新增数据
                else if (rd._isNew) {
                  _this.modifiedRows.new.push(rd);
                }
                // 获取删除数据
                else if (rd._isRemove) {
                  _this.modifiedRows.remove.push(rd);
                }
                // 获取修改数据
                else {
                  // 遍历原始行数据，获取修改的列名
                  for (var key in _this.tableDefine.$initialRowData[index]) {
                    // 不比较首个字符是 _ 的数据（跳过表格内部使用的字段名，例如_New等）
                    if (key.indexOf("_") == 0) {
                      continue;
                    }

                    if (rd[key] != _this.tableDefine.$initialRowData[index][key]) {
                      rd._isModified = true;
                      rd._modifiedColumns.push(key);
                    }
                  }

                  // 如果列已被修改
                  if (rd._isModified) {
                    _this.modifiedRows.modified.push(rd);
                  }
                }
                // else if (rd._isModified) {
                //   if (rd._modifiedColumns.length) {
                //     _this.modifiedRows.modified.push(rd);
                //   }
                // }
              });

              return _this.modifiedRows.$model;
            };

            // 获取所有数据（进行校验）
            this.tableDefine.getRows = function () {
              // 输入校验出现错误
              if (!_this.cancelEditing()) {
                return [];
              }

              return $.grep(_this.tableDefine.rowData.$model, function (rd) { return !rd._isRemove; });
            };

            // 获取所有数据（不校验）
            this.tableDefine.getRows2 = function() {
              return $.grep(_this.tableDefine.rowData.$model, function (rd) { return !rd._isRemove; });
            },

            // 设置搜索条件
            this.tableDefine.setSearchCondition = function (searchCondition) {
              // 非数组形式的搜索条件。{cid401: 1, sid401: 1, eid401: 5}
              if (!$.isArray(searchCondition)) {
                _this.searchCondition = searchCondition;
              }
              // 数组形式的搜索条件。[{name:"分机", type:"partial/condition/start/end", id:"456", value:"2"}]
              else {
                _this.rawSearchCondition.clear();
                _this.rawSearchCondition.pushArray(searchCondition);

                _this.searchCondition = {};

                $.each(searchCondition, function (i, sd) {
                  var stype = "";

                  switch (sd.type) {
                    case "partial": // 模糊
                      stype = "p";
                      break;
                    case "start": // 开始
                      stype = "s";
                      break;
                    case "end": // 结束
                      stype = "e";
                      break;
                    case "condition": // 精确搜索
                    default:
                      stype = "c";
                      break;
                  }

                  if ($.isArray(sd.id)) {
                    $.each(sd.id, function (i, id) {
                      _this.searchCondition[stype + "id" + id] = sd.value[i];
                    });
                  }
                  else {
                    _this.searchCondition[stype + "id" + sd.id] = sd.value;
                  }
                });
              }
            };

            // 获取表格实例
            this.tableDefine.getTable = function () {
              return _this;
            }

            // 加载数据
            if (this.tableDefine.autoLoadData) {
              this.reload();
              this.startLoadTime = moment();
            }

            if (this.tableDefine.onReadyCallback) {
              this.tableDefine.onReadyCallback();
            }

            this.tableDefine.isTableReady = true;

            // 重新加载多语言
            $.lang.reload();

            // 扫描权限
            $.auth.scanPage();
          },

          // 获取动态控件类型
          getControlType: function (row, column, rowColumnData) {
            return new Function("row", "value", column.controlTypeFunction)(row, rowColumnData);
          },

          // 获取行中某列的数据
          getColumnData: function (row, column) {
            if (column.showRawData) {
              return row[column.field];
            }

            if (column.formatter) {
              return column.formatter(row[column.field], row);
            }
            else {
              // 下拉选择的显示内容和实际值要做处理
              if (column.controlType == "ms-select") {
                var options = this.processControlData(column.controlDefine.data);
                var opt = $.grep(options, function (option) { return option.value == row[column.field] });

                return opt.length ? opt[0].text : "";
              }
              else {
                return row[column.field] ? row[column.field] : "";
              }
            }
          },

          // 获取列标题
          getColumnTitle: function (row, column) {
            // 可能存在一些html标签，使用这个方法去掉这些标签
            return $("<div>" + this.getColumnData(row, column) + "</div>").text();
          },

          // 获取最后一条数据的ext_idx（分页数据加载使用）
          getLastExtIdx: function () {
            if (!this.tableDefine.rowData.length) {
              return 0;
            }

            return this.tableDefine.rowData[this.tableDefine.rowData.length - 1].ext_idx;
          },

          // 当前获取到的最大页码
          currentMaxPage: 1,
          // 是否获取到了最后一页（如果为true，currentMaxPage中存储的就是总页数）
          maxPageGetted: false,

          // 当前页
          page: 1,
          // 当前正在加载的页
          currentLoadPage: "",
          // 起始idx
          startIdx: 1,
          // 当前idx
          currentIdx: 1,
          // 已加载的数据数量
          currentLoadedDataCount: 0,
          // 临时存储加载的数据
          $tempRowData: [],
          // 是否可点击下一页
          hasNextPage: true,
          // 是否可点击上一页
          hasPrevPage: false,

          nextPageStartTime: "",
          //nextPageLoadEndTime: "",

          // 上一页
          prevPage: function () {
            if (this.isLoading || !this.hasPrevPage) {
              return;
            }

            if (this.page > 1) {
              this.currentLoadPage = this.page - 1;

              this.startIdx = this.getPageStartIdx(this.currentLoadPage); //(--this.page - 1) * this.tableDefine.pageSize + 1;
              this.currentIdx = this.startIdx;
              this.currentLoadedDataCount = 0;
              this.$tempRowData = [];

              this.isLoading = true;

              this.tableDefine.loadRowData(
                this,
                this.startIdx,
                this.currentLoadPage,
                this.tableDefine.pageSize,
                this.searchCondition);
            }
          },

          $pageSNStartList: {},

          // 获取指定页码的起始startIdx
          getPageStartIdx: function (page) {
            // 如果当前没有数据，说明还没有加载数据，默认从1开始
            if (page == 1) {
              return 1;
            }

            var startIdx;

            // 如果pageSNField不为空，则表示使用自定义的页码起始记录号生成规则
            // 否则表示使用默认的页码记录号生成规则（通过当前页和页码进行计算）
            if ($.isUndefined(this.tableDefine.pageSNField) ||
              this.tableDefine.pageSNField == "") {
              startIdx = (page - 1) * this.tableDefine.pageSize + 1;
            }
            // 使用自定义的页码起始记录号生成规则（应对列表的记录号不连续的问题）
            else {
              // $pageSNStartList里面存储的是已加载页面的每页的起始记录号
              // 如果没有从页码起始记录号数组中获取到页面的起始记录号，
              // 则需要从当前rowData中的最后一条数据中获取到记录号，再加1
              if ($.isUndefined(this.$pageSNStartList[page])) {
                // 获取当前最后一条记录的记录号
                var lastIdx = this.tableDefine
                  .rowData[this.tableDefine.rowData.length - 1]
                [this.tableDefine.pageSNField];

                startIdx = parseInt(lastIdx) + 1;
              }
              else {
                startIdx = this.$pageSNStartList[page];
              }
            }

            // 存储起始记录号
            this.$pageSNStartList[page] = startIdx;

            return startIdx;
          },

          // 下一页
          nextPage: function () {
            if (this.isLoading || !this.hasNextPage) {
              return;
            }

            this.currentLoadPage = this.page + 1;

            this.startIdx = this.getPageStartIdx(this.currentLoadPage); //(++this.page - 1) * this.tableDefine.pageSize + 1;
            this.currentIdx = this.startIdx;
            this.currentLoadedDataCount = 0;
            this.$tempRowData = [];

            this.isLoading = true;

            this.tableDefine.loadRowData(
              this,
              this.startIdx,
              this.currentLoadPage,
              this.tableDefine.pageSize,
              this.searchCondition);

            this.nextPageStartTime = moment();
          },

          // 跳转到指定页
          goPage: function (page) {
            if (this.isLoading) {
              return;
            }

            this.currentLoadPage = page;

            this.startIdx = this.getPageStartIdx(page); //(this.page - 1) * this.tableDefine.pageSize + 1;
            this.currentIdx = this.startIdx;
            this.currentLoadedDataCount = 0;

            this.isLoading = true;

            this.tableDefine.loadRowData(
              this,
              this.startIdx,
              this.currentLoadPage,
              this.tableDefine.pageSize,
              this.searchCondition);
          },

          // 重新加载数据
          // 如果指定了页码，则从指定的页面
          reload: function (page) {
            var p = page ? page : this.page;
            this.currentLoadPage = p;

            this.startIdx = this.getPageStartIdx(p); // (p - 1) * this.tableDefine.pageSize + 1;
            this.currentIdx = this.startIdx;
            this.currentLoadedDataCount = 0;
            this.$tempRowData = [];

            this.modifiedRows.new.clear();
            this.modifiedRows.modified.clear();
            this.modifiedRows.remove.clear();

            this.isLoading = true;

            // 清空保存的编辑VM
            this.$rowWidgetVModels = [];

            // 加载行数据
            this.tableDefine.loadRowData(
              this,
              this.startIdx,
              p,
              this.tableDefine.pageSize,
              this.searchCondition);
            // 加载行总数
            // OM中如果带检索条件，则不能获取到总行数，所以统一不调用这个
            // this.tableDefine.loadRowTotal(this, this.searchCondition);
          },

          // 清空所有数据
          clearRowData: false,

          // 清空并初始化分页数据缓存
          clearPaginationCache: function () {
            this.clearRowData = true;

            this.maxPageGetted = false;
            this.currentMaxPage = 1;

            // 清空自定义页码记录号
            if (!$.isUndefined(this.tableDefine.pageSNField) &&
              this.tableDefine.pageSNField != "") {
              this.$pageSNStartList = {};
            }
          },

          pageSizeChangeStartTime: "",

          // 修改分页大小时
          pageSizeChange: function (event) {
            this.tableDefine.pageSize = parseInt(event.target.value);

            this.clearPaginationCache();

            this.reload(1);

            this.pageSizeChangeStartTime = moment();
          },

          // 设置表格数据
          setData: function (data) {
            var _this = this;

            // 获取checkbox2类型的列的列名
            var checkboxColumns = [];
            $.each(_this.tableDefine.columns, function (index, column) {
              if (column.type == "checkbox2") {
                checkboxColumns.push(column.field);
              }
            });

            avalon.each(data, function (index, d) {
              // 将表格要用到的固定数据加入到获取到的数据中
              var sdata = _this.getRowStaticData(false, index);
              $.extend(d, sdata);

              // 初始化checkbox2类型的列的数据为false
              $.each(checkboxColumns, function (i, checkboxColumn) {
                // 如果没有定义checkbox的值，则给一个初始值
                if (!d[checkboxColumn]) {
                  d[checkboxColumn] = false;
                }
              });
            });

            // 先将获取到的数据存储到临时数据
            $.merge(this.$tempRowData, data);
            //$.console.log("this.$tempRowData", this.$tempRowData);

            // 当前已经加载的数据总数
            this.currentLoadedDataCount += data.length;

            // 如果是自定义的页码生成规则，获取当前页码的记录号
            if (!$.isUndefined(this.tableDefine.pageSNField) &&
              this.tableDefine.pageSNField != "" &&
              data.length != 0) {
              // 获取最后一条数据的记录号，然后加1
              this.currentIdx = parseInt(data[data.length - 1][this.tableDefine.pageSNField]) + 1;
            }
            else {
              // 默认的页码
              this.currentIdx += data.length;
            }

            // 如果数据量为0时，则表示接口已经没有数据返回，此时已经获取到了最大的页码
            if (data.length == 0) {
              this.maxPageGetted = true;
            }
            // else {
            //   this.maxPageGetted = false;
            // }

            // 判断当前页的数据加载完成的条件：不需要分页（说明只在一页显示数据）、当前没有加载出数据、已经加载完本页需要的数据
            if (this.tableDefine.disablePagination || data.length == 0 ||
              this.currentLoadedDataCount >= this.tableDefine.pageSize) {
              // 设置加载状态
              this.isLoading = false;

              // 如果加载了超过一条数据
              if (this.currentLoadedDataCount > 0) {
                // 设置全选checkbox状态
                this.allRowSelected = false;

                // 清空行数据
                this.tableDefine.rowData.clear();
                this.tableDefine.$initialRowData = [];

                // 推入初始值
                $.each(this.$tempRowData, function(i, rd) {
                  rd._initialData = {};
                  $.extend(rd._initialData, _this.$tempRowData[i]);
                });
                // 设置行数据
                this.tableDefine.rowData.pushArray(this.$tempRowData);
                // 设置初始数据
                $.merge(this.tableDefine.$initialRowData, this.$tempRowData);

                // 如果是自定义的页码记录号规则，则获取当前页的起始页码，更新或存到页码起始记录数组$pageSNStartList中
                if (!$.isUndefined(this.tableDefine.pageSNField) &&
                  this.tableDefine.pageSNField != "") {
                  this.$pageSNStartList[this.currentLoadPage] = this.$tempRowData[0][this.tableDefine.pageSNField];
                }

                // 设置当前页码
                this.page = this.currentLoadPage;

                // 设置最大页码
                this.currentMaxPage = Math.max(this.currentMaxPage, this.page);
              }
              // 没有获取到数据
              else {
                // 如果当前加载页是第一页，则清空所有数据
                // 否则说明是点击第二页等动作，不清空当前数据
                if(this.currentLoadPage == 1) {
                  this.tableDefine.rowData.clear();
                  this.tableDefine.$initialRowData = [];

                  this.page = 1;
                  // 设置全选checkbox状态
                  this.allRowSelected = false;
                }
                
                if (this.tableDefine.rowData.length) {
                  $.msg($.lang.get("noMoreData"));
                }
              }

              // 清空临时变量
              this.$tempRowData = [];
              this.currentLoadedDataCount = 0;

              // this.reloadScroll();

              // 渲染可能出现的多语言
              $.lang.render($(".ms-table"));

              // 判断是否有上一页
              this.hasPrevPage = this.page > 1 ? true : false;
              // 判断是否有下一页
              // 如果没有获取到最大页码，或者当前页码小于最大页码时
              this.hasNextPage = !this.maxPageGetted ? true :
                (this.page < this.currentMaxPage ? true : false);

              // 扫描权限
              $.auth.scanPage();

              if (this.startLoadTime) {
                $.console.log("页面初始加载分页用时:" + (moment() - this.startLoadTime) + "ms");
                this.startLoadTime = "";
              }
              if (this.nextPageStartTime) {
                $.console.log("下一页用时:" + (moment() - this.nextPageStartTime) + "ms");
                this.nextPageStartTime = "";
              }

              if (this.pageSizeChangeStartTime) {
                $.console.log("分页切换用时:" + (moment() - this.pageSizeChangeStartTime) + "ms");
                this.pageSizeChangeStartTime = "";
              }
            }
            else {
              this.tableDefine.loadRowData(
                this,
                this.currentIdx,
                this.currentLoadPage,
                // 获得本页需要的数据的余量
                this.tableDefine.pageSize - this.currentLoadedDataCount,
                this.searchCondition);
            }
          },

          // 设置表格总数
          setTotal: function (total) {
            this.tableDefine.rowTotal = total;
          },

          // 计算 ... 前面的分页
          getFirstPagination: function () {
            var lastPage = this.currentMaxPage > 3 ? 3 : this.currentMaxPage;

            var pd = [];
            for (var i = 1; i <= lastPage; i++) {
              pd.push(i);
            }

            return pd;
          },

          // 计算 ... 后面的分页
          getLastPagination: function () {
            var pd = [];

            if (this.currentMaxPage > 3) {
              var startPage;
              var lastPage;

              if (this.page > 3) {
                if (this.page == this.currentMaxPage) {
                  startPage = this.page - 2 > 3 ? this.page - 2 :
                    (this.page - 1 > 3 ? this.page - 1 : this.page);
                }
                else {
                  startPage = this.page - 1 > 3 ? this.page - 1 : this.page;
                }

                lastPage = startPage + 2 <= this.currentMaxPage ? startPage + 2 :
                  (startPage + 1 <= this.currentMaxPage ? startPage + 1 : this.currentMaxPage);
              }
              else {
                lastPage = this.currentMaxPage;
                startPage = lastPage - 2 > 3 ? lastPage - 2 :
                  (lastPage - 1 > 3 ? lastPage - 1 : lastPage);
              }

              for (var i = startPage; i <= lastPage; i++) {
                pd.push(i);
              }
            }

            //$.console.log("getLastPagination", pd);

            return pd;
          },

          // 获取页码
          getPagination: function () {
            var pd = [];
            for (var i = 1; i <= this.currentMaxPage; i++) {
              pd.push(i);
            }

            return pd;
          },

          // 表格定义
          tableDefine: {},

          // 触发编辑事件的按钮所在列
          editingColumnIndex: 0,

          // 行数据开始编辑模式
          startEditing: function (rowData, columnIndex) {
            // 输入校验出现错误
            if (!this.cancelEditing()) {
              return;
            }

            // 当前行进入编辑模式
            this.editingColumnIndex = columnIndex;
            rowData._isEditing = true;
          },

          // 移除行
          removeRow: function (row) {
            this.tableDefine.removeRows(row);
          },

          // 复制行
          copyRow: function (row) {
            // 输入校验出现错误
            if (!this.cancelEditing()) {
              return;
            }

            var newRow = {};
            $.extend(newRow, row.$model);

            var sdata = this.getRowStaticData(true);
            sdata._isEditing = true;
            sdata._isNew = true;
            $.extend(newRow, sdata);

            this.tableDefine.rowData.push(newRow);
          },

          // 被修改后的数据
          modifiedRows: {
            // 新增数据
            new: [],
            // 修改数据
            modified: [],
            // 移除数据
            remove: []
          },

          // 退出编辑模式
          cancelEditing: function () {
            var _this = this;

            // 是否确认编辑成功
            var editConfirmed = true;

            $.each(this.tableDefine.rowData, function (index, row) {
              if (row._isEditing) {
                editConfirmed = _this.confirmEditing(row);
              }
            });

            // 只有确认编辑成功后，才能清空VM数据
            if (editConfirmed) {
              _this.$rowWidgetVModels = [];
            }

            return editConfirmed;
          },

          // 校验数据
          validateData: function (row) {
            var _this = this;

            if (!_this.$rowWidgetVModels.length) {
              return true;
            }

            var result = true;

            $.each(_this.$rowWidgetVModels, function (i, vm) {
              var currentValue = vm.getValue();

              // 获取数据对应的column
              var column = $.grep(_this.tableDefine.columns, function (column) {
                return column.field == vm.name;
              });

              switch (column[0].validateType) {
                // 必填
                case "required": {
                  if ($.isUndefined(currentValue) || currentValue == "") {
                    vm.showTip("请输入必填项", { tips: [1, "#fd6409"] });
                    result = false;
                  }

                  break;
                }
                // 自定义
                case "custom": {
                  if (column[0].validateRule) {
                    var vfunc = Function("value", "row", "table", column[0].validateRule);

                    if (!vfunc(vm.getValue(), row, _this.tableDefine)) {
                      vm.showTip(column[0].validateMsg ? Function(column[0].validateMsg)() : "数据输入错误", { tips: [1, "#fd6409"] });
                      result = false;
                    }
                  }
                  else {
                    result = false;
                  }

                  break;
                }
              }
            });

            return result;
          },

          // 确认修改
          confirmEditing: function (row) {
            var _this = this;

            // 校验数据
            if (!this.validateData(row)) {
              return false;
            }

            $.each(_this.$rowWidgetVModels, function (index, vm) {
              var currentValue = vm.getValue();

              // 不是新建模式时，获取修改列
              if (!row._isNew) {
                // 获取初始行数据
                var initialRowData = $.grep(_this.tableDefine.$initialRowData, function (rowData) {
                  return rowData._index == row._index;
                })[0];

                // // 与初始数据做比较，如果有修改，就将列名加入到_modifiedColumns中
                // if (initialRowData[vm.name] != currentValue) {
                //   if (row._modifiedColumns.indexOf(vm.name) == -1) {
                //     row._modifiedColumns.push(vm.name);
                //   }
                // }
                // else {
                //   if (row._modifiedColumns.indexOf(vm.name) != -1) {
                //     row._modifiedColumns.splice(row._modifiedColumns.indexOf(vm.name), 1);
                //   }
                // }
              }

              // 更新表格数据
              row[vm.name] = currentValue;
            });

            // if (row._modifiedColumns.length) {
            //   row._isModified = true;
            // }
            // else {
            //   row._isModified = false;
            // }

            row._isEditing = false;

            this.$rowWidgetVModels = [];

            return true;
          },

          // 获取分页信息
          getPageInfo: function () {
            var pageInfo = "共" + this.tableDefine.rowTotal + "条数据";

            if (!this.tableDefine.disablePagination) {
              pageInfo += " 第" + this.page + "/" +
                Math.ceil(this.tableDefine.rowTotal / this.tableDefine.pageSize) + "页"
            }

            return pageInfo;
          },

          // 计算列宽度
          calculateColumnWidth: function (column) {
            var cw = "";

            if (!$.isUndefined(column.width) && 
              column.width != "") {
              cw = column.width;
            }
            else if (column.type == "sn" ||
              column.type == "checkbox") {
              cw = "80px";
            }

            return cw;
          },

          // 点击列时触发的事件
          clickRow: function (currentRow, event) {
            event.stopPropagation();

            var _this = this;

            // event.target.type == "checkbox"
            // 以下控件不响应点击事件
            if (event.target.type == "select-one" ||
              event.target.type == "input" ||
              $(event.target).data("control-type") == "checkbox") {
              return;
            }

            // 是否确认编辑成功
            var editConfirmed = true;

            avalon.each(this.tableDefine.rowData, function (index, row) {
              // 是否开启点击修改模式
              if (_this.tableDefine.clickEdit) {
                if (currentRow._index != row._index &&
                  row._isEditing) {
                  editConfirmed = _this.confirmEditing(row);
                }
              }

              if (editConfirmed) {
                row._isSelected = false;
              }
            });

            // 确认编辑返回false
            if (!editConfirmed) {
              return;
            }

            currentRow._isSelected = true;
            if (_this.tableDefine.clickEdit) {
              currentRow._isEditing = true;
            }

            if (_this.tableDefine.clickRowScript) {
              _this.tableDefine.clickRowScript(_this, currentRow.$model);
            }
          },

          // 切换全选
          toggleAllSelect: function (event) {
            var _this = this;

            avalon.each(this.tableDefine.rowData, function (index, row) {
              row._isSelected = _this.allRowSelected;
            });
          },

          // 行切换选中状态时
          rowSelectChange: function () {
            this.allRowSelected = $.grep(this.tableDefine.rowData, function (row) { return !row._isSelected }).length == 0 ?
              true : false;
          },

          // 切换数据显示
          toggleDataShow: function (column) {
            if (column.canToggleShowRawData == true ||
              column.canToggleShowRawData === "true") {
              column.showRawData = !column.showRawData;
            }
          },

          // 点击checkbox2控件时，需要记录修改项
          checkbox2Change: function (row, column) {
            var _this = this;

            // 不是新建模式时，获取修改列
            if (!row._isNew) {
              // // 获取初始行数据
              // var initialRowData = $.grep(_this.tableDefine.$initialRowData, function (rowData) {
              //   return rowData._index == row._index;
              // })[0];

              // // 与初始数据做比较，如果有修改，就将列名加入到_modifiedColumns中
              // if (initialRowData[column.field] != row[column.field]) {
              //   if (row._modifiedColumns.indexOf(column.field) == -1) {
              //     row._modifiedColumns.push(column.field);
              //   }
              // }
              // else {
              //   if (row._modifiedColumns.indexOf(column.field) != -1) {
              //     row._modifiedColumns.splice(row._modifiedColumns.indexOf(column.field), 1);
              //   }
              // }

              // if (row._modifiedColumns.length) {
              //   row._isModified = true;
              // }
              // else {
              //   row._isModified = false;
              // }
            }

            // 值改变回调
            if (!$.isUndefined(column.valueChange) && column.valueChange != "") {
              new Function("row", "value", column.valueChange)(row, row[column.field]);
            }

            // 是单选模式时，取消其他行数据的选择
            if (column.singleSelect == true) {
              for (var i = 0; i < this.tableDefine.rowData.length; i++) {
                if (row != this.tableDefine.rowData[i]) {
                  this.tableDefine.rowData[i][column.field] = false;
                }

                // // 如果与初始值不相同，则设置为已修改
                // if(this.tableDefine.rowData[i][column.field] != 
                //   this.tableDefine.$initialRowData[i][column.field]) {
                //     this.tableDefine.rowData[i]._isModified = true;
                //     this.tableDefine.rowData[i]._modifiedColumns.push(column.field);
                // }
                // else {
                // }
              }
            }
          },

          // 点击保存按钮
          clickSaveButton: function () {
            var modifiedRows = this.tableDefine.getModifiedRows();

            if (modifiedRows.validateFail) {
              return;
            }

            if (!modifiedRows.new.length &&
              !modifiedRows.modified.length &&
              !modifiedRows.remove.length) {
              $.msg($.lang.get("noModifiedData"));
              return;
            }

            var _this = this;

            $.confirm($.lang.get("saveMsg2"), function () {
              _this.tableDefine.clickSaveButton(_this, modifiedRows);
            });
          },

          buttonClick: function (button, row, event, table) {
            event.preventDefault();
            event.stopPropagation();

            button.click(row, event, table);
          },

          // 动态判断是否可编辑
          isRowColumnEditable: function (row, column) {
            var result = false;

            if (column.isEditable == "true") {
              result = true;
            }
            else if (column.isEditable == "dynamic") {
              if (!$.isUndefined(column.editableFunction) &&
                column.editableFunction != "") {
                result = Function("row", "value", column.editableFunction)(row, row[column.field]);
              }
            }

            return result;
          },

          // 值改变时
          valueChange: function (newValue, columnName) {
            // select值改变时
            $.each(this.tableDefine.rowData, function (i, rd) {
              if (rd._isEditing == true) {
                rd[columnName] = newValue;
              }
            });
          },

          preventColumnClick: function (event, column) {
            // 防止点击checkbox列时，不小心点到checkbox外，使已选择的行取消选择的问题
            if (column.type == "checkbox") {
              event.stopPropagation();
            }
          }
        }
      });
    });
  });
})();