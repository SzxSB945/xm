/**
 * OM8000主页脚本
 * @author hq
 */
$(function () {
    $.getHomepageMenu(function (homepageMenu) {
        // 获取经过权限过滤的菜单
        var filteredMenu;

        // 是否禁用权限控制
        if (DISABLE_AUTH == true) {
            filteredMenu = homepageMenu;
        }
        else {
            filteredMenu = $.auth.filterMenu(homepageMenu);
        }

        var vm = avalon.define({
            $id: "app",

            // 标签页
            tabs: [],

            // 头部信息
            headInfo: "",
            headInfoClick: avalon.noop,

            // 菜单
            menus: filteredMenu,
            // 当前菜单
            mainMenu: {
                name: ""
            },
            // 当前的子菜单
            leftMenu: [],

            // 是否显示开始菜单
            isStartMenuShow: false,

            // 开始菜单隐藏timeout
            startMenuTimeout: "",

            // 显示开始菜单
            showStartMenu: function () {
                if (this.startMenuTimeout) {
                    window.clearTimeout(this.startMenuTimeout);
                    this.startMenuTimeout = "";
                }

                this.isStartMenuShow = true;
            },

            // 隐藏开始菜单
            hideStartMenu: function (delay) {
                var _this = this;

                if (delay) {
                    this.startMenuTimeout = window.setTimeout(function () {
                        _this.isStartMenuShow = false;
                    }, 500);
                }
                else {
                    _this.isStartMenuShow = false;
                }
            },

            // 获取所有标签页
            getTabs: function () {
                return $.grep(this.tabs, function (tab) {
                    return !tab.isRemoved;
                });
            },

            // 获取活动tab
            getActiveTab: function () {
                var tabs = this.getTabs();

                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].isActive == true) {
                        return tabs[i];
                    }
                }

                return null;
            },

            // 组建标签页的url
            buildUrl: function (menu) {
                var url = menu.url;

                if (url.indexOf("?") != -1) {
                    url += menu.code ? "&code=" + menu.code : "";
                }
                else {
                    url += "?code=" + menu.code;
                }

                return url;
            },

            // 打开标签页
            openTab: function (menu, reloadIfSameTab) {
                if (!menu.url) {
                    return;
                }

                var tabs = this.getTabs();

                // 如果标签的名称及url相同，则判定为同一标签页
                var sameTab = $.grep(tabs, function (tab) {
                    return tab.name == menu.name && tab.menu.url == menu.url;
                });

                this.optimizePerfWhenOpenOrSwitchTab(menu.id, "open");

                // 切换到已打开的标签页
                if (sameTab.length) {
                    // 如果是切换到已打开的标签页，则刷新
                    this.switchTab(sameTab[0],
                        $.isUndefined(reloadIfSameTab) || reloadIfSameTab == true);

                    return;
                }

                if (tabs.length >= MAX_TAB_COUNT) {
                    $.msg($.lang.get("maxTabExceedMsg"));
                    return;
                }

                avalon.each(tabs, function (i, tab) {
                    if (tab.isActive) {
                        tab.isActive = false;
                    }
                });

                var tab = {
                    id: menu.id,
                    name: menu.name,
                    url: this.buildUrl(menu),
                    menu: menu,
                    isActive: true,
                    isRemoved: false
                };

                this.tabs.push(tab);

                // 改变激活的左侧菜单
                $(".tabs").trigger("tabchange", tab.menu.id);
            },

            // 打开标签页
            _openTab: function (menu, event) {
                // event.stopPropagation();
                this.openTab(menu);
            },

            // 打开或切换标签页时优化性能
            // menuId，打开的标签页mode模式：open开启、switch切换
            optimizePerfWhenOpenOrSwitchTab: function (menuId, mode) {
                // 设备状态的性能优化
                // 如果切换到的tab不是设备状态，则调用设备状态页面（如果存在）的closeDataInterval，关闭数据获取定时器
                // 如果切换到的tab是设备状态，则调用startDataInterval启动数据获取定时器
                if (menuId != "whgpe") {
                    $('iframe[data-menu-id="whgpe"]').each(function (i, iframe) {
                        iframe.contentWindow.closeDataInterval();
                    });
                }
                else {
                    // 如果是切换到设备状态标签，才需要调用startDataInterval
                    if (mode == "switch") {
                        $('iframe[data-menu-id="whgpe"]').each(function (i, iframe) {
                            iframe.contentWindow.startDataInterval();
                        });
                    }
                }
            },

            // 切换标签页
            switchTab: function (tab, reloadTab) {
                var tabs = this.getTabs();

                avalon.each(tabs, function (i, tab) {
                    tab.isActive = false;
                });

                this.optimizePerfWhenOpenOrSwitchTab(tab.menu.id, "switch");

                // 重新加载标签页
                if ($.isUndefined(reloadTab) || reloadTab == true) {
                    var url = tab.url;
                    tab.url = "";
                    tab.url = url;
                }

                tab.isActive = true;

                // 当前标签页菜单id
                this.changeLeftMenuByMenuId(tab.menu.id);

                // 改变激活的左侧菜单
                $(".tabs").trigger("tabchange", tab.menu.id);
            },

            // 关闭标签页
            closeTab: function (tab, event) {
                if (!$.isUndefined(event)) {
                    event.stopPropagation();
                }

                var tabs = this.getTabs();

                // 不能调用removeAt(index)直接从this.tabs中删除标签对象
                // 如果直接从this.tabs中删除标签对象，会导致dom元素重新渲染，iframe标签页会重新加载
                tab.isRemoved = true;

                // 当前活动的标签页index
                var currentActiveIndex = -1;

                // 关闭的标签页index
                var closedTabIndex = -1;

                avalon.each(tabs, function (i, t) {
                    if (t.isActive) {
                        currentActiveIndex = i;
                    }

                    if (t == tab) {
                        closedTabIndex = i;
                    }
                });

                // 如果关闭的标签等于当前的标签
                if (currentActiveIndex == closedTabIndex) {
                    var activeIndex = tabs.length > closedTabIndex + 1 ?
                        closedTabIndex + 1 : (closedTabIndex - 1 >= 0 ? closedTabIndex - 1 : -1);

                    if (activeIndex != -1) {
                        tabs[activeIndex].isActive = true;

                        this.changeLeftMenuByMenuId(tabs[activeIndex].menu.id);

                        // 改变激活的左侧菜单
                        $(".tabs").trigger("tabchange", tabs[activeIndex].menu.id);
                    }
                    else {
                        // 改变激活的左侧菜单
                        $(".tabs").trigger("tabchange");
                    }
                }
            },

            // 通过标签页id关闭标签页
            closeTabById: function (tabId) {
                var tabs = this.getTabs();

                var tab = $.grep(tabs, function (n) { return n.id == tabId });

                if (tab.length) {
                    this.closeTab(tab[0]);
                }
            },

            // 关闭其他标签页
            closeOtherTabs: function (excludeTabId) {
                var tabs = this.getTabs();
                var _this = this;

                $.each(tabs, function (i, tab) {
                    if (tab.id != excludeTabId) {
                        _this.closeTab(tab);
                    }
                });
            },

            // 关闭所有标签页
            closeAllTabs: function () {
                this.tabs.clear();

                // 改变激活的左侧菜单
                $(".tabs").trigger("tabchange");
            },

            // 上次刷新时间
            _lastRefreshTime: "",

            // 刷新当前标签页
            refreshCurrentTab: function () {
                var tab = this.getActiveTab();

                if (tab != null) {
                    if (this._lastRefreshTime == "" ||
                        (new Date().getTime() - this._lastRefreshTime >= REFRESH_INTERVAL)) {
                        var url = tab.url;
                        tab.url = "";
                        tab.url = url;
                        this._lastRefreshTime = new Date().getTime();
                    }
                }
            },

            changeLeftMenuByMenuId: function (menuId) {
                // 递归检查当前标签页所属的菜单集
                var recurseCheckMenu = function (menu) {
                    if (menu.id == menuId) {
                        return true;
                    }

                    if (menu.submenu && menu.submenu.length) {
                        for (var i = 0; i < menu.submenu.length; i++) {
                            if (recurseCheckMenu(menu.submenu[i])) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                // 切换左侧菜单
                for (var i = 0; i < this.menus.length; i++) {
                    if (recurseCheckMenu(this.menus[i])) {
                        this.changeLeftMenu(this.menus[i]);
                        break;
                    }
                }
            },

            // 打开子菜单
            changeLeftMenu: function (menu) {
                // 如果是与当前左侧菜单相同的菜单，则不切换
                if (this.mainMenu.id == menu.id) {
                    this.hideStartMenu();

                    return;
                }

                this.mainMenu = menu;

                this.leftMenu.clear();

                if (menu.submenu) {
                    this.leftMenu = menu.submenu.$model;
                }

                this.hideStartMenu();

                if (!$(".main .left .menu-wrapper").getNiceScroll().length) {
                    $(".main .left .menu-wrapper").niceScroll({ cursorcolor: "#666", cursorborder: "none" });
                }

                $(".main .left .menu-wrapper").getNiceScroll().resize();
            },

            // 退出登录
            logout: function () {
                $.confirm($.lang.get("logoutMsg"), function () {
                    $.logout();
                });
            },

            // 点击开始菜单的菜单
            clickStartMenu: function (leftMenu, menu, event) {
                this.changeLeftMenu(leftMenu);
                this._openTab(menu, event);

                event.stopPropagation();
            },

            // 重启
            restart: function () {
                $.confirm($.lang.get("deviceRestartMsg1"), function () {
                    var progress = $.progress({ text: $.lang.get("deviceRestartMsg2") });

                    $.om.api.rebootSystem(function () {
                        var currentProgress = 10 + parseInt(Math.random() * 10);
                        progress.changeProgress(currentProgress);

                        // 重启进度条
                        var progressInterval = window.setInterval(function () {
                            if (progressInterval) {
                                progress.changeProgress(++currentProgress);

                                if (currentProgress == 99) {
                                    window.clearInterval(progressInterval);
                                    progressInterval = null;
                                }
                            }
                        }, 1000);

                        // 检查重启状态
                        var checkRebootStatus = function () {
                            $.ajax({
                                url: DEFAULT_SERVER + "login.html",
                                success: function () {
                                    if (progressInterval) {
                                        window.clearInterval(progressInterval);
                                        progressInterval = null;
                                    }

                                    progress.changeProgress(100);

                                    window.setTimeout(function () {
                                        progress.close();

                                        $.alert($.lang.get("deviceRestartSuccess"), "success", function () {
                                            // 清空当前保存的用户信息
                                            $.user.clear();
                                            $.getTopWindow().location.href = "/login.html";
                                        });
                                    }, 2000);
                                },

                                error: function () {
                                    checkRebootStatus();
                                }
                            })
                        }

                        window.setTimeout(function () {
                            checkRebootStatus();
                        }, 3000)
                    });
                });
            },

            // 显示产品信息
            showProductInfo: function () {
                var index = $.load($.lang.get("deviceInfoLoading"));

                $.get(DEFAULT_SERVER + "command?Hcode_version", function (hCodeResp) {
                    $.om.getData("gw.config.get",
                        { id: [640, 528, 527, 56, 57, 1081, 7, 70] },
                        function (resp) {
                            $.close(index);

                            var content = template("product-info-tpl", {
                                id640: resp.data.id640,
                                id528: resp.data.id528,
                                id527: resp.data.id527,
                                id56: resp.data.id56,
                                id57: /Rev\s+\d+\.\d+\.\d+/.exec(resp.data.id57)[0],
                                id1081: resp.data.id1081,
                                id7: resp.data.id7,
                                id70: resp.data.id70,
                                hCode: hCodeResp ? JSON.parse(hCodeResp).result : "",
                                webVersion: WEB_VERSION
                            });

                            $.open({
                                type: 1,
                                skin: "form-style-a device-info",
                                title: $.lang.get("productInfo"),
                                content: content,
                                area: ["680px", "510px"],
                                btn: [$.lang.get("ok")],
                                shadeClose: true
                            });
                        });
                });
            },

            // 搜索关键字
            keyword: "",
            // 是否显示自动完成
            showAutocomplete: false,
            // 搜索结果
            searchResult: [],

            onClickSearchButton: function () {
                $('.search-box [type="text"]').focus();
            },

            // 当在搜索框中进行输入时
            onSearchInput: function (event) {
                var _this = this;

                this.keyword = $.trim(event.target.value);

                this.searchResult.clear();

                // 对菜单进行搜索
                var search = function (menu, parentMenu) {
                    if (menu.submenu &&
                        menu.submenu.length) {
                        $.each(menu.submenu, function (i, sm) {
                            search(sm, menu);
                        });
                    }

                    var keywordReg = new RegExp("(" + _this.keyword + ")", "gi");

                    var replaceStr = function (str) {
                        return str.replace(keywordReg, '<span class="strong">$1</span>');
                    };

                    if (menu.url &&
                        (keywordReg.test(menu.name) ||
                            keywordReg.test(menu.description) ||
                            keywordReg.test(parentMenu.name))) {
                        var result = {
                            menu: menu,
                            title: replaceStr(menu.name),
                            description: replaceStr(menu.description),
                            category: replaceStr(parentMenu.name)
                        };

                        _this.searchResult.push(result);
                    }
                }

                if (this.keyword !== "") {
                    $.each(this.menus, function (i, menu) {
                        search(menu, menu);
                    });

                    this.showAutocomplete = true;
                }
                else {
                    this.showAutocomplete = false;
                }
            },

            // 点击自动完成中的条目
            clickAutoComplete: function (menu, event) {
                this.changeLeftMenuByMenuId(menu.id);
                this._openTab(menu, event);
                this.showAutocomplete = false;
            },

            // 点击搜索栏
            clickSearchInput: function (event) {
                if (event.target.value !== "") {
                    this.showAutocomplete = true;
                }
            },

            // 显示tip
            showTip: function (selector, lang, event) {
                var tipIndex = $.tips($.lang.get(lang), selector, { tips: [3, "#282828"] });
                $(event.target).data("tip-index", tipIndex);
            },

            // 隐藏tip
            hideTip: function (event) {
                $.close($(event.target).data("tip-index"));
            },

            // 根据menu id获取menu
            getMenu: function (menuId) {
                var result = null;

                var resurseMenu = function (menu) {
                    if (menu.id == menuId) {
                        result = menu;
                        return true;
                    }

                    if (menu.submenu) {
                        for (var i = 0; i < menu.submenu.length; i++) {
                            if (resurseMenu(menu.submenu[i])) {
                                return true;
                            }
                        }
                    }

                    return false;
                }

                for (var i = 0; i < this.menus.length; i++) {
                    if (resurseMenu(this.menus[i])) {
                        break;
                    }
                }

                return result;
            },

            showStartSubmenu: function (event) {
                $(".start-menu .sub").hide();
                $(event.target).find(".sub").show();

                // 重置子菜单高度为默认值
                $(event.target).find(".sub").height($(event.target).find(".sub > ul").height() + 20);

                // 窗口高度
                var wh = $(window).height();
                // 菜单top
                var mt = $(event.target).offset().top;
                // 子菜单高度
                var smh = $(event.target).find(".sub").height();

                // 子菜单高度大于窗口高度
                if (smh > wh) {
                    $(event.target).find(".sub").css({
                        // -20及下面的+10是为了与顶部与底部预留10px间距
                        height: wh - 20 + "px",
                        top: -mt + 10 + "px"
                    });
                }
                // 菜单top+子菜单高度大于窗口高度
                else if (mt + smh > wh) {
                    $(event.target).find(".sub").css({
                        // -10是为了与底部预留10px间距
                        top: "-" + (mt + smh - wh) - 10 + "px"
                    });
                }
                // 默认情况
                else {
                    $(event.target).find(".sub").css({
                        top: 0
                    });
                }

                if (!$(event.target).find(".sub").getNiceScroll().length) {
                    $(event.target).find(".sub").niceScroll({ cursorcolor: "#666", cursorborder: "none" });
                }
            }
        });

        $.extend({
            _tab: {
                // 打开标签页
                openTab: function () {
                    // menuId
                    if (arguments.length == 1) {
                        var menu = vm.getMenu(arguments[0]);
                        vm.changeLeftMenuByMenuId(menu.id);
                        vm.openTab(menu);
                    }
                    // name, url
                    else if (arguments.length == 2) {
                        vm.openTab({ name: arguments[0], url: arguments[1] });
                    }
                },
                // 关闭标签页
                closeTab: function (name) {
                    // todo
                }
            }
        });

        $(document).click(function (event) {
            if (!$(".search-box input").is(event.target)) {
                vm.showAutocomplete = false;
            }
        });

        vm.$watch("onReady", function () {
            // vm.openTab(vm.getMenu("a4liu"));
            // window.setTimeout(function() {

            // }, 1000);

            // 如果是默认IP地址，打开配置向导，否则打开状态监控
            window.setTimeout(function () {
                if (location.host == "192.168.2.240") {
                    // 配置向导
                    vm.changeLeftMenu(vm.getMenu("95dsw"));

                    vm.openTab(vm.getMenu("yclm5"));
                }
                else {
                    // 状态监控
                    vm.changeLeftMenu(vm.menus[0]);

                    vm.openTab(vm.getMenu("whgpe"));
                }
            }, 300);
        });

        avalon.scan(document.body);

        // 更新头部信息
        var updateHeadInfo = function () {
            var reqParams = [];

            // 主卡及子卡存在情况（默认配置）
            reqParams.push({ method: "gw.config.get", param: { id: [1351, 1352] } });

            // 主卡及子卡存在情况（当前情况）
            for (var i = 1; i <= 10; i++) {
                reqParams.push({ method: "gw.status.get", param: { line_id: i, id: 100 } });
            }

            $.om.getDataParallel(reqParams, function (resp) {
                if ($.om.hasError(resp)) {
                    vm.headInfo = "";
                    return;
                }

                // 默认主卡状态
                var defaultMainCardStatus = resp[0].data.id1351;

                // 默认子卡状态
                var defaultCardStatus = parseInt(resp[0].data.id1352, "16");
                var dcs = [];
                for (var i = 0; i < 8; i++) {
                    dcs.push($.getBit(defaultCardStatus, i));
                }

                // 当前子卡状态
                var cs = [];
                for (var i = 3; i <= 10; i++) {
                    cs.push($.getBit(resp[i].data["line_id" + i].id100, 0));
                }

                // 计算新增板卡
                var newCardCount = 0;
                for (var i = 0; i < 8; i++) {
                    if (dcs[i] == 0 &&
                        cs[i] == 1) {
                        newCardCount++;
                    }
                }

                /* 计算丢失板卡 */
                var removeCardCount = 0;

                // 默认配置是单机时
                if (defaultMainCardStatus == "1") {
                    // 当前主卡1的状态
                    var currentMainCard1Status = resp[1].data.line_id1.id100;
                    // 当前主卡2的状态
                    var currentMainCard2Status = resp[2].data.line_id2.id100;

                    // 主卡1是主机
                    if ($.getBit(currentMainCard1Status, 0) == 1 &&
                        $.getBit(currentMainCard1Status, 3) == 1) {
                        for (var i = 0; i < 4; i++) {
                            if (dcs[i] == 1 &&
                                cs[i] == 0) {
                                removeCardCount++;
                            }
                        }
                    }
                    // 主卡2是主机
                    else if ($.getBit(currentMainCard2Status, 0) == 1 &&
                        $.getBit(currentMainCard2Status, 3) == 1) {
                        for (var i = 4; i < 8; i++) {
                            if (dcs[i] == 1 &&
                                cs[i] == 0) {
                                removeCardCount++;
                            }
                        }
                    }
                }
                // 默认配置是双机时（不管主备情况）
                else if (defaultMainCardStatus == "2" ||
                    defaultMainCardStatus == "3") {
                    for (var i = 0; i < 8; i++) {
                        if (dcs[i] == 1 &&
                            cs[i] == 0) {
                            removeCardCount++;
                        }
                    }
                }

                if (newCardCount > 0 || removeCardCount > 0) {
                    vm.headInfo = template.render(
                        "{{if newCardCount>0}}" + $.lang.get("warningMsg1") +
                        "*{{newCardCount}}，{{/if}}{{if removeCardCount>0}}" + $.lang.get("warningMsg2") +
                        "*{{removeCardCount}}，{{/if}}" + $.lang.get("warningMsg3"),
                        {
                            newCardCount: newCardCount,
                            removeCardCount: removeCardCount
                        });
                    vm.headInfoClick = function () {
                        $.tab.openTab("apgz0");
                    }
                }
            });
        };

        updateHeadInfo();

        // 树状缩放
        $(document).on("click", ".main .left .main-title", function () {
            if ($(this).next(".sub2").length) {
                $(this).next(".sub2").slideToggle("fast", function () {
                    $(".main .left .menu-wrapper").getNiceScroll().resize();
                });
            }
        });

        $.contextMenu({
            selector: '.tabs li',
            callback: function (key, options) {
                switch (key) {
                    case "close-this":
                        {
                            vm.closeTabById($(this).data("tab-id"));
                            break;
                        }
                    case "close-other":
                        {
                            vm.closeOtherTabs($(this).data("tab-id"));
                            break;
                        }
                    case "close-all":
                        {
                            vm.closeAllTabs();
                            break;
                        }
                }
            },
            items: {
                "close-this": { name: $.lang.get("closeTab") },
                "close-other": { name: $.lang.get("closeOtherTabs") },
                "close-all": { name: $.lang.get("closeAllTabs") }
            }
        });

        // 当改变标签页时
        $(".tabs").on("tabchange", function (event, tabMenuId) {
            $(".main .left [data-menu-id]").removeClass("active");

            if (tabMenuId) {
                $(".main .left [data-menu-id=" + tabMenuId + "]").addClass("active");
            }
        });
    });
});