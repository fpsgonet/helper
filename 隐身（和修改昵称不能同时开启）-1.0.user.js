// ==UserScript==
// @name         隐身（和修改昵称不能同时开启）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://fpsgo.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const originalSend = WebSocket.prototype.send;

    // 你想修改的 rate 值
    const newRate = "1000000"; // 新的 rate 值

    WebSocket.prototype.send = function(data) {
        try {
            if (data instanceof ArrayBuffer) {
                let textData = bufferToHex(data); // 二进制转换 HEX

                // 检查是否包含目标字段 rate
                if (textData.includes("5c72617465")) { // 5c72617465 是 "rate" 的 HEX
                    console.log("拦截到 WebSocket 发送的数据:", textData);

                    // 使用正则表达式匹配 rate 后的数值
                    let match = textData.match(/5c72617465[0-9a-f]*/);
                    if (match) {
                        // 动态转换 newRate 为 HEX
                        let newRateHex = stringToHex(newRate);

                        // 替换 rate 后的数据
                        textData = textData.replace(/(5c72617465)[0-9a-f]*/, `$1${newRateHex}`);

                        // 转回二进制并发送
                        data = hexToBuffer(textData);
                        console.log(`已修改 rate 为: ${newRate} (${newRateHex})`);
                    }
                }
            }
        } catch (e) {
            console.error("WebSocket 数据修改出错:", e);
        }

        return originalSend.call(this, data);
    };

    // 以下是辅助函数：将字符串转换为 HEX 和 HEX 转回 Buffer
    function stringToHex(str) {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += '\\x' + str.charCodeAt(i).toString(16);
        }
        return hex.replace(/\\x/g, '');
    }

    function hexToBuffer(hex) {
        let array = [];
        for (let i = 0; i < hex.length; i += 2) {
            array.push(parseInt(hex.substr(i, 2), 16));
        }
        return new Uint8Array(array).buffer;
    }

    function bufferToHex(buffer) {
        const byteArray = new Uint8Array(buffer);
        let hex = '';
        byteArray.forEach(byte => {
            hex += byte.toString(16).padStart(2, '0');
        });
        return hex;
    }


})();