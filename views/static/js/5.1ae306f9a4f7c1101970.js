webpackJsonp([5],{Tt99:function(t,e){},VlgL:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("woOf"),a=n.n(i),s=n("Dd8w"),r=n.n(s),d=n("9rMa"),c=n("Zqu6"),l={data:function(){return{currentPatientOpenid:"",data:{rows:[]},userId:""}},methods:r()({},Object(d.c)(["getUserId"]),{changeCurrentHandle:function(t){var e=this,n=t.srcElement.getAttribute("data-openid");Object(c.n)(this.userId,n).then(function(t){t.ret?e.currentPatientOpenid=n:alert("设置失败了~请稍候再试。")})}}),mounted:function(){var t=this;this.userId=this.getUserId(),Object(c.j)(this.userId).then(function(e){if(e.ret){var n=e.data;t.data=a()(n),t.currentPatientOpenid=n.rows[0].currentPatientOpenid,t.flag=!0}})}},u={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"list-page"},[n("div",{staticClass:"weui-cells__title"},[t._v("选择／添加需要就诊的人员")]),t._v(" "),n("div",{staticClass:"list-items"},t._l(t.data.rows,function(e){return n("div",{staticClass:"list-item",class:t.currentPatientOpenid==e.patientOpenid?"current-patient":"",attrs:{"data-openid":e.patientOpenid}},[n("div",{staticClass:"item-info"},[n("router-link",{staticClass:"name",attrs:{to:"/patient/"+e.patientOpenid+"/info"}},[t._v("\n          "+t._s(e.patientName)+"\n          "),n("label",{staticClass:"fee-type",class:1==e.feeType?"fee-type-yb":""},[t._v(t._s(e.feeTypeText))])]),t._v(" "),n("p",{staticClass:"medical-card"},[t._v("\n          就诊卡号："+t._s(e.medicalCard)+"\n        ")])],1),t._v(" "),n("div",{staticClass:"item-flag",attrs:{"data-openid":e.patientOpenid},on:{click:t.changeCurrentHandle}},[t.currentPatientOpenid==e.patientOpenid?n("label",[t._v("当前就诊人")]):t._e()])])})),t._v(" "),n("router-link",{staticClass:"weui-btn weui-btn_plain-primary list-add-btn",attrs:{to:"/patient/add"}},[t._v("添加就诊人")]),t._v(" "),n("transition",{attrs:{name:"router-slid",mode:"out-in"}},[n("router-view")],1)],1)},staticRenderFns:[]};var o=n("VU/8")(l,u,!1,function(t){n("Tt99")},null,null);e.default=o.exports}});
//# sourceMappingURL=5.1ae306f9a4f7c1101970.js.map