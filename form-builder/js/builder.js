/**
 * 构建表单
 * author hq
 */

// 文本输入控件
avalon.component("ms-input-control", {
    template: $("#ms-input-tpl").html(),
    defaults: {
        controlDefine: {
            controlType: "ms-input",
            id: "",
            name: "",
            value: "",
            validate: "",
            validateMsg: "",
            validateFunction: "",
            reqParam: {
                method: "",
                line_id: "",
                id: "",
            }
        },

        parentItemId: "",

        getControlDefine: function () {
            return this.controlDefine;
        }
    }
});

// select控件
avalon.component("ms-select-control", {
    template: $("#ms-select-tpl").html(),
    defaults: {
        controlDefine: {
            controlType: "ms-select",
            id: "",
            name: "",
            // { text: "文本", value: "选项", selected: "false", isEditing: false }
            options: [],
            reqParam: {
                method: "",
                line_id: "",
                id: ""
            },
            defaultSelectOption: true
        },

        parentItemId: "",

        getControlDefine: function () {
            return this.controlDefine;
        },

        editOption: function (option) {
            option.isEditing = true;
        },

        removeOption: function (option) {
            if (confirm('确定移除数据?')) {
                this.controlDefine.options.remove(option);
            }
        },

        saveOption: function (option) {
            option.isEditing = false;
        },

        addOption: function () {
            this.controlDefine.options.push({ text: "", value: "", selected: "false", isEditing: true });
        }
    }
});

// radio控件
avalon.component("ms-radio-control", {
    template: $("#ms-radio-tpl").html(),
    defaults: {
        controlDefine: {
            controlType: "ms-radio",
            id: "",
            name: "",
            // { text: "文本", value: "选项", checked: "false", isEditing: false }
            options: [],
            reqParam: {
                method: "",
                line_id: "",
                id: "",
            }
        },

        parentItemId: "",

        getControlDefine: function () {
            return this.controlDefine;
        },

        editOption: function (option) {
            option.isEditing = true;
        },

        removeOption: function (option) {
            if (confirm('确定移除数据?')) {
                this.controlDefine.options.remove(option);
            }
        },

        saveOption: function (option) {
            option.isEditing = false;
        },

        addOption: function () {
            this.controlDefine.options.push({ text: "", value: "", selected: "false", isEditing: true });
        }
    }
});

// checkbox控件
avalon.component("ms-checkbox-control", {
    template: $("#ms-checkbox-tpl").html(),
    defaults: {
        controlDefine: {
            controlType: "ms-checkbox",
            id: "",
            name: "",
            // { text: "文本", value: "选项", checked: "false", isEditing: false }
            options: [],
            reqParam: {
                method: "",
                line_id: "",
                id: "",
            }
        },

        parentItemId: "",

        getControlDefine: function () {
            return this.controlDefine;
        },

        editOption: function (option) {
            option.isEditing = true;
        },

        removeOption: function (option) {
            if (confirm('确定移除数据?')) {
                this.controlDefine.options.remove(option);
            }
        },

        saveOption: function (option) {
            option.isEditing = false;
        },

        addOption: function () {
            this.controlDefine.options.push({ text: "", value: "", selected: "false", isEditing: true });
        }
    }
});

// 内容自定义控件
avalon.component("ms-custom-control", {
    template: $("#ms-custom-tpl").html(),
    defaults: {
        controlDefine: {
            controlType: "ms-custom",
            id: "",
            name: "",
            content: ""
        },

        parentItemId: "",

        getControlDefine: function () {
            return this.controlDefine;
        },

        editOption: function (option) {
            option.isEditing = true;
        },

        removeOption: function (option) {
            if (confirm('确定移除数据?')) {
                this.controlDefine.options.remove(option);
            }
        },

        saveOption: function (option) {
            option.isEditing = false;
        },

        addOption: function () {
            this.controlDefine.options.push({ text: "", value: "", selected: "false", isEditing: true });
        }
    }
});

