const log4js = require("log4js");

log4js.configure({
    replaceConsole: true,
    appenders: {
        out: { type: 'console' },                          //控制台输出
        debug: {//debug日志
            type: 'dateFile',
            filename: 'logs/debug_logs/deb',       // 首先手动建好目录，写入日志文件的路径
            //maxLogSize: 1024,                        // 只在 type: 'file' 中才支持
            // 指定pattern后无限备份,pattern精确到ss(秒)就是一秒一个文件,精确到mm(分)就是一分一个文件,hh(小时),dd(天),MM(月),yyyy(年)
            pattern: 'yyyy-MM-dd.log',
            encoding: 'utf-8',                               //文件的编码
            alwaysIncludePattern: true,               // 不指定pattern时若为true会使用 默认值'.yyyy-MM-dd'
        },
        err: {  //err日志
            type: 'dateFile',
            filename: 'logs/error_logs/err',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        info: {  //info日志
            type: 'dateFile',
            filename: 'logs/info_logs/info',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
    },
    categories: {
        //appenders:采用的appender,取appenders项,level:设置级别
        default: { appenders: ['out', 'debug'], level: 'debug' },
        err: { appenders: ['out', 'err'], level: 'error' },
        info: { appenders: ['out', 'info'], level: 'info' },
    }
})

class Log {
    debugLog(text) {
        log4js.getLogger('debug').info(text);
    }

    infoLog(text) {
        log4js.getLogger('info').info(text);
    }

    errorLog(text) {
        log4js.getLogger('err').error(text);
    }
}

module.exports = new Log()