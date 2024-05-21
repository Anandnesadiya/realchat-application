function generateotp() {
    return Math.floor(1000 + Math.random() * 9000);
}


let message = function (code, lang) {

    lang = (lang == '' ? process.env.DEFAULT_LANGUAGE : lang);
    var _message = require("../core/message")(lang);
    if (!code in _message || isNaN(code)) {
        code = 1001;
    }
    var msg = _message[code];
    if (!msg) {
        msg = _message[1001];
    }
    return msg;
};


let paramValidate = function () {
    let resCode = 0;

    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].val) {
            resCode = arguments[i].code;
            break;
        }
    }

    if (resCode > 0) {
        return Promise.reject(resCode);
    }
    return Promise.resolve();
};

let error = function (res, code, data, send) {
    console.log("code returned " + code);
    if (!send && send != 0) {
        send = 1;
    }
    if (!data) {
        data = [];
    }
    if (isNaN(code) || code == 0) {
        code = 1001;
    }

    var err = message(code, process.env.DEFAULT_LANGUAGE);

    errtxt = { code: code, message: err.message };

    if (send == 1) {
        res.statusCode = err.httpCode;
        res.json(errtxt);
        res.end();
    } else {
        return Promise.reject(errtxt);
    }
};

let success = function (res, data, code) {
    if (!data) {
        data = [];
    }
    if (code > 0) {
        var m = message(code, process.env.DEFAULT_LANGUAGE);
        res.json({ code: 0, message: m.message, data: data });
    } else {
        res.json(data);
    }
    //res.json({ code: 0, message: message, data: data });
};



module.exports = {
    generateotp,
    paramValidate,
    success,
    error,
}