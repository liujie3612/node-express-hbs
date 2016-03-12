var photoShow = function() {
    /*首页底部轮播*/
    var zoomLargeList = eleArr(".zoom-large-member");
    var zoomLarge = document.querySelector('.zoom-large');
    var infoItem = eleArr('.info-item');
    var flag = 0;
    var zoomSmallList, timer;
    if (window.innerWidth >= 768) {
        zoomSmallList = eleArr('.member-item');
        zoomSmallList.forEach(function(element, index) {
            element.addEventListener('mouseenter', function() {
                toggleClass(element, index);
                clearInterval(timer);
            });
            element.addEventListener('mouseleave', function() {
                timer = setInterval(frame, 3000);
            });
        });
    } else {
        zoomSmallList = eleArr('.featrue-team-member .circle');
        zoomSmallList.forEach(function(element, index) {
            element.addEventListener('touchstart', function() {
                toggleClass(element, index);
                clearInterval(timer);
            });
        });
        mobileLoop();
    };
    zoomLarge.addEventListener('mouseenter', function() {
        clearInterval(timer);
    });
    zoomLarge.addEventListener('mouseleave', function() {
        timer = setInterval(frame, 3000);
    });

    function toggleClass(ele, index) {
        zoomSmallList.forEach(function(element, index) {
            var thisClass = element.className;
            element.className = thisClass.replace(' selected', '');
        });
        addClass(ele, 'selected');
        var largeClass = document.querySelector('.zoom-large .selected').className;
        document.querySelector('.zoom-large .selected').className = largeClass.replace(' selected', '');
        addClass(zoomLargeList[index], 'selected');
        var activeClass = document.querySelector('.member-info .active').className;
        document.querySelector('.member-info .active').className = activeClass.replace(' active', '');
        addClass(infoItem[index], 'active');
        flag = index;
    };

    function frame() {
        flag++;
        flag = flag % 5;
        toggleClass(zoomSmallList[flag], flag);
    };

    var pre = document.querySelector('.previous');
    var next = document.querySelector('.next');

    pre.addEventListener('click', function() {
        flag--;
        flag = flag < 0 ? 4 : flag;
        toggleClass(zoomSmallList[flag], flag);
    });

    next.addEventListener('click', function() {
        frame();
    });

    timer = setInterval(frame, 3000);

    function mobileLoop() {
        var startX, startY, stopX, stopY;
        document.querySelector(".zoom-large").addEventListener("touchstart", function(e) {
            startX = e.touches[0].clientX;
            clearInterval(timer);
        });
        document.querySelector(".zoom-large").addEventListener("touchmove", function(e) {
            stopX = e.touches[0].clientX;
        });
        document.querySelector(".zoom-large").addEventListener("touchend", function(e) {
            if ((stopX - startX) > 40) {
                flag--;
                flag = flag < 0 ? 4 : flag;
                toggleClass(zoomSmallList[flag], flag);
            } else {
                frame();
            };
            timer = setInterval(frame, 3000);
        });
    };
};

/*首页显示注册人数*/
var initShowStats = function() {

    var ref = new Wilddog("https://usercount.wilddogio.com");

    var ucref = ref.child("usercount");

    var countTotal = document.querySelector(".total");

    function countNumInsAni(ele, text, speed, num) {
        setTimeout(function() {
            ele.textContent = text;
        }, num * speed);
    };

    ucref.on('value', function(snapshot) {

        var count = snapshot.val(); //获取注册人数
        var countStr = (count + "").split("");

        var countNum = countStr.length;
        var countTotalL = countTotal.querySelectorAll('.count-details').length;
        //如果没有插入过数值
        if (countTotalL == 0) {
            for (var i = 0; i < countNum; i++) {

                if (i % 3 == 0 && i > 0) {
                    var quote = document.createElement("span");
                    quote.className = "quote";
                    quote.textContent = ',';
                    countTotal.insertBefore(quote, countTotal.childNodes[0]);

                };
                var li = document.createElement("li");
                li.className = "count-details";
                li.contentText = "0";
                countTotal.insertBefore(li, countTotal.childNodes[0]);
            };

            for (var k = 0; k < countStr.length; k++) {
                var detailsEle = countTotal.querySelectorAll('.count-details')[k];
                for (var i = 0; i <= parseInt(countStr[k]); i++) {
                    countNumInsAni(detailsEle, i, 100, i);
                }

            }

        }
        //已经插入数值后的数值变化
        else {
            /*数值增加但位数不变*/
            if (countNum == countTotalL) {

                for (var k = 0; k < countStr.length; k++) {
                    var detailsEle = countTotal.querySelectorAll('.count-details')[k];
                    var digit = parseInt(detailsEle.textContent);
                    //数值对应位置数字增加
                    if (parseInt(countStr[k]) >= digit) {
                        for (var i = digit; i <= parseInt(countStr[k]); i++) {

                            countNumInsAni(detailsEle, i, 100, i);

                        };
                    }
                    //数值对应位置数字减少
                    else {
                        var num = 0;
                        for (var j = digit; j >= parseInt(countStr[k]); j--) {
                            num += 1;
                            countNumInsAni(detailsEle, j, 100, num);

                        };
                    }
                };
            }
            /*数值增加位数增加*/
            else if (countNum > countTotalL) {
                var emptyEle = Array.prototype.slice.call(document.querySelectorAll(".count-details,.join-dev .quote"), 0);

                emptyEle.forEach(function(element) {
                    countTotal.removeChild(element)
                });
                for (var i = 0; i < countNum; i++) {

                    if (i % 3 === 0 && i > 0) {
                        var span = document.createElement("span");
                        span.className = "quote";
                        span.textContent = ",";
                        countTotal.insertBefore(span, countTotal.children[0]);

                    };
                    var details = document.createElement("li");
                    details.className = "count-details";
                    details.contentText = "0";
                    countTotal.insertBefore(details, countTotal.children[0]);
                };

                for (var k = 0; k < countStr.length; k++) {
                    var detailsEle = countTotal.querySelectorAll('.count-details')[k];
                    for (var i = 0; i <= parseInt(countStr[k]); i++) {
                        countNumInsAni(detailsEle, i, 100, i);
                    }

                }
            }

        }
    });
};

