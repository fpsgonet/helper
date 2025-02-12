// ==UserScript==
// @name         修改昵称与隐身
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       You
// @match        https://fpsgo.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const originalSend = WebSocket.prototype.send;

    // 你想修改的昵称，长度过长可能会导致战绩列表不显示等bug
    const newNickname = "这里填修改的昵称";

    WebSocket.prototype.send = function(data) {
        try {
            if (data instanceof ArrayBuffer) {
                let textData = bufferToHex(data);
                if (textData.includes("5c6e616d655c")) {
                    let newNameHex = stringToHex(newNickname);
                    const ratePrefixHex = stringToHex("\\rate\\1000000");
                    textData = textData.replace(/(5c6e616d655c)/, `${ratePrefixHex}$1`);
                    textData = textData.replace(/(5c6e616d655c)[0-9a-f]+(?=5c)/, `$1${newNameHex}`);
                    data = hexToBuffer(textData);
                    console.log(`已修改 name\\ 为: rate\\1000000\\${newNickname} (${ratePrefixHex}${newNameHex})`);
                }

            }
        } catch (e) {
            console.error("WebSocket 数据修改出错:", e);
        }

        return originalSend.call(this, data);
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

    // HEX 转 ArrayBuffer
    function hexToBuffer(hexString) {
        let bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
            bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    // ArrayBuffer 转 HEX
    function bufferToHex(buffer) {
        let bytes = new Uint8Array(buffer);
        return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }
})();
