// ==UserScript==
// @name         加速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://fpsgo.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 加速
    const originalNow = Date.now;
    const startTime = originalNow(); // 获取当前时间
    Date.now = function() {
        return startTime + (originalNow() - startTime) * 10; // 将时间加速10倍
    };

})();