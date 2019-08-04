// ==UserScript==
// @name         V站女生捕捉器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  收集数据并识别标记，大家一起来捕捉女生吧！
// @supportURL   https://github.com/TsunaMoe/v2ex-girls-capture/issues
// @author       Tsuna(https://www.tsuna.moe)
// @match        https://www.v2ex.com/t/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.girls_capture_tag{color: white; padding: 0px 8px; height: 18px; line-height: 18px; font-size: 11px; text-align: center; display: inline-block; border-radius: 8px; background-color: rgb(245, 104, 87);}');
    GM_addStyle('.girls_capture_box{width: 200px;height: 130px; border: 1.5px solid gray; border-radius: 6px; text-align: center; vertical-align: middle; background: white; position: absolute; z-index: 999;}');
    GM_addStyle('.girls_capture_title{color: #5bc0de; font-weight: bold; position: relative; top: 20px;}');
    GM_addStyle('.girls_capture_data{position: relative; top: 45px;}');
    GM_addStyle('.girls_capture_data_id{border: 1px solid gray; border-radius: 2px;}');
    GM_addStyle('.girls_capture_data_btn{color: white; border: 1px solid white; border-radius: 5px; position: relative; top: 5px; background: #5bc0de;}');

    var xmlHttp;//定义XMLHttpRequest对象

    function createXmlHttpRequestObject(){
      try{
      xmlHttp=new XMLHttpRequest();
    }catch(e){
      xmlHttp=false;
    }
    //返回创建的对象或打印错误信息
    if(!xmlHttp) {
        console.log("创建XMLHttpRequest时发生错误!");
      }else {
      return xmlHttp;
      }
    }

    /* 请求数据方法 */
    function fetchData() {
      var obj = createXmlHttpRequestObject();
      obj.open("GET", "https://www.tsuna.moe/v2ex/query", true);//异步请求数据
      obj.send(null);
      obj.onreadystatechange = function () {
        if(obj.readyState == 4 && obj.status == 200){
          var replies = document.querySelectorAll(".dark");//帖子回复
          var str = obj.responseText;//请求接口得到的定制字符串
          var girls= new Array();
          girls=str.split(",");//封装成数组
          for(var i = 0; i < replies.length; i ++) {
            for(var j = 0; j < girls.length; j ++) {
              if(girls[j] == replies[i].innerText) {
                var tag = document.createElement('span');//识别标签
                tag.className='girls_capture_tag';
                tag.innerHTML = '女生';
                replies[i].parentNode.append(tag);
              }
            }
          }
        }
      }
    }

    /* 添加数据方法 */
    function addData() {
      var data_box = document.createElement("div");
      data_box.className = "girls_capture_box";
      document.getElementById('Top').appendChild(data_box);

      var data_title = document.createElement("span");
      data_title.className = "girls_capture_title";
      data_title.appendChild(document.createTextNode("V站女生捕捉器"));

      var data_form = document.createElement("form");
      data_form.className = "girls_capture_data";
      data_form.method = "GET";

      data_box.appendChild(data_title);
      data_box.appendChild(data_form);

      var data_input_id = document.createElement("input");
      data_input_id.className = "girls_capture_data_id";
      data_input_id.id = "girls_capture_data_id";
      data_input_id.type = "text";
      data_input_id.placeholder = "填写疑似女生的id o(*≧▽≦)ツ";

      var data_input_btn = document.createElement("input");
      data_input_btn.className = "girls_capture_data_btn";
      data_input_btn.type = "button";
      data_input_btn.value = "提交数据";

      data_input_btn.onclick = function(){
        var obj = createXmlHttpRequestObject();
        var id_data = document.getElementById('girls_capture_data_id').value;
        if(id_data == '') {
          alert("提交数据不能为空!");
        }else {
          obj.open("GET", "https://www.tsuna.moe/v2ex/insert/" + id_data, true);//异步请求数据
          obj.send(null);
          obj.onreadystatechange = function () {
            if(obj.readyState == 4 && obj.status == 200){
              if(obj.responseText == 'y'){
          alert('数据提交成功!');
        }else{
          alert('该女生已被捕捉。请勿重复提交!');
        }
            }
          }
        }
      }
      data_form.appendChild(data_input_id);
      data_form.appendChild(data_input_btn);
    }

    fetchData();//执行数据查询
    addData();//执行数据添加

})();