/* eslint-disable react/no-danger */
import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => (
  <Html>
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window['_fs_debug'] = false;
            window['_fs_host'] = 'fullstory.com';
            window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
            window['_fs_org'] = '15RV3R';
            window['_fs_namespace'] = 'FS';
            (function(m,n,e,t,l,o,g,y){
                if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                g.anonymize=function(){g.identify(!!0)};
                g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                g.log = function(a,b){g("log",[a,b])};
                g.consent=function(a){g("consent",!arguments.length||a)};
                g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                g.clearUserCookie=function(){};
                g.setVars=function(n, p){g('setVars',[n,p]);};
                g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                g._v="1.3.0";
            })(window,document,window['_fs_namespace'],'script','user');
            `,
        }}
      />
      {/* <script
        dangerouslySetInnerHTML={{
          __html: `
        window.intercomSettings = {
          api_base: "${process.env.NEXT_PUBLIC_INTERCOM}",
          app_id: "${process.env.NEXT_PUBLIC_INTERCOM_KEY}",
        };
            `,
        }}
      /> */}

      <script
        dangerouslySetInnerHTML={{
          __html: `window.STONLY_WID = "${process.env.NEXT_PUBLIC_STONLY_KEY}";`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        !function(s,t,o,n,l,y,w,g){s.StonlyWidget||((w=s.StonlyWidget=function(){
          w._api?w._api.apply(w,arguments):w.queue.push(arguments)}).scriptPath=n,w.queue=[],(y=t.createElement(o)).async=!0,
          (g=new XMLHttpRequest).open("GET",n+"version?v="+Date.now(),!0),g.onreadystatechange=function(){
          4===g.readyState&&(y.src=n+"stonly-widget.js?v="+(200===g.status?g.responseText:Date.now()),
          (l=t.getElementsByTagName(o)[0]).parentNode.insertBefore(y,l))},g.send())
          }(window,document,"script","${process.env.NEXT_PUBLIC_STONLY}/widget/v2/");
        `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        !function(s,t,o,n,l,y,_){s.stonlyTrack||((_=s.stonlyTrack=function(){
          _._api?_._api.apply(_,arguments):_.queue.push(arguments)
          }).queue=[],(y=t.createElement(o)).async=!0,
          y.src=n,(l=t.getElementsByTagName(o)[0]).parentNode.insertBefore(y,l))
          }(window,document,"script","${process.env.NEXT_PUBLIC_STONLY}/tracker/stn.js");
          stonlyTrack('init', '${process.env.NEXT_PUBLIC_STONLY_KEY}');
        `,
        }}
      />
    </Head>
    <body>
      <Main />
      <NextScript />
      {/* <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/dzl5fev0';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
        `,
        }}
      /> */}
    </body>
  </Html>
);

export default Document;
