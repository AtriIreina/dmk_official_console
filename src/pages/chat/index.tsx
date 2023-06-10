// const Chat: React.FC = () => {
//   const STATUS = {
//     MANA_UP: 11,
//     MANA_DOWN: 12,
//     MANA_ONLINE: 13,
//     MANA_BIND: 14,
//     ANON_UP: 21,
//     ANON_DOWN: 22,
//     ANON_ONLINE: 23,
//     ANON_BIND: 24,
//     MSG: 31,
//     BIND: 41,
//   };

//   const STATUS_CONFIG = {
//     [STATUS.MANA_UP]: '客服上线',
//     [STATUS.MANA_DOWN]: '客服下线',
//     [STATUS.MANA_ONLINE]: '客服在线',
//     [STATUS.MANA_BIND]: '客服绑定变化',
//     [STATUS.ANON_UP]: '用户上线',
//     [STATUS.ANON_DOWN]: '用户下线',
//     [STATUS.ANON_ONLINE]: '用户在线',
//     [STATUS.ANON_BIND]: '用户绑定变化',
//     [STATUS.MSG]: '普通消息',
//     [STATUS.BIND]: '绑定消息',
//   };

//   let webSocket;
//   let commWebSocket;
//   if ('WebSocket' in window) {
//     let type = document.getElementById('type').value;
//     let auth = document.getElementById('auth').value;
//     let identity = document.getElementById('identity').value;
//     webSocket = new WebSocket(
//       'ws://localhost:9000/dmk/webchat/ws3/' + type + '/' + auth + '/' + identity,
//     );

//     //连通之后的回调事件
//     webSocket.onopen = function () {
//       //webSocket.send( document.getElementById('identity').value+"已经上线了");
//       console.log('已经连通了websocket');
//       setMessageInnerHTML("<h1 style='border:1px;padding:10px'>已经连通了websocket</h1><hr/>");
//     };

//     //接收后台服务端的消息
//     webSocket.onmessage = function (evt) {
//       var received_msg = evt.data;
//       console.log('数据已接收:' + received_msg);
//       var obj = JSON.parse(received_msg);
//       console.log('发送时间:' + obj.date);
//       console.log('可以解析成json:' + obj);

//       var date = obj.date;
//       var fromType = obj.fromType;
//       var fromIdentity = obj.fromIdentity;
//       var toType = obj.toType;
//       var toIdentitySet = obj.toIdentitySet;
//       var msgType = obj.messageType;
//       var msg = obj.msg;
//       var data = obj.data;
//       //msgType: 1代表上线 2代表下线 3代表在线名单 4代表普通消息 5代表绑定客服
//       var text =
//         "<div style='margin:10px'>" +
//         getRoleType(fromType) +
//         ' [' +
//         fromIdentity +
//         '] 给 ' +
//         getRoleType(toType) +
//         ' [' +
//         toIdentitySet +
//         '] 发送了一条消息<br/>发送时间为: [' +
//         date +
//         ']<br/>发送内容为: [' +
//         getMsgType(msgType) +
//         '] ' +
//         msg +
//         '<br/>携带数据为: ' +
//         data +
//         '</div>';
//       document.getElementById('message').innerHTML += text + '<hr/>';
//       // return;
//       if (msgType == STATUS.MANA_UP) {
//       } else if (msgType == STATUS.MANA_DOWN) {
//       } else if (msgType == STATUS.MANA_ONLINE) {
//         document.getElementById('manaList').innerHTML = data;
//         // var manaList = data.split(',');
//         console.log('manaList:', data);
//         console.log('manaList-length:', data.length);
//         if (data != null && data != undefined) {
//           for (var i = 0; i < data.length; i++) {
//             option += '<option>' + data[i] + '</option>';
//           }
//           $('#onLineUser').append(option);
//         }
//       } else if (msgType == STATUS.MANA_BIND) {
//       } else if (msgType == STATUS.ANON_UP) {
//       } else if (msgType == STATUS.ANON_DOWN) {
//       } else if (msgType == STATUS.ANON_ONLINE) {
//         document.getElementById('anonList').innerHTML = data;
//         // var anonList = data.split(',');
//         console.log('anonList:', data);
//         console.log('anonList-length:', data.length);
//         if (data != null && data != undefined) {
//           for (var i = 0; i < data.length; i++) {
//             option += '<option>' + data[i] + '</option>';
//           }
//           $('#onLineUser').append(option);
//         }
//       } else if (msgType == STATUS.ANON_BIND) {
//       } else if (msgType == STATUS.MSG) {
//       } else if (msgType == STATUS.BIND) {
//       }
//       // if (msgType == 1) {
//       //     //把名称放入到selection当中供选择
//       //     var onlineName = obj.username;
//       //     var option = "<option>" + onlineName + "</option>";
//       //     $("#onLineUser").append(option);
//       //     setMessageInnerHTML(onlineName + "上线了");
//       // } else if (msgType == 2) {
//       //     $("#onLineUser").empty();
//       //     var onlineName = obj.onlineUsers;
//       //     var offlineName = obj.username;
//       //     var option = "<option>" + "--所有--" + "</option>";
//       //     for (var i = 0; i < onlineName.length; i++) {
//       //         if (!(onlineName[i] == document.getElementById('username').value)) {
//       //             option += "<option>" + onlineName[i] + "</option>"
//       //         }
//       //     }
//       //     $("#onLineUser").append(option);

