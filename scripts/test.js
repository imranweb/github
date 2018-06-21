// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*
    @desc Custom Easing Functions
*/

(function () {

    // based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

    var baseEasings = {};

    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (i, name) {
        baseEasings[name] = function (p) {
            return Math.pow(p, i + 2);
        };
    });

    $.extend(baseEasings, {
        Sine: function (p) {
            return 1 - Math.cos(p * Math.PI / 2);
        },
        Circ: function (p) {
            return 1 - Math.sqrt(1 - p * p);
        },
        Elastic: function (p) {
            return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
        },
        Back: function (p) {
            return p * p * (3 * p - 2);
        },
        Bounce: function (p) {
            var pow2,
                bounce = 4;

            while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
            return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
        }
    });

    $.each(baseEasings, function (name, easeIn) {
        $.easing["easeIn" + name] = easeIn;
        $.easing["easeOut" + name] = function (p) {
            return 1 - easeIn(1 - p);
        };
        $.easing["easeInOut" + name] = function (p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    });

})();

// Sharing sessionStorage between tabs for secure multi-tab authentication 
// For All Funds and Tracked Funds
(function() {

    try { 
        if (!sessionStorage.length) {
            // Ask other tabs for session storage
            localStorage.setItem('getSessionStorage', Date.now());
        }
    } catch (e) {
         console.error('You are in Private Browsing mode');
    }

    
    
    window.addEventListener('storage', function(event) {
        //console.log('storage event', event);
        
        if (event.key == 'getSessionStorage') {
            // Some tab asked for the sessionStorage -> send it
            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            localStorage.removeItem('sessionStorage');
            
        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
            // sessionStorage is empty -> fill it
            var data = JSON.parse(event.newValue);
            
            for (key in data) {
                sessionStorage.setItem(key, data[key]);
            }
            
            //showSessionStorage();
        }
    });
    
    /*window.onbeforeunload = function() {
        //sessionStorage.clear();
    };*/
    
})();

var LA = LA || {};

