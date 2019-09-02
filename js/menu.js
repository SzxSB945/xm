/**
 * 菜单定义
 * @author hq
 */
$.extend({
	/**
	 * 获取主页菜单
	 * @param {Function} callback 获取成功后的回调函数，接收一个主页菜单数组的参数。
	 */
	getHomepageMenu: function(callback) {
		// 多语言初始化回调
		$.lang.ready(function() {
			var homepageMenu = [{
				"id": "fc0ka",
				"name": $.lang.get("menu_fc0ka", "状态监控"),
				"icon": "iconfont icon-zhuangtaijiankong",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "whgpe",
					"name": $.lang.get("menu_whgpe", "设备状态"),
					"icon": "iconfont icon-iconfkzt",
					"url": "/modules/status_monitoring/device_status.html",
					"description": "",
					"code": "1"
				}, {
					"id": "ab50z",
					"name": $.lang.get("menu_ab50z", "分机状态"),
					"icon": "iconfont icon-dianhua1",
					"url": "/modules/status_monitoring/extension_state.html",
					"description": "",
					"code": "2"
				}, {
					"id": "008kk",
					"name": $.lang.get("menu_008kk", "外线状态"),
					"icon": "iconfont icon-huchudianhua",
					"url": "/modules/status_monitoring/outside_state.html",
					"description": "",
					"code": "3"
				}, {
					"id": "60gbq",
					"name": $.lang.get("menu_60gbq", "系统状态"),
					"icon": "iconfont icon-xitong",
					"url": "/modules/status_monitoring/system_state.html",
					"description": "",
					"code": "4"
				}]
			}, {
				"id": "i0u9q",
				"name": $.lang.get("menu_i0u9q", "分机设置"),
				"icon": "iconfont icon-telephone",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "xd6bq",
					"name": $.lang.get("menu_xd6bq", "IP分机"),
					"icon": "iconfont icon-dianhua",
					"url": "",
					"description": "",
					"code": "10",
					"submenu": [{
						"id": "a4liu",
						"name": $.lang.get("menu_a4liu", "IP分机"),
						"icon": "",
						"url": "/modules/ip_ext_telephone/list.html",
						"description": "",
						"code": "10"
					}, {
						"id": "emln0",
						"name": $.lang.get("menu_emln0", "表格导入"),
						"icon": "",
						"url": "/modules/ip_ext_telephone/telephone_import.html",
						"description": "",
						"code": "10"
					}, {
						"id": "o7xpd",
						"name": $.lang.get("menu_o7xpd", "批量添加"),
						"icon": "",
						"url": "/modules/form/form.html?tid=3ja50",
						"description": "",
						"code": "10"
					}, {
						"id": "je8jp",
						"name": $.lang.get("menu_je8jp", "批量修改"),
						"icon": "",
						"url": "/modules/ip_ext_telephone/batch_modify.html",
						"description": "",
						"code": "10"
					}, {
						"id": "4vjqq",
						"name": $.lang.get("menu_4vjqq", "全局设置"),
						"icon": "",
						"url": "/modules/form/form.html?tid=x7hxn",
						"description": "",
						"code": "10"
					}]
				}, {
					"id": "2hx2e",
					"name": $.lang.get("menu_2hx2e", "号码过滤"),
					"icon": "iconfont icon-guolv",
					"url": "/modules/ip_ext_telephone/telephone_filter.html",
					"description": "",
					"code": "13"
				}, {
					"id": "08bxt",
					"name": $.lang.get("menu_08bxt", "部门"),
					"icon": "iconfont icon-bumenguanli",
					"url": "/modules/ip_ext_telephone/department.html",
					"description": "",
					"code": "12"
				}, {
					"id": "sxd4n",
					"name": $.lang.get("menu_sxd4n", "来电号码绑定表"),
					"icon": "iconfont icon-tongxunlu",
					"url": "/modules/ip_ext_telephone/call_binding.html",
					"description": "",
					"code": "14"
				}]
			}, {
				"id": "4tkfx",
				"name": $.lang.get("menu_4tkfx", "外线设置"),
				"icon": "iconfont icon-telephone",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "cf2l0",
					"name": $.lang.get("menu_cf2l0", "SIP外线"),
					"icon": "iconfont icon-dialer-sip",
					"url": "",
					"description": "",
					"code": "15",
					"submenu": [{
						"id": "jh18g",
						"name": $.lang.get("menu_jh18g", "SIP外线"),
						"icon": "",
						"url": "/modules/sip/list.html",
						"description": "",
						"code": "15"
					}, {
						"id": "57qnu",
						"name": $.lang.get("menu_57qnu", "表格导入"),
						"icon": "",
						"url": "/modules/sip/sip_import.html",
						"description": "",
						"code": "15"
					}, {
						"id": "uryya",
						"name": $.lang.get("menu_uryya", "批量添加"),
						"icon": "",
						"url": "/modules/form/form.html?tid=av0ca",
						"description": "",
						"code": "15"
					}, {
						"id": "0w0vt",
						"name": $.lang.get("menu_0w0vt", "修改配置"),
						"icon": "",
						"url": "/modules/sip/batch_modify.html",
						"description": "",
						"code": "15"
					}, {
						"id": "acz55",
						"name": $.lang.get("menu_acz55", "注册选项"),
						"icon": "",
						"url": "/modules/form/form.html?tid=7hs3o",
						"description": "",
						"code": "15"
					}]
				}, {
					"id": "z7vnb",
					"name": $.lang.get("menu_z7vnb", "DOD号码配置"),
					"icon": "iconfont icon-dodechild",
					"url": "/modules/dod_number/dod_number_configuration.html",
					"description": "",
					"code": "17"
				}]
			}, {
				"id": "95dsw",
				"name": $.lang.get("menu_95dsw", "配置向导"),
				"icon": "iconfont icon-zhiyin",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "yclm5",
					"name": $.lang.get("menu_yclm5", "配置向导"),
					"icon": "iconfont icon-zhiyin",
					"url": "/modules/configuration_wizard/wizard.html",
					"description": "",
					"code": null
				}]
			}, {
				"id": "gj1ls",
				"name": $.lang.get("menu_gj1ls", "系统维护"),
				"icon": "iconfont icon-navicon-xtpz",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "apgz0",
					"name": $.lang.get("menu_apgz0", "板卡管理"),
					"icon": "iconfont icon-yichuyunzhuji",
					"url": "/modules/system_maintenance/card_management.html",
					"description": "",
					"code": "39"
				}, {
					"id": "q1wzp",
					"name": $.lang.get("menu_q1wzp", "系统扩容"),
					"icon": "iconfont icon-zengjiaziji",
					"url": "",
					"description": "",
					"code": "40",
					"submenu": [{
						"id": "dxf5c",
						"name": $.lang.get("menu_dxf5c", "硬件确认"),
						"url": "/modules/system_maintenance/hardware_validation.html",
						"description": "",
						"code": "40"
					}, {
						"id": "ro53t",
						"name": $.lang.get("menu_ro53t", "网络配置"),
						"url": "/modules/system_maintenance/network_configuration.html",
						"description": "",
						"code": "5"
					}]
				}, {
					"id": "plb8d",
					"name": $.lang.get("menu_plb8d", "告警管理"),
					"icon": "iconfont icon-gaojing",
					"url": "",
					"description": "",
					"code": "45",
					"submenu": [{
						"id": "73rj7",
						"name": $.lang.get("menu_73rj7", "电话告警"),
						"icon": "",
						"url": "/modules/system_maintenance/telephone_alarm.html",
						"description": "",
						"code": "45"
					}, {
						"id": "gvh8p",
						"name": $.lang.get("menu_gvh8p", "历史告警"),
						"icon": "",
						"url": "/modules/system_maintenance/history_alarm.html",
						"description": "",
						"code": "45"
					}]
				}, {
					"id": "n2vkr",
					"name": $.lang.get("menu_n2vkr", "配置管理"),
					"icon": "iconfont icon-Icon-peizhiguanli",
					"url": "/modules/system_maintenance/configuration_management.html",
					"description": "",
					"code": "41"
				}, {
					"id": "t4xrv",
					"name": $.lang.get("menu_t4xrv", "版本管理"),
					"icon": "iconfont icon-banben",
					"url": "",
					"description": "",
					"code": "44",
					"submenu": [{
						"id": "3rvbk",
						"name": $.lang.get("menu_3rvbk", "版本升级"),
						"icon": "",
						"url": "/modules/system_maintenance/version_upgrade.html",
						"description": "",
						"code": "44"
					}]
				}, {
					"id": "wuv4v",
					"name": $.lang.get("menu_wuv4v", "日志管理"),
					"icon": "iconfont icon-rizhi",
					"url": "",
					"description": "",
					"code": "42",
					"submenu": [{
						"id": "us21w",
						"name": $.lang.get("menu_us21w", "日志下载"),
						"icon": "",
						"url": "/modules/system_maintenance/download_log.html",
						"description": "",
						"code": "42"
					}, {
						"id": "3haza",
						"name": $.lang.get("menu_3haza", "日志备份"),
						"icon": "",
						"url": "/modules/system_maintenance/log_backup.html",
						"description": "",
						"code": "42"
					}]
				}, {
					"id": "k42oh",
					"name": $.lang.get("menu_k42oh", "系统工具"),
					"icon": "iconfont icon-xitongguzhang",
					"url": "",
					"description": "",
					"code": "43",
					"submenu": [{
						"id": "rp4xz",
						"name": $.lang.get("menu_rp4xz", "系统时间"),
						"icon": "",
						"url": "/modules/system_maintenance/system_time.html",
						"description": "",
						"code": "43"
					}, {
						"id": "nd45h",
						"name": $.lang.get("menu_nd45h", "语音包管理"),
						"icon": "",
						"url": "/modules/system_maintenance/voice_packet_management.html",
						"description": "",
						"code": "43"
					}, {
						"id": "ntt0k",
						"name": $.lang.get("menu_ntt0k", "ping诊断"),
						"icon": "",
						"url": "/modules/system_maintenance/ping_diagnose.html",
						"description": "",
						"code": "43"
					}, {
						"id": "xvfav",
						"name": $.lang.get("menu_xvfav", "数据抓包"),
						"icon": "",
						"url": "/modules/system_maintenance/data_caught.html",
						"description": "",
						"code": "43"
					}]
				}]
			}, {
				"id": "e99wc",
				"name": $.lang.get("menu_e99wc", "基本设置"),
				"icon": "iconfont icon-shezhi",
				"url": "",
				"description": "",
				"submenu": [{
					"id": "k8fqp",
					"name": $.lang.get("menu_k8fqp", "网络配置"),
					"icon": "iconfont icon-62",
					"url": "/modules/basic_setup/network_settings.html",
					"description": "",
					"code": "5"
				}, {
					"id": "wi734",
					"name": $.lang.get("menu_wi734", "总机"),
					"icon": "iconfont icon-telephone",
					"url": "/modules/basic_setup/automated_attendant.html",
					"description": "",
					"code": "7"
				}, {
					"id": "n3dlz",
					"name": $.lang.get("menu_n3dlz", "来电接听组"),
					"icon": "iconfont icon-huiyuanfenzuguanli",
					"url": "/modules/basic_setup/caller_answering_group.html",
					"description": "",
					"code": "24"
				}, {
					"id": "91suo",
					"name": $.lang.get("menu_91suo", "外呼规则"),
					"icon": "iconfont icon-weibiaoti--",
					"url": "/modules/basic_setup/outgoing_rule.html",
					"description": "",
					"code": "6"
				}, {
					"id": "vgx35",
					"name": $.lang.get("menu_vgx35", "语音管理"),
					"icon": "iconfont icon-yuyin",
					"url": "/modules/basic_setup/voice_management.html",
					"description": "",
					"code": "9"
				}, {
					"id": "4lazr",
					"name": $.lang.get("menu_4lazr", "多级IVR"),
					"icon": "iconfont icon-shuzhuangtu",
					"url": "/modules/ivr/list.html",
					"description": "",
					"code": "8"
				}],
				"code": null
			}, {
				"id": "c8eoh",
				"name": $.lang.get("menu_c8eoh", "安全中心"),
				"icon": "iconfont icon-anquan",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "i3hvj",
					"name": $.lang.get("menu_i3hvj", "安全配置"),
					"icon": "iconfont icon-anquan1",
					"url": "/modules/security_center/security_configuration.html",
					"description": "",
					"code": "33"
				}, {
					"id": "x5v5f",
					"name": $.lang.get("menu_x5v5f", "访问白名单"),
					"icon": "iconfont icon-wiappfangwenliang",
					"url": "/modules/security_center/visit_white_list.html",
					"description": "",
					"code": "34"
				}, {
					"id": "8f3oz",
					"name": $.lang.get("menu_8f3oz", "防暴力破解账户"),
					"icon": "iconfont icon-chuizi",
					"url": "/modules/security_center/violence_prevention.html",
					"description": "",
					"code": "35"
				}, {
					"id": "nlo2l",
					"name": $.lang.get("menu_nlo2l", "静态防御"),
					"icon": "iconfont icon-fanghu",
					"url": "/modules/security_center/static_defense.html",
					"description": "",
					"code": "36"
				}, {
					"id": "wapyc",
					"name": $.lang.get("menu_wapyc", "加密"),
					"icon": "iconfont icon-jiami",
					"url": "/modules/security_center/encryption.html",
					"description": "",
					"code": "37"
				}]
			}, {
				"id": "3a8dp",
				"name": $.lang.get("menu_3a8dp", "权限管理"),
				"icon": "iconfont icon-biaoshilei_quanxian",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "ya7gw",
					"name": $.lang.get("menu_ya7gw", "用户列表"),
					"icon": "iconfont icon-liebiao1",
					"url": "/modules/authority_management/user_management.html",
					"description": "",
					"code": null
				}, {
					"id": "25ayo",
					"name": $.lang.get("menu_25ayo", "操作日志"),
					"icon": "iconfont icon-rizhi1",
					"url": "/modules/authority_management/operation_log.html",
					"description": "",
					"code": null
				}, {
					"id": "mrtgb",
					"name": $.lang.get("menu_mrtgb", "修改密码"),
					"icon": "iconfont icon-mima1",
					"url": "/modules/authority_management/change_password.html",
					"description": "",
					"code": null
				}]
			}, {
				"id": "n6732",
				"name": $.lang.get("menu_n6732", "高级设置"),
				"icon": "iconfont icon-shezhi1",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "rshvq",
					"name": $.lang.get("menu_rshvq", "系统"),
					"icon": "iconfont icon-diannao-shuju",
					"url": "/modules/advanced_setting/set_system.html",
					"description": "",
					"code": "25"
				}, {
					"id": "34mb9",
					"name": $.lang.get("menu_34mb9", "证书"),
					"icon": "iconfont icon-zhengshu",
					"url": "/modules/advanced_setting/certificate.html",
					"description": "",
					"code": "27"
				}, {
					"id": "qcfpn",
					"name": $.lang.get("menu_qcfpn", "功能码"),
					"icon": "iconfont icon-gongneng_chanyeshujuku",
					"url": "/modules/advanced_setting/function_code.html",
					"description": "",
					"code": "28"
				}, {
					"id": "64b0e",
					"name": $.lang.get("menu_64b0e", "拨号检测"),
					"icon": "iconfont icon-ico_yishenggongzuozhan_meilijiance",
					"url": "/modules/advanced_setting/dial_detection.html",
					"description": "",
					"code": "30"
				}, {
					"id": "q01lb",
					"name": $.lang.get("menu_q01lb", "SIP兼容性"),
					"icon": "iconfont icon-tongbubiaojiegou",
					"url": "/modules/advanced_setting/sip_compatibility.html",
					"description": "",
					"code": "31"
				}, {
					"id": "zb6j0",
					"name": $.lang.get("menu_zb6j0", "路由表"),
					"icon": "iconfont icon-luyouqi",
					"url": "/modules/advanced_setting/routing_table.html",
					"description": "",
					"code": "29"
				}, {
					"id": "tilkm",
					"name": $.lang.get("menu_tilkm", "网管"),
					"icon": "iconfont icon-guanliyuan",
					"url": "/modules/advanced_setting/network_management_platform.html",
					"description": "",
					"code": "26"
				}]
			}, {
				"id": "0bsoy",
				"name": $.lang.get("menu_0bsoy", "组网设置"),
				"icon": "iconfont icon-WIFIshebeizuwang",
				"url": "",
				"description": "",
				"code": "46",
				"submenu": [{
					"id": "hin15",
					"name": $.lang.get("menu_hin15", "组网方式"),
					"icon": "iconfont icon-wangluo-1",
					"url": "/modules/network_settings/network_settings.html",
					"description": "",
					"code": "46"
				}]
			}, {
				"id": "97ahq",
				"name": $.lang.get("menu_97ahq", "应用服务"),
				"icon": "iconfont icon-yingyongfuwuzhengchang",
				"url": "",
				"description": "",
				"code": null,
				"submenu": [{
					"id": "tpqnn",
					"name": $.lang.get("menu_tpqnn", "媒体"),
					"icon": "iconfont icon-diannao",
					"url": "/modules/application_server/media_server.html",
					"description": "",
					"code": "18"
				}, {
					"id": "fr2z3",
					"name": $.lang.get("menu_fr2z3", "API"),
					"icon": "iconfont icon-APIguanli",
					"url": "",
					"description": "",
					"code": "19",
					"submenu": [{
						"id": "8vcey",
						"name": $.lang.get("menu_8vcey", "API"),
						"url": "/modules/application_server/application_server.html",
						"description": "",
						"code": "19"
					}, {
						"id": "xbqs1",
						"name": $.lang.get("menu_xbqs1", "分机API开关"),
						"url": "/modules/application_server/extension_api.html",
						"description": "",
						"code": "19"
					}, {
						"id": "rjnd9",
						"name": $.lang.get("menu_rjnd9", "外线API开关"),
						"url": "/modules/application_server/exteriorline_api.html",
						"description": "",
						"code": "19"
					}]
				}, {
					"id": "azonb",
					"name": $.lang.get("menu_azonb", "录音"),
					"icon": "iconfont icon-luyin",
					"url": "/modules/application_server/sound_recording.html",
					"description": "",
					"code": "20"
				}, {
					"id": "x1ity",
					"name": $.lang.get("menu_x1ity", "呼叫限制"),
					"icon": "iconfont icon-weibiaoti--",
					"url": "/modules/application_server/call_barring.html",
					"description": "",
					"code": "21"
				}, {
					"id": "nslo8",
					"name": $.lang.get("menu_nslo8", "秘书"),
					"icon": "iconfont icon-xiaomishu",
					"url": "/modules/application_server/secretary.html",
					"description": "",
					"code": "22"
				}, {
					"id": "cfn0j",
					"name": $.lang.get("menu_cfn0j", "值班表"),
					"icon": "iconfont icon-zhibanxinxi-copy",
					"url": "/modules/application_server/duty_roster.html",
					"description": "",
					"code": "23"
				}]
			}];

			callback(homepageMenu);
		});
	}
});