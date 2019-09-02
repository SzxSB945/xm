/**
 * 全局配置
 * @author hq
 */

// 接口服务器地址
var DEFAULT_SERVER = "https://easy-mock.com/mock/5d22e7c55ceb875bbf103603/";

























































/******************************************************************************************/

// 版本号
var WEB_VERSION = "1.8.0";

// 版本号编码（每发布一个版本都要加1）
var WEB_VERSION_CODE = 205;

// 是否调试模式（发布时设置为false）
var DEBUG_MODE = true;

// 是否使用原始JS文件（发布时设置为false，开发时设置为true）
var DONT_USE_STATIC_FILE = true;

// 是否显示调试信息（发布时设置为false）
var DEBUG_LOG = true;

// 是否不使用https登录（发布时设置为false）
var DONT_USE_HTTPS = true;

// 标签页刷新间隔时间(单位：毫秒)
var REFRESH_INTERVAL = 3000;

// 默认加入到接口请求url中的参数（发布时设置为空，开发时设置为&pass=admin）
var EXTRA_URL_PARAM = "";

// 修复om接口返回的错误json数据（发布时设置为false）
var OM_INTERFACE_BUG_FIX = false;

// 接口层默认请求的数据类型
var DEFAULT_DATA_TYPE = "xml";

// 最长的请求url长度阈值，如果超出此长度，会使用post请求
var MAX_URL_LENGTH = 1024;

// 是否禁用权限控制（发布时设置为false）
var DISABLE_AUTH = false;

/**
 * 当set请求的post请求体数据不满足
 * MAX_POST_BODY_LENGTH、MAX_POST_ID_COUNT、MAX_POST_RECORD_COUNT中任一条件时，
 * 请求都将作为一次独立的请求发出
 */
// post请求的body长度的阈值
var MAX_POST_BODY_LENGTH = 30 * 1024; // 30kb

// 调用set接口时，post请求体中最大的id字段数量
var MAX_POST_ID_COUNT = 99999;

// post请求的数据条目
var MAX_POST_RECORD_COUNT = 1000;

// 数据加密密钥
var ENC_KEY = "picghlkjqi6rghrx7vsonlmfb6o7046o";

// 默认分页大小
var DEFAULT_PAGE_SIZE = 50;

// ip分机和sip外线批量添加功能中，单个请求中批量添加的条数限制
var MAX_BATCH_ADD_COUNT = 300;

// 是否防止ajax缓存（在ajax请求中加入时间戳）
var PREVENT_AJAX_CACHE = true;

// 最大打开的标签个数
var MAX_TAB_COUNT = 6;

// 最大搜索条件数
var MAX_SEARCH_CONDITION_COUNT = 6;