(function ($, ns, undefined) {
    if ($ === undefined) {
        console.log("jQuery not found");
        return false;
    }

    var handleAjaxRequest = {
        init: function () {
            ns.utility.COOKIE.deleteCookie("isPageReload"); // This will remove the isPageReload
            this.bindEvents();
        },
        bindEvents: function () {
            $(window).bind('beforeunload', function () {
                ns.utility.COOKIE.setCookie("isPageReload", true, 1);
            });
        }
    };

    ns.handleAjaxRequest = {};
    ns.handleAjaxRequest.init = function () {
        handleAjaxRequest.init();
    }

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    ns.debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    ns.handleAjaxError = function (errorCode, errorMessage) {
        if (typeof ns.utility.COOKIE.getCookie("isPageReload") === "undefined") {
            if (errorCode === "lateral") {
                commonjs.popupOpen(".js_checkout_500", window);
            } else if (errorCode === "infinata") {
                commonjs.popupOpen(".js_infinata_500", window);
            } else {
                commonjs.popupOpen(".js_error500", window);
            }
        }
    };
    ns.applyEllipsis=function(ele,cnt){
        var _elements=$(ele);
            _elements.each(function(index,item){
                $clamp(item, { clamp: cnt, useNativeClamp: true });
            });
    };
    
            ns.mobileAccrodion =function(){
            
                    var activepanel=false;
                    if($('.sf-detail').length){activepanel=0}
                var headerH = $("#mainHeader").height();
                var tabWrp = $(".tab-content-wrp");
                tabWrp.accordion({

                   collapsible: true,
                   active: activepanel,
                   autoHeight: false,
                   animate: false,
                   activate: function(event, ui) {
                        
                        setTimeout(function() {
                            var head = tabWrp.find(".ui-accordion-header-active");
                            var topVal = tabWrp.parent().offset().top - headerH -1;
                            if(head.length> 0) {                            
                                topVal = head.next().offset().top - (headerH + head.outerHeight());
                                //console.log(head.next().offset().top+">>"+head.outerHeight()+"==="+head.text()+"???"+tabWrp.offset().top);
                            }                   
                            $("html, body").animate({ scrollTop: topVal }, {
                                     complete: function(){
                                        // $("body").removeClass("sticky-1");
                                    }
                                });         
                                
                        }, 30);

                        $(window).trigger("resize");
                   }
            
                  /* autoHeight: false,*/
                });
            return;     
        },
            ns.tabLinkScroll=function () {
            // Cache selectors
            var defaultTab = "#la_tab_overview",
                hType = window.location.hash.substr(1),
                lastId,
                scrollTime = 1000,
                topMenu = $(".tab-scroll .tabs"),
                fixedOffset, topMenuHeight, bookMarkOffset;

            // All list items
                menuItems = topMenu.find("a"),
            // Anchors corresponding to menu items
                scrollItems = menuItems.map(function(){
                    var item = $($(this).attr("href"));
                    if (item.length) { return item; }
                });


            if(LA.isMobile().any() == true) {
                fixedOffset = 200; //150 - Desktop , 200 - iPad
            } else { fixedOffset = 150; }
            topMenuHeight = topMenu.outerHeight()+fixedOffset;

            // Bind click handler to menu items
            // so we can get a fancy scroll animation
            menuItems.parent('li').on('click touch',function(e){
                $(this).find('a').trigger('click');
            });
            menuItems.click(function(e){
                var href = $(this).attr("href"),
                    offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;

                $('html, body').stop().animate({
                    scrollTop: offsetTop+10
                }, scrollTime);
                //window.location.hash = href;
                e.preventDefault();
                e.stopPropagation();
            });

            

            // Bind to scroll
            $(window).scroll(function(){
               
                var curTab = "#"+window.location.hash.substr(1);
                // Get container scroll position
                var fromTop = $(this).scrollTop()+topMenuHeight;
                // Get id of current scroll item
                var cur = scrollItems.map(function(){
                    if ($(this).offset().top < fromTop)
                        return this;
                });
                // Get the id of the current element
                cur = cur[cur.length-1];
                var id = cur && cur.length ? cur[0].id : "";
                if (lastId !== id) {
                    lastId = id;
                    // Set/remove active class
                    menuItems
                        .parent().removeClass("active")
                        .end().filter(".tab-scroll .tabs [href=#"+id+"]").parent().addClass("active");
                    //console.log(hType+" -- "+id+" -- "+curTab);
                    if(id!=="") {
                        //window.location.hash = "#"+id;
                        if(history.pushState) {
                            history.pushState(null, null, "#"+id);
                        }
                        else {
                            window.location.hash = "#"+id;
                        }
                    }
                    if(hType!=="" && id==="") {
                        //console.log("Bookmark URL");
                        $('.tab-scroll .tabs [href="'+curTab+'"]').parent().addClass('active');
                    } else if(id === "" || id === defaultTab) {
                        $('.tab-scroll .tabs [href="'+curTab+'"]').parent().addClass('active');
                        //window.location.hash = defaultTab;
                    }
                }
            });

            $(document).ready(function() {
                if (window.location.hash.substr(1) == "") {
                    setTimeout(function(){
                        $('.tab-scroll .tabs [href=#la_tab_overview]').parent().addClass('active');
                    }, 100);
                } else {
                   if($('.tabs-wrp').length > 0){
                    var href = "#" + window.location.hash.substr(1);
                    if (href !== defaultTab) {
                        if (href !== "#") {
                            // Bookmarked Hash URL Position Scroll
                            if (LA.isMobile().any() == true) {
                                bookMarkOffset = 230;
                            } else {
                                bookMarkOffset = 185;
                            }
                            setTimeout(function() {
                                $('html, body').stop().animate({
                                    scrollTop: $(href).offset().top - bookMarkOffset
                                }, scrollTime)
                            }, 300);
                        } else if (href === "#") {
                            $('.tab-scroll .tabs [href="' + defaultTab + '"]').parent().addClass('active');
                        } else {
                           $('.tab-scroll .tabs li').parent().removeClass('active');
                            $('.tab-scroll .tabs [href="' + href + '"]').parent().addClass('active');
                        }
                    } else {
                        // Avoid Scroll for hash URL of first tab
                        $('.tab-scroll .tabs [href="' + defaultTab + '"]').parent().addClass('active');
                        setTimeout(function() {
                            $('html, body').animate({
                                scrollTop: $('html, body').offset().top
                            }, 100)
                        }, 100);

                    }}
                }
                
            });

            // View Links from Other Tabs and Feature Content
            $(document).on('click', 'a.refLink', function(e){
                $('html, body').animate({
                    scrollTop: $($(this).attr("href")).offset().top-185
                }, 1000);
                e.preventDefault();
                e.stopPropagation();
            });
        },

    ns.setMobileShare=function(){
        
                    $(".mobile-share").click(function() {
                    $("#overlayContent").show();
                    $(".social_icons_all").show();
                });

                $(".social_icons_all .close-btn").click(function() {
                    $("#overlayContent").hide();
                    $(".social_icons_all").hide();
                });
    },
    ns.activateTab=function(){
        var hashVal=getHashValues();
        if(hashVal){
            if(hashVal[0].indexOf('la_tab') > -1){
                var tabId=hashVal[0].replace('la_',''),
                index=$('.la_tabs_black').find('li#'+tabId).index();
                if(index > -1){
                    $('.la_tabs_black .js_ui_tabs').tabs({'active': index});
                }
            }
            else{
                return;
            }
        }
        
    },
    ns.heightIframe=function(iframe){
          // Create IE + others compatible event handler
          var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
          var eventer = window[eventMethod];
          var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
          // Listen to message from child window
          eventer(messageEvent,function(e) {
            var key = e.message ? "message" : "data";
            var data = e[key];
            iframeElem = document.getElementById(iframe);                
              if ($(iframeElem).length){
                iframeElem.style.height = data+'px';
              }
          },false);
    }
    $('.link_registration_overlay').on('click', function (evt) {
        evt.preventDefault();
        var $this = $(this),
            dataURI = $this.attr('href');
        $('.microsite_registration').remove();
        
        if (!$('.microsite_registration').length) {

            $.ajax({
                url: dataURI,
                dataType: "html",
                success: function (response) {
                    var $response = $(response);
                    var responseVal = $response.filter('.microsite_details');
                    $('body').append(responseVal);

                    setTimeout(function () {
                        commonjs.popupOpen(".microsite_registration", window);
                        var micrositeRegistration = $(".microsite_registration"),
                            selectBox = micrositeRegistration.find('select');
                        ns.utility.autoclear();
                        if (selectBox.length) {
                            selectBox.wrap("<div class='la_dropdown js_la_dropdown' />")
                            ns.utility.customSelectBox(selectBox);
                        }

                        if ($('input[name=reset_Button]').length) {
                            $('input[name=reset_Button]').replaceWith('<input type="reset" class="form_button_submit aButton grnBtn" name="reset_Button" value="RESET">');
                        }

                    }, 300);
                    $(".microsite_registration form").validationEngine({ // Login Modal: starts
                    scroll: false,
                    dataType:'text',
                    promptPosition:'centerRight'        
                });
                
                },
                error: function () {
                    console.log("ajax was not succesful");
                }
            });
        } else {            
            commonjs.popupOpen(".microsite_registration", window);
        }
    });
    
    


})(window.jQuery, LA);

