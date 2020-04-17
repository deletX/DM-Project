(this["webpackJsonpreact-fontend"]=this["webpackJsonpreact-fontend"]||[]).push([[0],{247:function(e,t,a){e.exports=a(380)},252:function(e,t,a){},253:function(e,t,a){},301:function(e,t){},303:function(e,t){},337:function(e,t){},338:function(e,t){},380:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(13),o=a.n(i),l=(a(252),a(253),a(235)),c=a(33),s=a(420),u=a(39),m=a(21),d=a.n(m),p="4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT",f="FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL",g="http://localhost:8000/api/v0.1/",E=function(){return g+"current-profile/"},h=function(){return g+"auth/token"},v=function(){return g+"signup/"},b=function(e){return"".concat(function(e){return g+"profiles/".concat(e,"/")}(e),"cars/")},O=function(){return"".concat(E(),"notifications/")},S=function(e,t){return{type:"ADD_ALERT",text:e,style:t}},w=function(e){return function(t){e.response?t(S(e.response.data.toString(),"error")):e.request?t(S(e.request.toString(),"error")):t(S(e.message.toString(),"error"))}},y=a(116),T=a(71),_=function(e,t){return Object(T.a)({},e,{},t)},I=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},r=Object(T.a)({headers:Object(T.a)({"Content-type":e},a)},n);return null!=t&&(r=Object(T.a)({},r,{headers:Object(T.a)({},r.headers,{Authorization:"Bearer ".concat(t)})})),r},N=function(){return function(e){e({type:"PROFILE_OP_START"});var t=localStorage.getItem("access_token");return d.a.get(E(),I("application/json",t)).then((function(t){var a=t.data,n=a.id,r=(a.user,a.picture),i=a.score,o=a.carSet,l=a.averageVote,c=a.receivedFeedback,s=a.givenFeedback;localStorage.setItem("profile_id",n),e(function(e,t,a,n,r,i,o,l){return{type:"GET_PROFILE_SUCCESS",id:e,picture:a,score:n,carSet:r,averageVote:i,receivedFeedback:o,givenFeedback:l}}(n,0,r,i,o,l,c,s))})).catch((function(t){return e({type:"PROFILE_OP_ERROR"}),w(t),t}))}},k=function(){return function(e){e({type:"NOTIFICATIONS_START"});var t=localStorage.getItem("access_token");return m.AxiosInstance.get(O(),I("application/json",t)).then((function(t){e({type:"GET_NOTIFICATIONS_SUCCESS",notifications:t.data})})).catch((function(t){return w(t),e({type:"NOTIFICATIONS_ERROR"}),t}))}},R=function(e){return{type:"AUTH_SUCCESS",token:e}},j=function(e,t){setTimeout((function(e){C(e)}),1e3*e)},C=function(e){return function(t){return d.a.post(h(),y.stringify({client_id:p,client_secret:f,grant_type:"refresh_token",refresh_token:e}),I("application/x-www-form-urlencoded")).then((function(e){var a=e.data.access_token,n=e.data.refresh_token,r=new Date((new Date).getTime()+36e5);localStorage.setItem("access_token",a),localStorage.setItem("refresh_token",n),localStorage.setItem("expirationDate",r),t(R(a)),N(),k(),j(3600)})).catch((function(e){return t({type:"AUTH_ERROR"}),w(e),e}))}},x=function(e){return function(t){return t({type:"AUTH_START"}),d.a.post(g+"auth/convert-token",y.stringify({client_id:p,client_secret:f,grant_type:"convert_token",backend:"google-oauth2",token:e}),I("application/x-www-form-urlencoded")).then((function(e){var a=e.data.access_token,n=e.data.refresh_token,r=new Date((new Date).getTime()+36e5);localStorage.setItem("access_token",a),localStorage.setItem("refresh_token",n),localStorage.setItem("expirationDate",r),t(R(a)),N(),k(),j(3600)})).catch((function(e){return t({type:"AUTH_ERROR"}),w(e),e}))}},P=function(e,t){return function(a){return a({type:"AUTH_START"}),d.a.post(h(),y.stringify({client_id:p,client_secret:f,grant_type:"password",username:e,password:t}),I("application/x-www-form-urlencoded")).then((function(e){var t=e.data.access_token,n=e.data.refresh_token,r=new Date((new Date).getTime()+36e5);localStorage.setItem("access_token",t),localStorage.setItem("refresh_token",n),localStorage.setItem("expirationDate",r),a(R(t)),N(),k(),j(3600)})).catch((function(e){return a({type:"AUTH_ERROR"}),w(e),e}))}},A=function(){return function(e){var t=localStorage.getItem("token");if(void 0===t)F();else{var a=new Date(localStorage.getItem("expirationDate"));a<=new Date?F():(e(R(t)),N(),k(),j((a.getTime()-(new Date).getTime())/1e3))}}},F=function(){return function(e){e((localStorage.clear(),{type:"AUTH_LOGOUT"}))}},L=a(422),U=a(384),D=a(142),W=Object(s.a)((function(e){return{root:{minWidth:"100vw",backgroundColor:D.white,alignItems:"center",flexDirection:"column",display:"flex"},formPaper:{flexDirection:"column",alignItems:"center",display:"flex",flexWrap:"wrap",margin:20,maxWidth:"55ch",minWidth:"10ch",backgroundColor:e.palette.background.paper},inline:{display:"inline"}}})),B=Object(u.b)((function(e){return{isAuthenticated:void 0!==e.auth.token}}),(function(e){return{login:P,googleLogin:x}}))((function(e){var t=e.children,a=e.isAuthenticated;Object(n.useEffect)((function(){a&&rt.push("/home")}));var i=W();return r.a.createElement(L.a,{className:i.root,maxWidth:"xs"},r.a.createElement(U.a,{className:i.formPaper},t))})),H=a(12),q=a(87),$=a(432),z=a(454),G=a(433),J=a(446),M=a(428),V=a(451),Z=a(456),Q=a(424),X=a(429),K=a(450),Y=a(423),ee=Object(s.a)((function(e){return{root:{marginBottom:e.spacing(2),width:"100%",display:"flex",flexDirection:"column",alignItems:"center"},form:{width:"100%"},button:{marginRight:e.spacing(1),marginBottom:e.spacing(1)},imageInput:{display:"none"},imageProgress:{marginLeft:e.spacing(1)},imgPreview:{margin:10,maxWidth:"9ch",minWidth:"6ch",maxHeight:"9ch",minHeight:"6ch"}}})),te=function(e){var t=e.firstName,a=e.setFirstName,i=e.lastName,o=e.setLastName,l=e.username,c=e.setUsername,s=e.usernameError,u=e.setUsernameError,m=e.password,d=e.setPassword,p=e.passwordError,f=e.setPasswordError,g=e.email,E=e.setEmail,h=e.emailError,v=e.setEmailError,b=e.image,O=e.setImage,S=e.imageURL,w=e.setImageURL,y=ee(),T=Object(n.useState)(""),_=Object(H.a)(T,2),I=_[0],N=_[1],k=Object(n.useState)(""),R=Object(H.a)(k,2),j=R[0],C=R[1],x=Object(n.useState)(""),P=Object(H.a)(x,2),A=P[0],F=P[1],L=function(e){null===e.target.value||""===e.target.value?(v(!0),N("Email is required")):/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)?(v(!1),N("")):(v(!0),N("Not a valid email")),E(e.target.value)},U=function(e){null===e.target.value||""===e.target.value?(u(!0),F("Username is required")):(u(!1),F("")),c(e.target.value)},D=function(e){null===e.target.value||""===e.target.value?(f(!0),C("Password is required")):/^[\w!@#$%^&*]{8,}$/.test(e.target.value)?/^(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(e.target.value)?/^(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(e.target.value)?/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(e.target.value)?/^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\w!@#$%^&*]{8,}$/.test(e.target.value)?(f(!1),C("")):(f(!0),C("Password should contain at least 1 special character")):(f(!0),C("Password should contain at least 1 lowercase")):(f(!0),C("Password should contain at least 1 capital")):(f(!0),C("Password should contain at least 1 number")):(f(!0),C("Password should be at least 8 character long")),d(e.target.value)};return r.a.createElement("div",{className:y.root},r.a.createElement(K.a,{src:""!==S?S:"media/default-profile.png",className:y.imgPreview}),r.a.createElement("form",{className:y.form},r.a.createElement(Y.a,{container:!0,spacing:2},r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{variant:"outlined",fullWidth:!0,id:"name",label:"First Name",placeholder:"James",value:t,onChange:function(e){a(e.target.value)},autoComplete:"name"})),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{variant:"outlined",fullWidth:!0,id:"surname",label:"Last Name",placeholder:"Bond",value:i,onChange:function(e){o(e.target.value)},autoComplete:"family-name"})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(V.a,{variant:"outlined",fullWidth:!0,required:!0,id:"username",label:"Username",value:l,placeholder:"jamesbond007",helperText:A,onChange:U,onBlur:U,error:s,autoComplete:"username"})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(V.a,{variant:"outlined",fullWidth:!0,required:!0,id:"email",label:"E-mail",placeholder:"jamesbond@mi6.co.uk",type:"email",error:h,helperText:I,onChange:L,onBlur:L,value:g,autoComplete:"email"})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(V.a,{variant:"outlined",fullWidth:!0,required:!0,id:"password",label:"Password",error:p,value:m,type:"password",helperText:j,onChange:D,onBlur:D,autoComplete:"new-password"})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(M.a,{fullWidth:!0,variant:"contained",color:"secondary",component:"label",justify:"flex-end",className:y.button,startIcon:r.a.createElement(Z.a,null)},"Picture",r.a.createElement(Q.a,{className:y.imageInput,type:"file",controlled:!0,onChange:function(e){O("loading");var t=new FileReader,a=e.target.files[0];t.onloadend=function(){w(t.result)},O(a),t.readAsDataURL(a)}}),"loading"===b?r.a.createElement(r.a.Fragment,null,r.a.createElement(X.a,{size:"2ch",className:y.imageProgress})):r.a.createElement(r.a.Fragment,null))))))},ae=a(434),ne=a(443),re=a(430),ie=a(426),oe=a(453),le=a(431),ce=Object(s.a)((function(e){return{root:{marginBottom:e.spacing(2),width:"100%",display:"flex",flexDirection:"column",alignItems:"center"},form:{width:"100%"},button:{marginRight:e.spacing(1),marginBottom:e.spacing(1)}}})),se=function(e){var t=e.name,a=e.setName,i=e.totSeats,o=e.setTotSeats,l=e.consumption,c=e.setConsumption,s=e.fuel,u=e.setFuel,m=ce(),d=Object(n.useState)(!1),p=Object(H.a)(d,2),f=p[0],g=p[1];return r.a.createElement("div",{className:m.root},r.a.createElement(ie.a,{variant:"outlined",className:m.form},r.a.createElement(Y.a,{container:!0,spacing:2},r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{fullWidth:!0,id:"car-name",label:"Name",placeholder:"Fiat Uno 1992",value:t,onChange:function(e){var t=e.target.value;t.length>0?g(!1):g(!0),a(t)},onBlur:function(e){(e.target.value.length<0||""===e.target.value)&&g(!0)},error:f,required:!0,helperText:f?"Name is required":"",autoComplete:"name"})),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(ie.a,{variant:"outlined"},r.a.createElement(oe.a,{id:"tot-seats-label"},"Seats"),r.a.createElement(ne.a,{id:"tot-seats",label:"Seats",labelId:"tot-seats-label",value:i,onChange:function(e){o(e.target.value)}},r.a.createElement(re.a,{value:2},"2"),r.a.createElement(re.a,{value:3},"3"),r.a.createElement(re.a,{value:4},"4"),r.a.createElement(re.a,{value:5},"5"),r.a.createElement(re.a,{value:6},"6"),r.a.createElement(re.a,{value:7},"7"),r.a.createElement(re.a,{value:8},"8"),r.a.createElement(re.a,{value:9},"9")))),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(ie.a,{variant:"outlined"},r.a.createElement(oe.a,{id:"fuel-label"},"Fuel"),r.a.createElement(ne.a,{id:"fuel",labelId:"fuel-label",label:"Fuel",value:s,onChange:function(e){u(e.target.value)}},r.a.createElement(re.a,{value:1},"Petrol"),r.a.createElement(re.a,{value:2},"Diesel"),r.a.createElement(re.a,{value:3},"Gas"),r.a.createElement(re.a,{value:4},"Electric")))),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{type:"number",helperText:"Between 5 and 25",step:.05,label:"Consumption",value:l,InputProps:{endAdornment:r.a.createElement(le.a,{position:"end"},"l/100Km")},onChange:function(e){c(e.target.value)},onBlur:function(e){var t=e.target.value;t<5&&(e.target.value=5),t>20&&(e.target.value=20),c(e.target.value)}})))))},ue=Object(s.a)((function(e){return{root:{marginBottom:e.spacing(5),width:"100%",display:"flex",flexDirection:"column",alignItems:"center"},form:{width:"100%"},button:{marginRight:e.spacing(1),marginBottom:e.spacing(1)},imageInput:{display:"none"},imageProgress:{marginLeft:e.spacing(1)},imgPreview:{margin:10,maxWidth:"9ch",minWidth:"6ch",maxHeight:"9ch",minHeight:"6ch"},instruction:{marginBottom:e.spacing(2)},carDivider:{width:"123%",marginTop:e.spacing(5),marginRight:"22px",marginBottom:e.spacing(5)}}})),me=function(e){var t=e.firstName,a=e.lastName,n=e.username,i=e.password,o=e.email,l=e.imageURL,c=e.carName,s=e.totSeats,u=e.consumption,m=e.fuel,d=ue();return r.a.createElement("div",{className:d.root},r.a.createElement(q.a,{className:d.instruction},"Review you're data before submitting!"),r.a.createElement(K.a,{src:""!==l?l:"media/default-profile.png",className:d.imgPreview}),r.a.createElement(ie.a,{variant:"outlined",className:d.form},r.a.createElement(Y.a,{container:!0,spacing:2},r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{fullWidth:!0,id:"name",label:"First Name",value:t,InputProps:{readOnly:!0}})),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{fullWidth:!0,id:"surname",label:"Last Name",value:a,InputProps:{readOnly:!0}})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(V.a,{fullWidth:!0,id:"username",label:"Username",value:n,InputProps:{readOnly:!0}})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(V.a,{fullWidth:!0,id:"email",label:"E-mail",type:"email",value:o,InputProps:{readOnly:!0}})),r.a.createElement(Y.a,{item:!0,xs:12},r.a.createElement(V.a,{fullWidth:!0,id:"password",label:"Password",value:i,type:"password",InputProps:{readOnly:!0}})))),""!==c&&r.a.createElement(r.a.Fragment,null,r.a.createElement($.a,{className:d.carDivider}),r.a.createElement(ie.a,{variant:"outlined",className:d.form},r.a.createElement(Y.a,{container:!0,spacing:2},r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{fullWidth:!0,id:"car-name",label:"Name",value:c,InputProps:{readOnly:!0}})),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(ie.a,{variant:"outlined"},r.a.createElement(oe.a,{id:"tot-seats-label"},"Seats"),r.a.createElement(ne.a,{id:"tot-seats",label:"Seats",labelId:"tot-seats-label",value:s,inputProps:{readOnly:!0}},r.a.createElement(re.a,{value:2},"2"),r.a.createElement(re.a,{value:3},"3"),r.a.createElement(re.a,{value:4},"4"),r.a.createElement(re.a,{value:5},"5"),r.a.createElement(re.a,{value:6},"6"),r.a.createElement(re.a,{value:7},"7"),r.a.createElement(re.a,{value:8},"8"),r.a.createElement(re.a,{value:9},"9")))),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(ie.a,{variant:"outlined"},r.a.createElement(oe.a,{id:"fuel-label"},"Fuel"),r.a.createElement(ne.a,{id:"fuel",labelId:"fuel-label",label:"Fuel",value:m,inputProps:{readOnly:!0}},r.a.createElement(re.a,{value:1},"Petrol"),r.a.createElement(re.a,{value:2},"Diesel"),r.a.createElement(re.a,{value:3},"Gas"),r.a.createElement(re.a,{value:4},"Electric")))),r.a.createElement(Y.a,{item:!0,xs:12,sm:6},r.a.createElement(V.a,{type:"number",step:.05,label:"Consumption",value:u,InputProps:{endAdornment:r.a.createElement(le.a,{position:"end"},"l/100Km"),readOnly:!0}}))))))},de=a(447),pe=a(455),fe=Object(s.a)((function(e){return{title:{backgroundColor:e.palette.background.paper,padding:e.spacing(1)},button:{marginRight:e.spacing(1)},instructions:{marginTop:e.spacing(1),marginBottom:e.spacing(1)},root:{width:"95%",margin:10},loading:{marginBottom:e.spacing(5),width:"100%",display:"flex",flexDirection:"column",alignItems:"center"},backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff"},loadingTypography:{marginBottom:e.spacing(2)}}}));var ge=Object(u.b)(null,(function(e){return{signup:function(t,a,n,r,i,o,l,c,s,u){return e(function(e,t,a,n,r){return function(i){return i({type:"AUTH_START"}),console.log("authSIGNUP"),console.log(v()),d.a.post(v(),{username:e,first_name:t,last_name:a,email:n,password:r},I("application/json")).then((function(t){var a=P(e,r);console.log("teeeest"),console.log(a)})).catch((function(e){return i({type:"AUTH_ERROR"}),i(w(e)),e}))}}(t,a,n,r,i))},login:function(t,a){return e(P(t,a))},setPicture:function(t){return e((a=t,function(e){e({type:"PROFILE_OP_START"});var t=localStorage.getItem("access_token"),n=new FormData;return n.append("picture",a,a.name),d.a.put(E(),n,I("multipart/form-data",t)).then((function(t){e(function(e){return{type:"PROFILE_PICTURE_UPDATE",picture:e}}(t.data.picture)),e(S("Immagine modificata con successo!","success"))})).catch((function(t){return w(t),e({type:"PROFILE_OP_ERROR"}),t}))}));var a},postCar:function(t,a,n,r){return e(function(e,t,a,n){return function(r){r({type:"PROFILE_OP_START"});var i=localStorage.getItem("access_token"),o=localStorage.getItem("profile_id");return d.a.post(b(o),{name:e,tot_avail_seats:t,fuel:a,consumption:n},I("application/json",i)).then((function(e){var t=e.data,a=t.id,n=t.name,i=t.totSeats,o=t.fuel,l=t.consumption;r(function(e,t,a,n,r){return{type:"CAR_CREATE",id:e,name:t,totSeats:a,fuel:n,consumption:r}}(a,n,i,o,l))})).catch((function(e){return w(e),r({type:"PROFILE_OP_ERROR"}),e}))}}(t,a,n,r))}}}))((function(e){e.login;var t=e.signup,a=(e.setPicture,e.postCar,Object(n.useState)("")),i=Object(H.a)(a,2),o=i[0],l=i[1],c=Object(n.useState)(!1),s=Object(H.a)(c,2),u=s[0],m=s[1],d=Object(n.useState)(""),p=Object(H.a)(d,2),f=p[0],g=p[1],E=Object(n.useState)(""),h=Object(H.a)(E,2),v=h[0],b=h[1],O=Object(n.useState)(""),S=Object(H.a)(O,2),w=S[0],y=S[1],T=Object(n.useState)(!1),_=Object(H.a)(T,2),I=_[0],N=_[1],k=Object(n.useState)(""),R=Object(H.a)(k,2),j=R[0],C=R[1],x=Object(n.useState)(!1),P=Object(H.a)(x,2),A=P[0],F=P[1],L=Object(n.useState)(null),U=Object(H.a)(L,2),D=U[0],W=U[1],B=Object(n.useState)(""),V=Object(H.a)(B,2),Z=V[0],Q=V[1],K=Object(n.useState)(""),Y=Object(H.a)(K,2),ee=Y[0],ne=Y[1],re=Object(n.useState)(4),ie=Object(H.a)(re,2),oe=ie[0],le=ie[1],ce=Object(n.useState)(10),ue=Object(H.a)(ce,2),ge=ue[0],Ee=ue[1],he=Object(n.useState)(1),ve=Object(H.a)(he,2),be=ve[0],Oe=ve[1],Se=Object(n.useState)(!0),we=Object(H.a)(Se,2),ye=we[0],Te=(we[1],["Personal Info","Add your Car","Submit!"]),_e=fe(),Ie=r.a.useState(0),Ne=Object(H.a)(Ie,2),ke=Ne[0],Re=Ne[1],je=r.a.useState(new Set),Ce=Object(H.a)(je,2),xe=Ce[0],Pe=Ce[1],Ae=function(e){return 1===e},Fe=function(e){return xe.has(e)},Le=function(){var e=xe;Fe(ke)&&(e=new Set(e.values())).delete(ke),Re((function(e){return e+1})),Pe(e)},Ue=function(){Re((function(e){return e-1}))},De=function(){if(!Ae(ke))throw new Error("You can't skip a step that isn't optional.");Re((function(e){return e+1})),Pe((function(e){var t=new Set(e.values());return t.add(ke),t}))};ke===Te.length&&t(w,f,v,o,j,D,ee,oe,be,ge);var We=!function(e){switch(e){case 0:return!u&&o.length>0&&!I&&w.length>0&&!A&&j.length>0;case 1:return ee.length>0;default:return!0}}(ke);return r.a.createElement("div",{className:_e.root},r.a.createElement(q.a,{variant:"h5",align:"center",className:_e.title},"Sign Up!"),r.a.createElement($.a,null),r.a.createElement(z.a,{activeStep:ke,orientation:"vertical"},Te.map((function(e,t){var a={},n={};return Ae(t)&&(n.optional=r.a.createElement(q.a,{variant:"caption"},"Optional")),Fe(t)&&(a.completed=!1),r.a.createElement(G.a,Object.assign({key:e},a),r.a.createElement(J.a,n,e),r.a.createElement(ae.a,null,function(e){switch(e){case 0:return r.a.createElement(te,{firstName:f,setFirstName:g,lastName:v,setLastName:b,username:w,setUsername:y,usernameError:I,setUsernameError:N,email:o,setEmail:l,emailError:u,setEmailError:m,password:j,setPassword:C,passwordError:A,setPasswordError:F,image:D,setImage:W,imageURL:Z,setImageURL:Q});case 1:return r.a.createElement(se,{name:ee,setName:ne,totSeats:oe,setTotSeats:le,consumption:ge,setConsumption:Ee,fuel:be,setFuel:Oe});case 2:return r.a.createElement(me,{firstName:f,lastName:v,username:w,email:o,password:j,imageURL:Z,carName:ee,totSeats:oe,consumption:ge,fuel:be});default:return"Unknown step"}}(t),r.a.createElement("div",null,r.a.createElement(M.a,{disabled:0===ke,onClick:Ue,className:_e.button},"Back"),Ae(ke)&&r.a.createElement(M.a,{variant:"contained",color:"primary",onClick:De,className:_e.button},"Skip"),r.a.createElement(M.a,{variant:"contained",color:"primary",onClick:Le,className:_e.button,disabled:We},ke===Te.length-1?"SignUP!":"Next"))))}))),ke===Te.length&&r.a.createElement(pe.a,{className:_e.backdrop,open:ye},r.a.createElement(de.a,{className:_e.loading},r.a.createElement(q.a,{className:_e.loadingTypography},"Loading your data!"),r.a.createElement(X.a,{color:"inherit"}))))})),Ee=(Object(c.a)(),function(e){return r.a.createElement("div",null,r.a.createElement(l.c,null,r.a.createElement(l.a,{exact:!0,path:"/signup"},r.a.createElement(B,null,r.a.createElement(ge,null)))))}),he=a(444),ve=a(436),be=a(386),Oe=a(225),Se=a.n(Oe),we=Object(s.a)((function(e){return{root:{width:"100%","& > * + *":{marginTop:e.spacing(2)}}}}));function ye(e){var t=we(),a=r.a.useState(!0),n=Object(H.a)(a,2),i=n[0],o=n[1],l=e.alert;return r.a.createElement("div",{className:t.root},r.a.createElement(be.a,{in:i},r.a.createElement(he.a,{severity:l.style,action:r.a.createElement(ve.a,{"aria-label":"close",color:"inherit",size:"small",onClick:function(){o(!1)}},r.a.createElement(Se.a,{fontSize:"inherit"}))},l.text)))}function Te(e){var t=e.alerts.map((function(e){return r.a.createElement(ye,{key:e.id,alert:e})}));return r.a.createElement("div",{className:"alert-container"},t)}var _e=a(56),Ie=a(441),Ne=a(442),ke=a(20),Re=a(227),je=a.n(Re),Ce=a(237),xe=a(440),Pe=a(233),Ae=a(228),Fe=a.n(Ae),Le=a(148),Ue=a.n(Le),De=a(147),We=a.n(De),Be=a(229),He=a.n(Be),qe=a(232),$e=a(448),ze=Object(qe.a)({palette:{primary:{light:"#52c7b8",main:"#009688",dark:"#00675b",contrastText:"#000"},secondary:{light:"#ffc246",main:"#ff9100",dark:"#c56200",contrastText:"#000"},background:{paper:"#f0f0f0"}}}),Ge=ze=Object($e.a)(ze),Je=a(449),Me=a(427),Ve=a(385),Ze=a(438),Qe=a(437),Xe=a(226),Ke=a.n(Xe),Ye=Object(s.a)((function(e){return{root:{width:"100%",maxWidth:"36ch",backgroundColor:e.palette.background.paper},inline:{display:"inline"}}}));function et(e){var t=e.notification,a=e.history;Ye();return r.a.createElement(r.a.Fragment,null,r.a.createElement(Ve.a,{alignItems:"flex-start",disabled:t.read,component:"a",href:"#",onClick:a.push(t.url)},r.a.createElement(Qe.a,null,r.a.createElement(Ke.a,null)),r.a.createElement(Ze.a,{primary:t.title,secondary:t.content})),r.a.createElement($.a,{variant:"inset",component:"li"}))}var tt=je()((function(e){return{grow:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:Object(_e.a)({color:"inherit",textDecoration:"inherit",display:"none",outline:0,marginLeft:10},e.breakpoints.up("sm"),{display:"block"}),search:Object(_e.a)({position:"relative",borderRadius:e.shape.borderRadius,backgroundColor:Object(ke.b)(e.palette.common.white,.15),"&:hover":{backgroundColor:Object(ke.b)(e.palette.common.white,.25)},marginRight:e.spacing(2),marginLeft:5,width:"100%"},e.breakpoints.up("sm"),{marginLeft:e.spacing(3),width:"auto"}),searchIcon:{padding:e.spacing(0,2),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"},inputRoot:{color:"inherit"},inputInput:Object(_e.a)({padding:e.spacing(1,1,1,0),paddingLeft:"calc(1em + ".concat(e.spacing(4),"px)"),transition:e.transitions.create("width"),width:"100%"},e.breakpoints.up("md"),{width:"20ch"}),sectionDesktop:Object(_e.a)({display:"none"},e.breakpoints.up("md"),{display:"flex"}),sectionMobile:Object(_e.a)({display:"flex"},e.breakpoints.up("md"),{display:"none"}),logo:{maxHeight:"60px",outline:0},list:{width:250},fullList:{width:"auto"},drawerTitle:{margin:10},logout:{marginLeft:20}}}));var at=Object(u.b)((function(e){return{isAuthenticated:void 0!==e.auth.token,notificationsNumber:e.notifications.notifications.length,notifications:e.notifications.notifications}}))((function(e){var t=e.isAuthenticated,a=e.notifications,n=e.notificationsNumber,i=tt(),o=r.a.useState(null),l=Object(H.a)(o,2),c=l[0],s=l[1],u=r.a.useState(!1),m=Object(H.a)(u,2),d=m[0],p=m[1],f=function(e){return function(t){("keydown"!==t.type||"Tab"!==t.key&&"Shift"!==t.key)&&p(e)}},g=Boolean(c),E=r.a.createElement(M.a,{color:"inherit",className:i.logout}," Logout"),h=r.a.createElement(Pe.a,{anchorEl:c,anchorOrigin:{vertical:"top",horizontal:"right"},id:"primary-search-account-menu-mobile",keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:g,onClose:function(){s(null)}},r.a.createElement(re.a,null,r.a.createElement(ve.a,{"aria-label":"show ".concat(n," new notifications"),color:"inherit"},r.a.createElement(xe.a,{badgeContent:n,color:"secondary"},r.a.createElement(We.a,null))),r.a.createElement("p",null,"Notifications")),r.a.createElement(re.a,{onClick:f(!0)},r.a.createElement(ve.a,{"aria-label":"account of current user","aria-controls":"primary-search-account-menu","aria-haspopup":"true",color:"inherit"},r.a.createElement(Ue.a,null)),r.a.createElement("p",null,"Profile")),r.a.createElement(re.a,null,E)),v=a.map((function(e){return r.a.createElement(et,{key:e.id,notification:e})})),b=r.a.createElement(Je.a,{anchor:"right",open:d,onClose:f(!1)},r.a.createElement("div",{className:i.list,role:"presentation",onClick:f(!1),onKeyDown:f(!1)},r.a.createElement($.a,null),r.a.createElement(q.a,{className:i.drawerTitle,variant:"h6"},"Notifications:"),r.a.createElement($.a,null),r.a.createElement(Me.a,null,v)));return r.a.createElement("div",{className:i.grow},r.a.createElement(Ie.a,{position:"static"},r.a.createElement(Ne.a,null,r.a.createElement("a",{className:i.logo,href:"#",onClick:function(){t?rt.push("/home"):rt.push("/")}},r.a.createElement("img",{src:"logo.svg",alt:"logo",className:i.logo})),r.a.createElement(q.a,{className:i.title,variant:"h6",noWrap:!0,component:"a",href:"#",onClick:function(){t?rt.push("/home"):rt.push("/")}},"DM Project"),t?r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:i.search},r.a.createElement("div",{className:i.searchIcon},r.a.createElement(Fe.a,null)),r.a.createElement(Ce.a,{placeholder:"Search\u2026",classes:{root:i.inputRoot,input:i.inputInput},inputProps:{"aria-label":"search"}})),r.a.createElement("div",{className:i.grow}),r.a.createElement("div",{className:i.sectionDesktop},r.a.createElement(ve.a,{"aria-label":"show ".concat(n," new notifications"),color:"inherit",onClick:f(!0)},r.a.createElement(xe.a,{badgeContent:n,color:"secondary"},r.a.createElement(We.a,null))),r.a.createElement(ve.a,{edge:"end","aria-label":"account of current user","aria-controls":"primary-search-account-menu","aria-haspopup":"true",onClick:function(){},color:"inherit"},r.a.createElement(Ue.a,null)),E),r.a.createElement("div",{className:i.sectionMobile},r.a.createElement(ve.a,{"aria-label":"show more","aria-controls":"primary-search-account-menu-mobile","aria-haspopup":"true",onClick:function(e){s(e.currentTarget)},color:"inherit"},r.a.createElement(He.a,null)))):r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:i.grow}),r.a.createElement(M.a,{variant:"contained",color:"secondary",disableElevation:!0,onClick:function(){rt.push("/signup")}},"Signup"),r.a.createElement(M.a,{color:"inherit",disableElevation:!0,onClick:function(){rt.push("/login")}},"Login")))),h,b)})),nt=a(439),rt=Object(c.a)();var it=Object(u.b)((function(e){return{username:e.profile.user.username,alerts:e.alerts}}),(function(e){return{onTryAutoSignup:A}}))((function(e){return Object(n.useEffect)(e.onTryAutoSignup()),r.a.createElement(l.b,{history:rt},r.a.createElement(nt.a,{theme:Ge},r.a.createElement(at,null),r.a.createElement(Te,{alerts:e.alerts}),r.a.createElement(Ee,null)))}));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var ot=a(53),lt=a(230),ct={token:void 0,loading:!1},st=function(e,t){return _(e,{loading:!0})},ut=function(e,t){return _(e,{token:t.token,loading:!1})},mt=function(e,t){return _(e,{loading:!1})},dt=function(e,t){return _(e,{token:void 0})},pt=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ct,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"AUTH_START":return st(e);case"AUTH_SUCCESS":return ut(e,t);case"AUTH_ERROR":return mt(e);case"AUTH_LOGOUT":return dt(e);default:return e}},ft=a(234),gt=a(231),Et=a.n(gt),ht=[],vt=function(e,t){return window.scrollTo(0,0),[].concat(Object(ft.a)(e),[{text:t.text,style:t.style,id:Et()()}])},bt=function(e,t){return e.filter((function(e){return e.id!==t.id}))},Ot=function(e,t){return ht},St=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ht,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_ALERT":return vt(e,t);case"REMOVE_ALERT":return bt(e,t);case"REMOVE_ALL_ALERTS":return Ot();default:return e}},wt={id:"",picture:"",score:0,carSet:[],averageVote:0,receivedFeedback:[],givenFeedback:[],user:{},loading:!1},yt=function(e,t){return _(e,{loading:!0})},Tt=function(e,t){var a=t.id,n=t.user,r=t.picture,i=t.score,o=t.carSet,l=t.averageVote,c=t.receivedFeedback,s=t.givenFeedback;return _(e,{loading:!1,id:a,picture:r,score:i,carSet:o,averageVote:l,receivedFeedback:c,givenFeedback:s,user:n})},_t=function(e,t){return _(e,{loading:!1,action:t})},It=function(e,t){return _(e,{loading:!1})},Nt=function(e,t){var a=t.id,n=t.firstName,r=t.lastName,i=t.email,o=e.user;return o.id=a,o.firstName=n,o.lastName=r,o.email=i,_(e,{loading:!1,user:o})},kt=function(e,t){return wt},Rt=function(e,t){var a=t.id,n=t.name,r=t.totSeats,i=t.fuel,o=t.consumption;return e.carSet.push({id:a,name:n,totSeats:r,fuel:i,consumption:o}),e.loading=!1,e},jt=function(e,t){var a=t.id,n=t.name,r=t.totSeats,i=t.fuel,o=(t.consumption,e.carSet.findIndex((function(e){return e.id===a})));return e.carSet[o].name=n,e.carSet[o].totSeats=r,e.carSet[o].fuel=i,e.carSet[o].consumption=i,e.loading=!1,e},Ct=function(e,t){var a=e.carSet.filter((function(e){return e.id!==t}));return _(e,{carSet:a,loading:!1})},xt=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:wt,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"PROFILE_OP_START":return yt(e);case"GET_PROFILE_SUCCESS":return Tt(e,t);case"PROFILE_PICTURE_UPDATE":return _t(e,t);case"PROFILE_OP_ERROR":return It(e);case"USER_DATA_UPDATE":return Nt(e,t);case"CLEAR_PROFILE_DATA":return kt();case"CAR_CREATE":return Rt(e,t);case"CAR_UPDATE":return jt(e,t);case"CAR_DELETE":return Ct(e,t);default:return e}},Pt={loading:!1,notifications:[]},At=function(e,t){return _(e,{loading:!0})},Ft=function(e,t){return _(e,{loading:!1})},Lt=function(e,t){return _(e,{notifications:t})},Ut=function(e,t){var a=t.id,n=(t.read,e.notifications.findIndex((function(e){return e.id===a})));return e.notifications[n].read=t,e},Dt=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Pt,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"NOTIFICATIONS_START":return At(e);case"NOTIFICATIONS_ERROR":return Ft(e);case"GET_NOTIFICATIONS_SUCCESS":return Lt(e,t);case"NOTIFICATION_UPDATE":return Ut(e,t);case"CLEAR_NOTIFICATIONS":return Pt;default:return e}},Wt=Object(ot.c)({auth:pt,alerts:St,profile:xt,notifications:Dt}),Bt=[lt.a],Ht=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||ot.d,qt=Object(ot.e)(Wt,{},Ht(ot.a.apply(void 0,Bt)));o.a.render(r.a.createElement(u.a,{store:qt},r.a.createElement(it,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[247,1,2]]]);
//# sourceMappingURL=main.5ed571c0.chunk.js.map