webpackJsonp([9],{eerB:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r("Dd8w"),s=r.n(n),u=r("9rMa"),a=r("Zqu6"),d=r("IcnI"),c={name:"Index",data:function(){return{userId:""}},methods:s()({},Object(u.c)(["getUserId"]),Object(u.b)(["saveUserId"])),mounted:function(){var e=this,t=this;t.userId=t.getUserId(),t.userId||Object(a.l)().then(function(r){d.a.state.userId=r.data.userId,window.localStorage.setItem("userId",r.data.userId),e.saveUserId(r.data.userId),t.$router.push({path:"/patient/add",query:{type:"new"}})})}},i={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"index"},[t("router-view")],1)},staticRenderFns:[]};var o=r("VU/8")(c,i,!1,function(e){r("uhIX")},null,null);t.default=o.exports},uhIX:function(e,t){}});
//# sourceMappingURL=9.d08ba196727d4c56d7d4.js.map