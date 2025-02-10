// ==UserScript==
// @name         防踢
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防踢
// @author       You
// @match        https://fpsgo.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const originalWebSocket = window.WebSocket;

    window.WebSocket = function(...args) {
        const ws = new originalWebSocket(...args);

        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                let textData = bufferToHex(event.data);
                if (textData.includes(stringToHex("You were kicked from the game"))) {
                    console.log("检测到踢出消息，已拦截:", textData);
                    event.stopImmediatePropagation();
                    return;
                }
            }
        }, true);

        return ws;
    };

    // 要删除的 cookies 名称列表
    const cookiesToDelete = [
        'Hm_lpvt_38Gjk10deg72yjk09qiihd65s1t3bn2v',
        '__51uvsct__Keyk3NJl0sJ2oNBW',
        '__51vcke__Keyk3NJl0sJ2oNBW',
        '__51vuft__Keyk3NJl0sJ2oNBW',
        '__vtins__Keyk3NJl0sJ2oNBW'
    ];

    // 删除指定的 cookies
    cookiesToDelete.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=fpsgo.net;`;
    });

    // 将字符串转换为 HEX
    function stringToHex(str) {
        return Array.from(new TextEncoder().encode(str), byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // ArrayBuffer 转 HEX
    function bufferToHex(buffer) {
        let bytes = new Uint8Array(buffer);
        return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }
})();