function SetIFrameSource(cid, url){
  var myframe = document.getElementById(cid);
  if(myframe !== null){
    if(myframe.src){
      myframe.src = url; }
    else if(myframe.contentWindow !== null && myframe.contentWindow.location !== null){
      myframe.contentWindow.location = url; }
    else{ 
      myframe.setAttribute('src', url); 
    }
  }
}

function emailForm() {
    setTimeout(function(){  siteCatalystTrackOffsite('email');  },1000);
    var url = location.href,
        title = email_topicon;
    title = title.replace(/\&#8212;/g, '-')
        .replace(/\&nbsp;/g, " ");
    var subject = encodeURIComponent(title).replace(/\%u2014/g, "-")
        .replace(/\%u2019/g, "\'");
    var body_message = escape(url);
    var mailto_link = 'mailto:?subject=' + subject + '&body=' + body_message;
    window.location = mailto_link;
}
/*
function bindPDFEngagement(){


    var pdfLinks="a[href$='.pdf']";

    $(document).on('click',pdfLinks,function(){

      var onclickFn=$(this).attr('onclick'),
      indexPDF=-1;
      if(onclickFn){
         var indexPDF=onclickFn.indexOf('trackSiteCatalystfundDownload');
      }
     
      if(indexPDF<0){
        var pdfName=$(this).text();

         trackSiteCatalystfundDownload(pdfName);
      }

    })


}
*/
// External link Dialog Starts here -LAS-219
$(document).ready(function() { 
     var laInternaluser=$.cookie("IS_LA_INTERNAL");
    /*Calling LiteLogin and checking for condition to enable in design or preview mode only */
     if(typeof enableLiteLoginValue != "undefined" && enableLiteLoginValue=="true" && laInternaluser!="TRUE"){
       if(!($("body").hasClass('cq-wcm-edit'))){
          LA.liteLogin({width: 540 , height:253,position: 'top',textbodyHeight:200});
       } 
    }
    LA.heightIframe('subscribeIframe');

                var acchead=$('.level2_link>h3')
                $('.sitemap .level1_link').accordion({
                    header:acchead,
                   collapsible: true,
                   active: false,
                   autoHeight: false,
                   animate: false
                });
    $('.sitemap_page').find('.inBlock').eq(0).find('.ui-accordion-header').eq(0).click()
   
    if($('.mobile-share').length)LA.setMobileShare();
    $(document).on("click",".linkExternal", function(e){
        var $this = $(this),
        $main = $this.parent("h5").next("div.hideit"),
        $content = $main.find(".externalContent"),
        url = $this.data("rel"),
        title = $main.find(".overlayTitle").val(),
                originalContent = $main.html();

                                                                
        $content.dialog({
                    modal: true,
                    dialogClass: "disclosure_overlay",
                    draggable: false,
                    resizable: false,
                    width: 1170,
                    title: title, //this is to be replaced by actual content                                    
                    open: function(event, ui){
                        $content.find(".btnContinue").on("click", function(){
                            if(url && url.length){
                                $content.dialog("close");
                                window.open(url, "_blank");
                                $('#headerNav .arrow').show();
                            }
                        }).end().find(".btnCancel").on("click",function(){
                                                $content.dialog("close");
                                                $('#headerNav .arrow').show();
                        });
                    },
                    close: function(event, ui){
                                         $main.html(originalContent);
                                         $('#headerNav .arrow').show();
                    }
        });
        $('.disclosure_overlay').css('z-index','500')
        $('#headerNav .arrow').hide();
    });
     // External link Dialog Ends here -LAS-219
    // Bind PDF engagement function for few PDF links which doesn't have onlick event
    
    $(document).on('mouseover touchstart','.contact-form-holder .ui-selectmenu',function(){
    /*Adjust 2px width of custom select menu ul LAS-1179*/
        var menuID=$(this).attr('aria-owns'),
            eleWid=$(this).width();
            $('#'+menuID).width(eleWid-2);
    });
    //bindPDFEngagement();
    
    // Remove all selected funds
    
    $(document).on('click','.fund-panel #removeAllFunds',function(){
        $('.fund-panel .listAll li input:checked').trigger('click');
    })


}); 