/*编辑器切换动画*/
var initEditorSwitch = function() {
    var panel = eleArr('.code-panel');
    var timer;

    function cut() {
        var smallPanel = document.querySelector('.small-panel');
        var activePanel = document.querySelector('.active-panel');
        var sClass = smallPanel.className;
        var aClass = activePanel.className;
        smallPanel.className = sClass.replace(' small-panel', '');
        activePanel.className = aClass.replace(' active-panel', '');
        addClass(smallPanel, 'active-panel');
        addClass(activePanel, 'small-panel');
        activePanel.addEventListener("click", cut, false);
        smallPanel.removeEventListener('click', cut, false);
    };
    document.querySelector('.small-panel').addEventListener("click", cut);
    panel.forEach(function(element, index) {
        element.addEventListener('click', function() {});
    });
    if (window.innerWidth < 768) {
        mobile();
    };

    function mobile() {
        var circleList = eleArr('.code .circle');
        var flag = 0;
        panel.forEach(function(ele, index) {
            var startX, startY, stopX, stopY;
            ele.addEventListener("touchstart", function(e) {
                startX = e.touches[0].clientX;
                clearInterval(timer);
            });
            ele.addEventListener("touchmove", function(e) {
                stopX = e.touches[0].clientX;
            });
            ele.addEventListener("touchend", function(e) {
                if ((stopX - startX) > 30) {
                    flag--;
                    flag = flag < 0 ? 1 : flag;
                    frame(flag);
                };
                if ((startX - stopX) > 30) {
                    mobileLoop();
                };
                timer = setInterval(mobileLoop, 3000);
            });
        });

        function mobileLoop() {
            flag++;
            flag = flag % 2;
            frame(flag);
        };

        function frame(index) {
            circleList.forEach(function(ele, index) {
                var eClass = ele.className;
                ele.className = eClass.replace(' selected', '');
            });
            addClass(circleList[index], 'selected');
            panel.forEach(function(element, index) {
                var thisClassName = element.className;
                element.className = thisClassName.replace(' active-panel', '');
            });
            addClass(panel[index], 'active-panel');
        };
        timer = setInterval(mobileLoop, 3000);
    };
};

/*编辑器选择编程语言*/
var initEditor = function() {
    var lang = eleArr('.languages .language');

    lang.forEach(function(element, index) {
        element.addEventListener('click', function() {
            var thisLang = eleArr('.active-panel .language');
            var eq = thisLang.indexOf(this);
            var codeListArr = eleArr('.active-panel .code-list-item');
            var selectClass = document.querySelector('.active-panel .selected').className;
            document.querySelector('.active-panel .selected').className = selectClass.replace(' selected', '');
            addClass(this.parentElement, 'selected');
            var activeClass = document.querySelector('.active-panel .active').className;
            document.querySelector('.active-panel .active').className = activeClass.replace(' active', '');
            addClass(codeListArr[eq], 'active');
        });
    });
};

window.addEventListener('load', function() {
    var tmpl = document.getElementById("tmpl1");
    var newEl = document.createElement('div');
    newEl.innerHTML = tmpl.innerHTML;
    tmpl1.parentNode.insertBefore(newEl, tmpl);

    photoShow();
    initEditorSwitch();
    initEditor();
    var wdScript = document.createElement('script');
    wdScript.src = "https://cdn.wilddog.com/js/client/current/wilddog.js";
    document.body.appendChild(wdScript);
    wdScript.onload = function() {
        initShowStats();
    }
    var featrueArr = document.querySelectorAll('.featrue');
    var firScHeight = document.querySelector(".first-sc").offsetHeight;

    /*窗口滚动时效果*/
    window.addEventListener('scroll', function scroll() {
        var scrollTop;
        if (document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop + 74;
        } else {
            scrollTop = document.body.scrollTop + 74;
        };

        if (scrollTop >= firScHeight / 2) {
            if (document.querySelector('.graph')) {
                var cost_compared_ani = document.querySelector('.cost-compared-ani');
                addClass(cost_compared_ani, 'height-animate1');
                var cost_compared_ani = document.querySelector('.time-compared-ani');
                addClass(cost_compared_ani, 'height-animate2');
            }



        };
        /*  if (scrollTop > (firScHeight / 2 + featrueArr[0].offsetHeight)) {
              addClass(document.querySelector('.graph'), 'graph-ani');
          }*/
    });
});
