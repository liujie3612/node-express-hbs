var wd = wd || {};

wd.login = wd.login || {};
var warnings = $('.warning');
wd.login.init = function () {

    $(".submit-form").submit(function () {
        return false;
    })

    document.onkeydown = function (e) {
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which;
        if (code == 13) {
            $("#login-btn").click();
        }
    }

    $("#login-btn").click(function (evt) {
        if ($(this).attr('disabled')) {
            return false
        };
        wd.login.doLogin();
    })

    $(".login-github").click(function (evt) {
        wd.login.doGithub();
    })

    $(".login-coding").click(function (evt) {
        wd.login.doCoding();
    })

    $(".login-weibo").click(function (evt) {
        wd.login.doWeibo();
    })


    $('.email-input').focus(function () {
        warnings.eq(0).removeClass('warning-show');
        $(this).removeClass('warning-border').addClass('input-focus');
    }).blur(function () {
        $(this).removeClass('input-focus').removeClass('warning-border');
        if (!wd.util.validateEmail($(this).val()) && $(this).val() !== '') {
            $(".warning").eq(0).text("请输入有效的 Email 地址").addClass('warning-show');
            $('.email-input').addClass('warning-border');
            return;
        }
    })

    $('.password').focus(function () {
        warnings.eq(1).removeClass('warning-password-show');
        $(this).removeClass('warning-border');
        $(this).removeClass('warning-border');
    }).blur(function () {
        $(this).removeClass('warning-border');
    });

};

wd.login.doLogin = function () {
    var email = $("input[name=email]").val();
    var password = $("input[name=password]").val();
    var autoLogin = $('#auto-login').prop("checked");

    if (!wd.util.validateEmail(email)) {
        warnings.eq(0).text('请输入有效的Email地址').addClass('warning-show');
        $('.email-input').addClass('warning-border');
        return;
    }

    if (!wd.util.validatePassword(password)) {
        warnings.eq(1).text('请输入至少8位的字符作为密码').addClass('warning-password-show');
        $('.password').addClass('warning-border').show();
        return;
    }

    var next = $("#next").val();
    if (next == null || next == "") {
        next = "/dashboard";
    }

    // loading
    $('#login-btn').attr('disabled', "true");
    var iterationCount = 1000;
    var keySize = 128;
    var passphrase = $('#sk').val();
    var ck = $('#ck').val();
    var iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    var salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
    var aesUtil = new AesUtil(keySize, iterationCount);
    var cipherText = aesUtil.encrypt(salt, iv, passphrase, password);

    var data = {
        "email": email,
        "password": [ck, salt, iv, cipherText].join('.'),
        "autologin": autoLogin
    };

    $.ajax({
        url: "https://www.wilddog.com/account/login",
        type: 'POST',
        data: data,
        cache: false,
        timeout: 30000,
        dataType: 'json',
        success: function (data, status, xhr) {
            var code = data.code;
            if (code == 0) {
                if (typeof mixpanel != "undefined") {
                    mixpanel.identify(email);
                    mixpanel.people.set({
                        '$email': email
                    });
                }
                setTimeout(function () {
                    window.location.href = next;
                }, 500)

            } else if (code == 1) {
                $('#login-btn').removeAttr("disabled");
                warnings.eq(1).text("Email或密码错误").addClass('warning-password-show');
            }
        },
        error: function () {
            $('#login-btn').removeAttr("disabled");
            warnings.eq(1).text("Email或密码错误").addClass('warning-password-show');
        }
    });
};

wd.login.doGithub = function () {
    $('#login-btn').attr("disabled", "true");
    if (typeof mixpanel != "undefined") {
        mixpanel.track("login with github");
    }

    $.ajax({
        url: "/account/github/url",
        type: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
            var url = data.url;
            setTimeout(window.location = url, 200);
        },
        error: function () {
            $('#login-btn').removeAttr("disabled");
        }
    });
};


wd.login.doCoding = function () {
    $('#login-btn').attr("disabled", "true");
    if (typeof mixpanel != "undefined") {
        mixpanel.track("login with coding");
    }

    $.ajax({
        url: "/account/coding/url",
        type: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
            var url = data.url;
            setTimeout(window.location = url, 200);
        },
        error: function () {
            $('#login-btn').removeAttr("disabled");
        }
    });
};

wd.login.doWeibo = function () {
    $('#login-btn').attr("disabled", "true");
    if (typeof mixpanel != "undefined") {
        mixpanel.track("login with weibo");
    }
    $.ajax({
        url: "/account/weibo/url",
        type: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
            var url = data.url;
            setTimeout(window.location = url, 200);
        },
        error: function () {
            $('#login-btn').removeAttr("disabled");
        }
    });
};

/*function checkEmail(email) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
}

function checkPassword(password) {
    return password.length >= 8;
}*/

wd.util = wd.util || {};
wd.util.validateEmail = function (email) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
};

wd.util.validatePassword = function (password) {
    return password.length >= 8;
};

/**
 * AES utils
 **/
var AesUtil = function (keySize, iterationCount) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function (salt, passPhrase) {
    return CryptoJS.PBKDF2(
        passPhrase,
        CryptoJS.enc.Hex.parse(salt), {
            keySize: this.keySize,
            iterations: this.iterationCount
        });
};

AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
        plainText,
        key, {
            iv: CryptoJS.enc.Hex.parse(iv)
        });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key, {
            iv: CryptoJS.enc.Hex.parse(iv)
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
};