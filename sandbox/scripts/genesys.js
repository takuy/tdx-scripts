
jQuery(function() {
    jQuery.getScript("https://apps.mypurecloud.com/widgets/9.0/cxbus.min.js", function() {
        CXBus.configure({debug:false,pluginsPath:'https://apps.mypurecloud.com/widgets/9.0/plugins/'}); 
        CXBus.loadPlugin('widgets-core');
    });
    jQuery.getScript(
        "https://tuhelp.temple.edu/public/chatbottom.js", function() { 
        jQuery.getScript(
            "https://tuhelp.temple.edu/public/webmessaging.js", function() {
                window.initGenesys = function initGenesys() {
                    if(window.Genesys) {
                        return;
                    }

                    var id = "e51ca198-18ee-4891-9ae2-29627dd92c16" // dev deployment
                    const currentUrl = window.location.hostname;

                    if (currentUrl === "tuhelp.temple.edu") {
                        id = "6195ecc5-05bf-4e9b-a977-5bea319e7ee7" // prod deployment
                    }

                    (function (g, e, n, es, ys) {
                        g['_genesysJs'] = e;
                        g[e] = g[e] || function () {
                            (g[e].q = g[e].q || []).push(arguments)
                        };
                        g[e].t = 1 * new Date();
                        g[e].c = es;
                        ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
                        })(window, 'Genesys', 'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js', {
                        environment: 'use1',
                        deploymentId: id
                    });
                };
        });
    });
});


