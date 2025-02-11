// ==UserScript==
// @name         修改昵称
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截 WebSocket 消息并修改 name\ 的值
// @author       You
// @match        https://fpsgo.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const originalSend = WebSocket.prototype.send;

    // 你想修改的昵称，长度过长可能会导致战绩列表不显示等bug
    const newNickname = "这里填写你想修改的昵称";

    WebSocket.prototype.send = function(data) {
        try {
            if (data instanceof ArrayBuffer) {
                let textData = bufferToHex(data); // 二进制转换 HEX

                if (textData.includes("5c6e616d655c")) {
                    console.log("拦截到 WebSocket 发送的数据:", textData);

                    // 获取原 name\ 后的字符串长度
                    let match = textData.match(/5c6e616d655c([0-9a-f]*)/);
                    if (match) {

                        // 动态转换 newNickname 为 HEX
                        let newNameHex = stringToHex(newNickname);

                        // 替换 name\ 后的数据
                        textData = textData.replace(/(5c6e616d655c)[0-9a-f]*/, `$1${newNameHex}`);

                        // 转回二进制并发送
                        data = hexToBuffer(textData);
                        console.log(`已修改 name\ 为: ${newNickname} (${newNameHex})`);
                    }
                }
            }
        } catch (e) {
            console.error("WebSocket 数据修改出错:", e);
        }

        return originalSend.call(this, data);
    };

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

