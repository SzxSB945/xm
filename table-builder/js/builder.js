/**
 * 构建表格
 * author hq
 */

avalon.ready(function () {
    // 初始化构建器
    var initBuilder = function (setting) {
        var tableData = [];

        $.each(setting.tables, function(i, table) {
            var r = $.grep(tableData, function(n) { 
                return n.category == (!table.category ? "未分类" : table.category); 
            });

            var data;

            if(!r.length) {
                data = {
                    category: !table.category ? "未分类" : table.category,
                    tables: []
                }

                tableData.push(data);
            }
            else {
                data = r[0];
            }

            data.tables.push(table);
        });

        var vm = avalon.define({
            $id: "app",

            // 系统中已有的表格
            tables: setting.tables,
            tableData: tableData,

            // 表格定义
            table: {
                tableId: $.getRandStr("an", 5),
                tableName: "",
                pageSize: 10,
                category: "",
                disablePagination: "false",
                disablePageInfo: "false",
                clickEdit: "false",
                saveButton: "false",
                columns: [],
                pageSNField: "",
                autoLoadData: true
            },

            // 新建表格
            createTable: function () {
                if (confirm('是否新建表格?')) {
                    this.table = {
                        tableId: $.getRandStr("an", 5),
                        tableName: "",
                        pageSize: 10,
                        category: "",
                        disablePagination: "false",
                        disablePageInfo: "false",
                        clickEdit: "false",
                        saveButton: "false",
                        columns: [],
                        pageSNField: "",
                        autoLoadData: true
                    };
                    
                    dataLoadScriptEditor.setValue("");
                    totalLoadScriptEditor.setValue("");
                    clickRowScriptEditor.setValue("");
                    saveButtonScriptEditor.setValue("");
                    styleEditor.setValue("");
                    tableTplEditor.setValue("");
                }
            },

            // 加载表格
            loadTable: function (table) {
                if (confirm('是否加载表格?')) {
                    $.each(table.columns, function(i, column) {
                        // 老的表格定义没有controlDefine，controlDefine里的数据不能同步，需要手动添加上去
                        if(!column.controlDefine) {
                            column.controlDefine = {};
                        }
                    });

                    this.table = table;

                    tableTplEditor.setValue(JSON.stringify(table));
                    dataLoadScriptEditor.setValue(table.dataLoadScript);
                    totalLoadScriptEditor.setValue(table.totalLoadScript);
                    clickRowScriptEditor.setValue(table.clickRowScript)
                    saveButtonScriptEditor.setValue(table.saveButtonScript);
                    styleEditor.setValue(table.style);
                }
            },

            // 增加列定义
            addColumn: function () {
                this.table.columns.push({
                    type: "field",
                    title: "",
                    field: "",
                    width: "",
                    formatter: "",
                    isEditable: "false",
                    editableFunction: "",
                    controlTypeFunction: "",
                    canToggleShowRawData: "false",
                    valueChange: "",
                    controlType: "",
                    controlDefine: {
                        data: ""
                    },
                    buttons: [],
                    // 校验类型（必填、自定义）
                    validateType: "",
                    // 校验规则（自定义函数）
                    validateRule: "",
                    // 校验未通过提示信息（自定义函数）
                    validateMsg: "",
                    singleSelect: ""
                });
            },

            // 移除列定义
            removeColumn: function (column) {
                if (confirm('是否移除列定义?')) {
                    this.table.columns.remove(column);
                }
            },

            // 增加按钮
            addButton: function (column) {
                column.buttons.push({
                    type: "icon",
                    iconClass: "",
                    iconClassType: "",
                    text: "",
                    click: ""
                });
            },

            // 移除按钮
            removeButton: function (column, button) {
                if (confirm('是否移除按钮?')) {
                    column.buttons.remove(button);
                }
            },

            // 生成表格模板
            generateTable: function () {
                var dataLoadScript = null;
                if (dataLoadScriptEditor) {
                    dataLoadScript = dataLoadScriptEditor.getValue();
                }

                var totalLoadScript = null;
                if (totalLoadScriptEditor) {
                    totalLoadScript = totalLoadScriptEditor.getValue();
                }

                var saveButtonScript = null;
                if (saveButtonScriptEditor) {
                    saveButtonScript = saveButtonScriptEditor.getValue();
                }

                var clickRowScript = null;
                if (clickRowScriptEditor) {
                    clickRowScript = clickRowScriptEditor.getValue();
                }
                
                var style = null;
                if (styleEditor) {
                    style = styleEditor.getValue();
                }

                var table = {};
                avalon.mix(true, table, this.table);

                table.dataLoadScript = dataLoadScript;
                table.totalLoadScript = totalLoadScript;
                table.clickRowScript = clickRowScript;
                table.saveButtonScript = table.clickEdit == "true" ? saveButtonScript : "";
                table.style = style;

                tableTplEditor.setValue(JSON.stringify(table));
            }
        });

        vm.$watch("onReady", function() {
        });


        avalon.scan(document.body);
    };

    // 数据获取脚本编辑器
    var dataLoadScriptEditor;
    // 页码获取脚本编辑器
    var totalLoadScriptEditor;
    // 保存按钮脚本编辑器
    var saveButtonScriptEditor;
    // 行点击执行脚本
    var clickRowScriptEditor;
    // 样式编辑器
    var styleEditor;
    // 表格模板编辑器
    var tableTplEditor;

    // 初始化编辑器
    var initEditor = function () {
        var init = function (cls, mode) {
            if (mode == "javascript") {
                $(cls).html("// 删除本行在这里写js代码");
            }
            else if (mode == "css") {
                $(cls).html("@charset \"utf-8\";\n/*删除本行在这里写css样式*/");
            }

            return CodeMirror.fromTextArea($(cls)[0], {
                mode: mode,
                selectionPointer: true,
                lineNumbers: true,
                smartIndent: true,
                lineWrapping: true,
                matchBrackets: true
            });
        };

        // 初始化编辑器
        dataLoadScriptEditor = init("#table-script .data-load-script", "javascript");
        totalLoadScriptEditor = init("#table-script .total-load-script", "javascript");
        saveButtonScriptEditor = init("#table-script .save-button-script", "javascript");
        clickRowScriptEditor = init("#table-script .click-row-script", "javascript");
        $('li > a[href="#table-script"]').on("shown.bs.tab", function () {
            dataLoadScriptEditor.refresh();
            totalLoadScriptEditor.refresh();
            saveButtonScriptEditor.refresh();
            clickRowScriptEditor.refresh();
        });

        // 初始化编辑器
        styleEditor = init("#table-style textarea", "css");
        $('li > a[href="#table-style"]').on('shown.bs.tab', function () {
            styleEditor.refresh();
        });

        // 初始化编辑器
        tableTplEditor = init("#table-template textarea", "json");
        $('li > a[href="#table-template"]').on('shown.bs.tab', function () {
            tableTplEditor.refresh();
        });
    };

    $.getJSON('/modules/table/table.json', function (tables) {
        // 因为老版本的构建器生成的数据没有这些属性，要初始化这部分数据，否则avalon不能监听这些属性
        $.each(tables, function(i, table) {
            if($.isUndefined(table.clickEdit)) {
                table.clickEdit = "false";
            }
    
            if($.isUndefined(table.saveButton)) {
                table.saveButton = "false";
            }
    
            if($.isUndefined(table.saveButtonScript)) {
                table.saveButtonScript = "";
            }
    
            if($.isUndefined(table.disablePageInfo)) {
                table.disablePageInfo = "false";
            }
    
            if($.isUndefined(table.disablePagination)) {
                table.disablePagination = "false";
            }
    
            if($.isUndefined(table.clickRowScript)) {
                table.clickRowScript = "";
            }
    
            if($.isUndefined(table.pageSNField)) {
                table.pageSNField = "";
            }
    
            if($.isUndefined(table.autoLoadData)) {
                table.autoLoadData = true;
            }
            
            $.each(table.columns, function(j, column) {
                if(column.type == "field") {
                    if($.isUndefined(column.validateType)) {
                        column.validateType = "";
                    }
                    if($.isUndefined(column.validateRule)) {
                        column.validateRule = "";
                    }
                    if($.isUndefined(column.validateMsg)) {
                        column.validateMsg = "";
                    }
                    if($.isUndefined(column.editableFunction)) {
                        column.editableFunction = "";
                    }
                    if($.isUndefined(column.controlTypeFunction)) {
                        column.controlTypeFunction = "";
                    }
                }
                
                if($.isUndefined(column.valueChange)) {
                    column.valueChange = "";
                }
                // 单选
                if($.isUndefined(column.singleSelect)) {
                    column.singleSelect = "";
                }
            });
        });

        initEditor();
        initBuilder({
            tables: tables
        });
    });

    // $(window).scroll(function(event) {
    //     var scrollTop = document.body.scrollTop == 0 ? document.documentElement.scrollTop : document.body.scrollTop;

    //     if(scrollTop > ($('.add-column').offset().top + $('.add-column').height())) {
    //         $('.bottom-btns').show();
    //     }
    //     else {
    //         $('.bottom-btns').hide();
    //     }
    // });
});