avalon.ready(function () {
    // 初始化构建器
    var initBuilder = function (setting) {
        $.each(setting.templates, function(i, template) {
            if($.isUndefined(template.hideCancelButton)) {
                template.hideCancelButton = false;
            }

            $.each(template.items, function(j, item) {
                if($.isUndefined(item.isMustField)) {
                    item.isMustField = false;
                }
                
                $.each(item.controls, function(k, control) {
                    if($.isUndefined(control.validate)) {
                        control.validate = "";
                    }

                    if($.isUndefined(control.validateFunction)) {
                        control.validateFunction = "";
                    }

                    if($.isUndefined(control.validateMsg)) {
                        control.validateMsg = "";
                    }

                    // 默认应该包含默认的请选择选项
                    if($.isUndefined(control.defaultSelectOption)) {
                        control.defaultSelectOption = true;
                    }
                });
            });
        });

        var vm = avalon.define({
            $id: "app",

            // 系统中已有的表单
            templates: setting.templates,

            // 表单
            template: {
                templateId: $.getRandStr("an", 5),
                templateName: "",
                category: "",
                hideCancelButton: false,
                items: []
            },

            // 可用的控件
            controls: [
                { name: "ms-input-control", title: "文本输入控件（ms-input）" },
                { name: "ms-select-control", title: "下拉选择控件（ms-select）" },
                { name: "ms-radio-control", title: "单选控件（ms-radio）" },
                { name: "ms-checkbox-control", title: "多选控件（ms-checkbox）" },
                { name: "ms-custom-control", title: "内容自定义控件（ms-custom）" }
            ],

            // 当前表单
            currentTemplate: {},

            // 新建表单
            createTemplate: function () {
                if (confirm('是否新建表单?')) {
                    this.template = {
                        templateId: $.getRandStr("an", 5),
                        templateName: "",
                        category: "",
                        hideCancelButton: false,
                        items: []
                    };
                }
            },

            // 加载表单
            loadTemplate: function (template) {
                if (confirm('是否加载表单?')) {
                    this.template = template;

                    avalon.each(this.template.items, function (index, item) {
                        avalon.each(item.rawControls, function (index2, rawControl) {
                            avalon.vmodels[rawControl.id].controlDefine = item.controls[index2];
                        });

                        
                    });

                    scriptEditor.setValue(template.script);
                    styleEditor.setValue(template.style);
                    templateEditor.setValue(JSON.stringify(template));
                }
            },

            // 增加表单条目
            addTemplateItem: function () {
                this.template.items.push({
                    itemId: "item-" + Math.random().toString().substr(2),
                    itemTitle: "",
                    alertWinInfo: "",
                    endOfLineInfo: "",
                    isMore: false,
                    isMustField: false,
                    // 每个控件的详细内容
                    controls: [],
                    // "<wbr ms-widget=\"{is: 'ms-checkbox-control'}\" />"
                    rawControls: []
                });
            },

            // 移除表单条目
            removeTemplateItem: function (item) {
                if (confirm('是否移除表单条目?')) {
                    this.template.items.remove(item);
                }
            },

            // 增加控件
            addControl: function (item, controlName, controlTitle) {
                var parentItemId = item.itemId;
                var controlId = parentItemId + "-control-" +
                    (item.rawControls.length + 1);
                item.rawControls.push({
                    id: controlId,
                    name: controlName,
                    title: controlTitle,
                    content: "<wbr id=\"" + controlId + "\" ms-widget=\"{is: '" + controlName + "', id: '" + controlId + "', parentItemId: '" + parentItemId + "'}\" />"
                });
                avalon.scan(document.body);
            },

            // 移除控件
            removeControl: function (item, control) {
                if (confirm('是否移除控件?')) {
                    item.rawControls.remove(control);
                }
            },

            // 生成表单模板
            generateTemplate: function () {
                var script = null;
                if (scriptEditor) {
                    script = scriptEditor.getValue();
                }

                var style = null;
                if (styleEditor) {
                    style = styleEditor.getValue();
                }

                avalon.each(this.template.items, function (index, item) {
                    item.controls = [];

                    for (var vmname in avalon.vmodels) {
                        if (avalon.vmodels[vmname].parentItemId == item.itemId) {
                            item.controls.push(avalon.vmodels[vmname].getControlDefine());
                        }
                    }
                });

                var template = {
                    templateId: this.template.templateId,
                    templateName: this.template.templateName,
                    category: this.template.category,
                    items: this.template.items,
                    hideCancelButton: this.template.hideCancelButton,
                    script: script,
                    style: style
                };

                templateEditor.setValue(JSON.stringify(template));
            }
        });

        avalon.scan(document.body);
    };

    // 脚本编辑器
    var scriptEditor;
    // 样式编辑器
    var styleEditor;
    // 表单模板编辑器
    var templateEditor;

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
        scriptEditor = init("#template-script textarea", "javascript");
        $('li > a[href="#template-script"]').on("shown.bs.tab", function () {
            scriptEditor.refresh();
        });

        // 初始化编辑器
        styleEditor = init("#template-style textarea", "css");
        $('li > a[href="#template-style"]').on('shown.bs.tab', function () {
            styleEditor.refresh();
        });

        // 初始化编辑器
        templateEditor = init("#template textarea", "json");
        $('li > a[href="#template"]').on('shown.bs.tab', function () {
            templateEditor.refresh();
        });
    };

    $.getJSON('/modules/form/form.json', function (data) {
        initEditor();
        initBuilder({
            templates: data
        });
    });

    $(window).scroll(function (event) {
        var scrollTop = document.body.scrollTop == 0 ? document.documentElement.scrollTop : document.body.scrollTop;

        if (scrollTop > ($('.add-template-item').offset().top + $('.add-template-item').height())) {
            $('.bottom-btns').show();
        }
        else {
            $('.bottom-btns').hide();
        }
    });
});