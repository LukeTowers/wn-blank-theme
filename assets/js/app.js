/*
 * Application
 *
 */
(function($) {
    "use strict";

    jQuery(document).ready(function($) {
        /*-------------------------------
        OCTOBERCMS FLASH MESSAGE HANDLING
        ---------------------------------*/
        $(document).on('ajaxSetup', function(event, context) {
            // Enable AJAX handling of Flash messages on all AJAX requests
            context.options.flash = true;

            // Enable the StripeLoadIndicator on all AJAX requests
            context.options.loading = $.oc.stripeLoadIndicator;

            // Handle Flash Messages
            context.options.handleFlashMessage = function(message, type) {
                $.oc.flashMsg({ text: message, class: type });
            };

            // Handle Error Messages
            context.options.handleErrorMessage = function(message) {
                $.oc.flashMsg({ text: message, class: 'error' });
            };
        });

        /*-----------------------------
         MENU HANDLING JS
         ------------------------------*/
         // Cache references
         var $html = $(document.getElementsByTagName("html")[0]),
             $enable_site = $('.enable-site-trigger');

         // Toggle Opening and Closing of the navigation container
         function toggle_menu() {
             $html.toggleClass('disable-scroll');
             $('.navigation_container').toggleClass('open');
             $enable_site.toggleClass('active');
         }

         $('.btn-menu').click(function(e) {
             e.preventDefault();
             toggle_menu();
         });

         $enable_site.on('click', function(e) {
             e.preventDefault();
             toggle_menu();
         });

         // Toggle display of the sub menu
         $('.sub-menu-button').click(function(e) {
             e.preventDefault();
             e.stopPropagation();
             $(this).parent().next().slideToggle("fast");
             $(this).toggleClass('active');
         });

         $('.menu-item-has-children a[href="javascript:;"]').on('click', function(e) {
             e.preventDefault();
             $(this).closest('.menu-item-has-children').siblings().children('.menu-item-block-container').slideUp("fast");
             $(this).closest('.menu-item-has-children').siblings().find('.sub-menu-button').removeClass("active");
             $(this).next().slideToggle("fast");
             $(this).children('.sub-menu-button').toggleClass('active');
         });

         // Handle the ID/hash scrolling
         var busy = false;
         function navigation_scroll() {
             if (busy) { return false; }
             if (location.hash) {
                 var hashName = location.hash.substring(1, location.hash.length);
                 var target = $('[data-scroll-target='+hashName+']:first');
                 if (target.length) {
                     busy = true;
                     var scroll_pos = target.offset().top - 150;
                     if ($('html, body').scrollTop() !== scroll_pos) {
                         $('html, body').animate({ scrollTop: scroll_pos}, 500, function() { busy = false; });
                     }
                 }
             }
             return false;
         }
         $('.menu-item a[href*="#"]').on('click', function(e) {
             // Detect if this is the current page and scroll to the element if so. Otherwise, continue on to the proper page
             // - NOTE: Does not take other potential additions to the href like ? or & into account.
             toggle_menu();
             var href_pathname = $(this).attr('href').split('#');
             if (href_pathname[1] === window.location.hash.split('#')[1]) { // Only perform check when the chosen href hash is the same as the current one, otherwise our hashchange event can handle it
                 if (href_pathname[0] === window.location.pathname || href_pathname === '') {
                     e.preventDefault();
                     toggle_menu();
                     navigation_scroll();
                 }
             }
         });
         $(window).on('hashchange', function(e) {
             e.preventDefault();
             navigation_scroll();
         });
         $(window).trigger('hashchange');


         /*-----------------------------
          ANIMATION JS
          ------------------------------*/
         var $window = $(window),
             $toAnimate = $('[data-animate]:not(.animated)');

         function isElementInRange($elem, top, bottom) {
             // Get the position of the element on the page.
             var elemTop = Math.round($elem.offset().top);
             var elemBottom = elemTop + $elem.height();

             return ((elemTop < bottom) && (elemBottom > top));
         }

         // Check if it's time to start the animation.
         window.checkAnimation = function(refresh) {
             if (refresh) {
                 $toAnimate = $('[data-animate]:not(.animated)');
             }

             // Get the scroll position of the page
             var viewportTop = $window.scrollTop(),
                 viewportBottom = viewportTop + $window.height();

             $toAnimate.each(function (i, e) {
                 var $e = $(e);
                 if ($e.hasClass('animated')) {
                     return;
                 }

                 if (isElementInRange($e, viewportTop, viewportBottom)) {
                     $e.addClass('animated fadeInUp');
                 }
             });
         }

         if ($toAnimate.length) {
             // Capture scroll events
             $window.scroll(function(){
                 checkAnimation();
             });

             checkAnimation();
         }
    });
}(jQuery));

if (typeof(gtag) !== 'function') {
    gtag = function() { console.log('GoogleAnalytics not present.'); }
}
