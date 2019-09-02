/**
 * 表单渲染
 * author hq
 */

(function () {
    var tid = $.getUrlParam("tid");

    if (!tid) {
        $("body").html("tid未定义");
        return;
    }

    // 渲染表单定义
    var renderForm = function (formTemplate) {
        avalon.each(formTemplate.items, function (i, item) {
            avalon.each(item.controls, function (i, control) {
                // 构建校验规则
                var validateRule = {};

                if(item.isMustField) {
                    validateRule.required = true;
                }

                if(control.validateFunction) {
                    validateRule.validateFunction = control.validateFunction;
                    validateRule.validateMsg = control.validateMsg;
                }

                if(control.validate) {
                    var v = new Function("return {" + control.validate + "}")();
                    $.extend(validateRule, v);
                }

                if(!$.isEmptyObject(validateRule)) {
                    var validateRuleStr = JSON.stringify(validateRule);

                    control.validateRule = validateRuleStr.substr(1, validateRuleStr.length - 2);
                }

                if(control.options && control.options.length) {
                    $.each(control.options, function(i, option) {
                        option.checked = option.selected;
                    });
                }
            });
        });

        avalon.ready(function () {
            var vm = avalon.define({
                $id: "app",
                templateName: formTemplate.templateName,

                formTemplate: formTemplate,

                // 获取请求数据
                getReqParams: function () {
                    var reqParams = {};

                    avalon.each(formTemplate.items, function (i, item) {
                        avalon.each(item.controls, function (j, control) {
                            if (!avalon.vmodels[control.id]) {
                                return;
                            }

                            reqParams[avalon.vmodels[control.id].name] = {};

                            var reqParam = reqParams[avalon.vmodels[control.id].name];
                            reqParam.value = avalon.vmodels[control.id].getValue();

                            avalon.mix(reqParam, control.reqParam);
                            //reqParams.push(reqParam);
                        });
                    });

                    $.console.log(reqParams);

                    return reqParams;
                },

                // 提交数据
                submit: function () {
                    var reqParams = this.getReqParams();

                    // 如果有提交回调，就调用提交回调
                    if (form.onSubmit) {
                        if($.validator.validate()) {
                            form.onSubmit(reqParams);
                        }
                    }
                    // else {
                    //     var reqData = [];
                    //     avalon.each(reqParams, function (i, reqParam) {
                    //         var rd = $.grep(reqData, function (n) { return n.method == reqParam.method });

                    //         if (rd.length) {
                    //             var param = $.grep(rd[0].param, function (n) { return n.line_id == reqParam.line_id });

                    //             if (param.length) {
                    //                 param[0]["id" + reqParam.id] = reqParam.value;
                    //             }
                    //             else {
                    //                 var o = {
                    //                     line_id: reqParam.line_id
                    //                 };
                    //                 o["id" + reqParam.id] = reqParam.value;
                    //                 param.push(o);
                    //             }
                    //         }
                    //         else {
                    //             var o = {
                    //                 line_id: reqParam.line_id
                    //             };
                    //             o["id" + reqParam.id] = reqParam.value;

                    //             var rd = {
                    //                 method: reqParam.method,
                    //                 param: [o]
                    //             }

                    //             reqData.push(rd);
                    //         }
                    //     });

                    //     $.om.setDataParallel(reqData, function () {
                    //         $.alert("数据保存成功", "success");
                    //     }, function () {
                    //         $.alert("数据保存失败");
                    //     });
                    // }
                },

                // 取消
                cancel: function () {
                    //alert("取消");
                    history.back();
                },

                // 表单内的控件加载完后
                widgetReady: function (e) {
                    loadedControlIds.push(e.vmodel.$id);

                    $.each(controlLoadedObservers, function (i, observer) {
                        if (observer.controlId == e.vmodel.$id) {
                            observer.execute();
                        }
                    });
                },

                // 显示弹窗信息
                showInfo: function (item) {
                    $.open({
                        closeBtn: false,
                        area: "480px",
                        shadeClose: true,
                        // anim: 5,
                        // isOutAnim: false,
                        title: item.itemTitle,
                        content: item.alertWinInfo
                    });
                }
            });

            // 回调
            var form = {
                onSubmit: null,
                onLoaded: null,
                reset: function () {
                    $("form")[0].reset();
                }
            };

            vm.$watch('onReady', function () {
                // 加载脚本
                if (formTemplate.script) {
                    var func = Function("form", formTemplate.script);
                    // 在所有控件初始化后调用
                    window.setTimeout(function () {
                        func(form);

                        // 在表单加载后执行
                        if(form.onLoaded) {
                            form.onLoaded();
                        }

                        $.auth.scanPage();
                    }, 200);
                }

                // 加载样式
                if (formTemplate.style) {
                    var style = $('<style type="text/css"></style>');
                    style.html(formTemplate.style);
                    $('body').append(style);
                }

                // 设置页面标题
                document.title = formTemplate.templateName;

                // 多语言
                $.lang.render();
            });

            avalon.scan(document.body);
        });
    }

    var getFormTemplate = function (form, tid) {
        var formTemplate;

        for (var i = 0; i < form.length; i++) {
            if (form[i].templateId == tid) {
                formTemplate = form[i];
                break;
            }
        }

        return formTemplate;
    };

    // 加载表单模板
    var loadForm = function (callback) {
        $.getJSON("/modules/form/form.json", function (form) {
            // 保存表单模板
            $.localCache.set("form", JSON.stringify(form));

            callback(form);
        });
    };

    // 获取表单模板
    $.localCache.get("formVersion", function (version) {
        var _renderForm = function (form, tid) {
            var formTemplate = getFormTemplate(form, tid);

            if (!formTemplate) {
                $("body").html("没有找到表单模板");
                return;
            }

            renderForm(formTemplate);
        };

        // 如果表单版本号与配置文件中的不同（说明有更新）
        // 则需要加载表单内容
        if ($.isUndefined(version) ||
            version != WEB_VERSION_CODE) {
            loadForm(function (form) {
                // 保存版本号
                $.localCache.set("formVersion", WEB_VERSION_CODE);

                _renderForm(form, tid);
            });
        }
        else {
            $.localCache.get("form", function (value) {
                _renderForm(JSON.parse(value), tid);
            });
        }
    });

    // 已加载的控件ID列表
    var loadedControlIds = [];
    // 在控件加载后执行
    var controlLoadedObservers = [];

    // 增加表单的api函数
    $.extend({
        form: {
            // 获取值
            getValue: function (controlId) {
                return avalon.vmodels[controlId].getValue();
            },

            // 设置值
            setValue: function (controlId, value) {
                //$.plugins.setValue(controlId, value);

                // 如果控件是已加载
                if (loadedControlIds.indexOf(controlId) != -1) {
                    avalon.vmodels[controlId].value = value;
                }
                else {
                    // 设置值的时候，如果控件还没有加载完，就要等加载完后再设值
                    controlLoadedObservers.push({
                        controlId: controlId,
                        execute: function () {
                            avalon.vmodels[controlId].value = value;
                        }
                    });
                }
            }
        }
    });
})();