//       //     setMessageInnerHTML(offlineName + "下线了");
//       // } else if (msgType == 3) {
//       //     var onlineName = obj.onlineUsers;
//       //     var option = null;
//       //     for (var i = 0; i < onlineName.length; i++) {
//       //         if (!(onlineName[i] == document.getElementById('username').value)) {
//       //             option += "<option>" + onlineName[i] + "</option>"
//       //         }
//       //     }
//       //     $("#onLineUser").append(option);
//       //     console.log("获取了在线的名单" + onlineName.toString());
//       // } else if (msgType == 4){
//       //     setMessageInnerHTML(obj.fromusername + "对" + obj.tousername + "说：" + obj.textMessage);
//       // } else if (msgType == 5){
//       //     setMessageInnerHTML(obj.fromusername + "对" + obj.tousername + "说：" + obj.textMessage);
//       //     document.getElementById('manaList').innerHTML = innerHTML + '<br/>';
//       // }
//     };

//     //连接关闭的回调事件
//     webSocket.onclose = function () {
//       console.log('连接已关闭...');
//       setMessageInnerHTML('连接已经关闭....');
//     };
//   } else {
//     // 浏览器不支持 WebSocket
//     alert('您的浏览器不支持 WebSocket!');
//   }

//   function getRoleType(fromType) {
//     return fromType == 'MANA' ? '客服' : '用户';
//   }

//   function getMsgType(msgType) {
//     return STATUS_CONFIG[msgType];
//   }

//   //将消息显示在网页上
//   function setMessageInnerHTML(innerHTML) {
//     document.getElementById('message').innerHTML += innerHTML + '<br/>';
//   }

//   function closeWebSocket() {
//     //直接关闭websocket的连接
//     webSocket.close();
//   }

//   function clearMessage() {
//     document.getElementById('message').innerHTML = '';
//   }

//   function send() {
//     var selectText = $('#onLineUser').find('option:selected').text();
//     var toType;
//     if (type == 'official') {
//       toType = 'ANON';
//     } else if (type == 'anonymous') {
//       toType = 'MANA';
//     }
//     var message = {
//       toType: toType,
//       toIdentitySet: selectText,
//     };
//     webSocket.send(JSON.stringify(message));
//     $('#text').val('');
//   }

//   return (
//     <div>
//       <div style="margin: auto; text-align: center">
//         <h1>Welcome to websocket</h1>
//         <p>
//           当前角色:
//           <span th:text="${type}" />
//           <span th:text="${auth}" />
//           <span th:text="${identity}" />
//         </p>
//         <p>
//           当前客服列表:
//           <span id="manaList" />
//         </p>
//         <p>
//           当前用户列表:
//           <span id="anonList" />
//         </p>
//       </div>

//       <br />
//       <div style="margin: auto; text-align: center">
//         <select id="onLineUser">
//           <option>--所有--</option>
//         </select>
//         <input id="text" type="text" />
//         <button onclick="send()">发送消息</button>
//       </div>
//       <br />
//       <div style="margin-right: 10px; text-align: right">
//         <button onclick="clearMessage()">清空消息</button>
//         <button onclick="closeWebSocket()">关闭连接</button>
//       </div>
//       <hr />
//       <div id="message" style="text-align: center"></div>
//       <input type="text" th:value="${type}" id="type" style="display: none" />
//       <input type="text" th:value="${auth}" id="auth" style="display: none" />
//       <input type="text" th:value="${identity}" id="identity" style="display: none" />
//     </div>
//   );
// };

// export default Chat;
