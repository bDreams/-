/*
 * @Author: bDreams
 * @Date:   2016-05-09 16:41:31
 * @Last Modified by:   bDreams
 * @Last Modified time: 2016-05-10 15:00:31
 */

'use strict';

(function(win, doc, $, undefined) {
    /**
     * 拖拽函数 
     * 使用此方法时只有按住拖拽框的标题部分时才可以进行拖拽：即拖拽框的第一个直接子元素
     * 
     * @param  {object} config 配置参数
     *         config:{
     *             globle: true | false 全局（拖动时是按住整个框还是只是标题部分）默认false
     *             mask: true | false 是否创建遮罩层 默认true
     *         }
     * @return {undefined}  no void
     */

    $.fn.drag = function(config) {
        this.each(function(index, item) {
            // 设置默认配置参数
            var defaultConfig = {
                globle: false,
                mask: true
            };
            setDefaultStyle($(item));

            $.extend(defaultConfig, config);
            dragFn($(item).children().eq(0), defaultConfig);
        });
        /**
         * 拖拽时做的操作
         * @param  {object} tempObj 当拖拽时按下的元素
         * @return {undefined}         no void
         */
        function dragFn(tempObj, config) {

            config.globle ? tempObj = tempObj.parent() : tempObj;

            tempObj.on('mousedown', function(e) {
                e.preventDefault();
                config.mask && createMask();
                // 设置按下时鼠标形状为move
                tempObj.css({
                    cursor: 'move'
                });
                var mX = e.pageX,
                    mY = e.pageY,
                    $parent = config.globle ? tempObj : tempObj.parent(),
                    disX = mX - $parent.offset().left,
                    disY = mY - $parent.offset().top,
                    w = $parent.outerWidth(),
                    h = $parent.outerHeight(),
                    zIndex = $parent.css('zIndex'),
                    rD = win.innerWidth - w,
                    rH = win.innerHeight - h;
                // 按下时让当前的拖拽元素置顶，有多个拖拽元素时，防止被遮住    
                $parent.css({
                    zIndex: ++zIndex
                });
                $(doc).on('mousemove', function(e) {
                    e.preventDefault();
                    var mX = e.pageX,
                        mY = e.pageY;
                    $parent.css({
                        left: mX + w / 2 - disX,
                        top: mY + h / 2 - disY
                    });

                    // 限制拖拽框
                    var l = $parent.offset().left;
                    var t = $parent.offset().top;
                    l <= 0 ? ll('left', w) : '';
                    l >= rD ? ll('left', w, rD) : '';
                    t <= 0 ? ll('top', h) : '';
                    t >= rH ? ll('top', h, rH) : '';
                });
                $(doc).on('mouseup', function() {
                    // 鼠标抬起时，解除事件绑定
                    $(doc).off('mousemove');
                    $(doc).off('mouseup');
                    // 鼠标抬起的时候让zIndex值返回初始值，防止多次点击拖动BUG
                    setDefaultStyle($parent);
                    // 移除遮罩层
                    removeMask();
                });
                // 限制拖拽框执行的操作
                function ll(attr, v, dis) {
                    dis = dis ? dis : 0;
                    $parent.css({
                        [attr]: dis + v / 2
                    });
                };
            });
        };

        /**
         * 创建遮罩层
         * @return {undefined} no void
         */
        function createMask() {
            var mask = $('<div id="mask" style="position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,0.5);z-index:9998;"></div>');
            $('body').append(mask);
        };

        // 移除遮罩层
        function removeMask() {
            $('#mask').remove();
        };
        /**
         * 设置拖拽框的默认样式
         * @param {jq对象} o 拖拽框
         */
        function setDefaultStyle(o) {
            o.css({
                zIndex: 9999,
                cursor: 'default'
            });
        };
    };
})(window, document, jQuery);
