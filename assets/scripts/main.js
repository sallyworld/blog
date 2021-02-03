var style = document.documentElement.style;

if (style && typeof style.tabSize != 'string') {
    hljs.configure({
        tabReplace: '  '
    });
}

hljs.initHighlightingOnLoad();

$(function() {

    common.global.contextPath = $('.global[name="contextPath"]').val();

    var Main = {

        load: function() {
            // var config = {
            //  startOnLoad: true,
            //  flowchart: {
            //      useMaxWidth: false,
            //      htmlLabels: false
            //  }
            // }

            mermaid.init(undefined, '.language-mermaid');
            this.show();
        },

        show: function() {
            var icon = common.global.header.find('[role="icon"]');
            var menu = common.global.header.find('[role="menu"]');
            var mask = common.global.header.find('[role="mask"]');

            icon.click(function() {
                $(this).toggleClass('icon-hamburger-close');

                if ($(this).hasClass('icon-hamburger-close')) {
                    menu.animate({
                        width: 'show',
                        padding: 'auto show',
                        opacity: 1
                    }, 500);

                    mask.show();
                } else {
                    menu.animate({
                        width: 'hide',
                        padding: 'auto hide',
                        opacity: 0
                    }, 500);

                    mask.hide();
                }
            });

            mask.click(function() { icon.trigger('click'); });
        }

    }

    common.import([
        common.global.contextPath + '/assets/scripts/global.js'
    ]).then(function() {
        Main.load();
    });

});
