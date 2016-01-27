(function($){

    var CONTEXTMENU_PANEL_CSS="contextmenu-panel";
    var CONTEXTMENU_CHILDREN_PANEL_CSS="contextmenu-children-panel";
    var itemManger={};
    var _prefix="contextmenu-";


    /**
     * @author zhengchj
     * @mail CJ_Zheng1023@hotmail.com
     *
     * @param 目标对象
     * @param options 配置参数
     * @constructor  右键菜单类
     */
    var ContextMenu=function(target,options){
        var menuDefaults={
            id:"root",
            items:[],
            width:"100px",
            prefix:"contextmenu-"
        }
        this.panel;
        options=$.extend(menuDefaults,options||menuDefaults);
        _prefix=options.prefix;
        _createMenu(target,options,this);
    }

    $.extend(ContextMenu.prototype,{
        /**
         * @author zhengchj
         * @mail CJ_Zheng1023@hotmail.com
         *
         * @param id 菜单项唯一标识
         * @public 设置菜单项为不可用
         */
        setItemDisabled:function(id){
            this.panel.find("#"+_prefix+id).children("a.wrapper").addClass("disabled");
        },
        /**
         * @author zhengchj
         * @mail CJ_Zheng1023@hotmail.com
         *
         * @param id 菜单项唯一标识
         * @public 设置菜单项为可用
         */
        setItemEnabled:function(id){
            this.panel.find("#"+_prefix+id).children("a.wrapper").removeClass("disabled");
        }
    });

    /**
     * @author zhengchj
     * @mail CJ_Zheng1023@hotmail.com
     *
     * @param target 目标对象
     * @param options 配置项
     * @param contextMenu 菜单对象
     * @private 创建右键菜单
     */
    function _createMenu(target,options,contextMenu){
        $(target).bind({
            contextmenu:function(e){
                var me=$(this);
                if(!contextMenu.panel){
                    contextMenu.panel=$("<div></div>").addClass(CONTEXTMENU_PANEL_CSS).attr("id",_prefix+options.id).css("width",options.width);
                    $("body").append(contextMenu.panel);
                    _buildMenu(contextMenu.panel,options.items);
                }
                var x= e.pageX;
                var y= e.pageY;
                contextMenu.panel.css({
                    left:x,
                    top:y
                }).show().find("a.wrapper").removeClass("hover");
                return false;
            },
            click:function(){
                contextMenu.panel.hide();
                contextMenu.panel.find("."+CONTEXTMENU_CHILDREN_PANEL_CSS).hide();
            }
        })
    }

    /**
     * @author zhengchj
     * @mail CJ_Zheng1023@hotmail.com
     *
     * @param panel 菜单jquery对象
     * @param items 菜单项
     * @private 构建右键菜单
     */
    function _buildMenu(panel,items){
        var $container=$("<ul></ul>");
        var $item;
        for(var i= 0,len=items.length;i<len;i++){
            var itemObj=new Item(items[i]);
            $item=itemObj.create();
            if(items[i].children){
                itemObj.buildChildren(items[i].children);
            }
            $container.append($item);

        }
        panel.append($container);
    }

    /**
     * @author zhengchj
     * @mail CJ_Zheng1023@hotmail.com
     *
     * @param options 菜单配置项
     * @constructor 菜单项类
     */
    var Item=function(options){
        var itemDefaults={
            id:"item",
            text:"",
            icon:"",
            hotkeys:[],
            children:[],
            action:function(item){},
            tip:"",
            enable:true
        };
        if(typeof options=="object"){
            this.options=$.extend(itemDefaults,options||itemDefaults);
        }else if(typeof options=="string"){
            this.options="-";
        }

        this.jqueryObj;
        this.childrenJqueryObj;

    }

    $.extend(Item.prototype,{
        /**
         * @author zhengchj
         * @mail CJ_Zheng1023@hotmail.com
         *
         * @returns {菜单项jquery对象}
         * @public 创建菜单项对象
         */
        create:function(){
            var me=this;
            if(me.options=="-"){
                return $("<li class='separate'></li>");
            }else{
                var $text=$("<span></span>").text(me.options.text);
                if(me.options.icon){
                    var $icon=$("<i></i>").addClass("fa").addClass("fa-"+me.options.icon);
                    $text.append($icon);
                }
                var $a=$("<a class='wrapper'></a>").append($text);
                if(!me.options.enable){
                    $a.addClass("disabled");
                }
                var $item=$("<li></li>").append($a).attr("id",_prefix+me.options.id);
                me.jqueryObj=$item;
                me.bindEvent();
                return me.jqueryObj;
            }

        },
        /**
         * @author zhengchj
         * @mail CJ_Zheng1023@hotmail.com
         *
         * @param children 子菜单项
         * @public 构建子菜单
         */
        buildChildren:function(children){
            var $childrenArea=$("<div></div>").addClass(CONTEXTMENU_CHILDREN_PANEL_CSS);
            var $container=$("<ul></ul>");
            var $item;
            for(var i=0,len=children.length;i<len;i++){
                var itemObj=new Item(children[i]);
                $item=itemObj.create();
                if(children[i].children){
                    itemObj.buildChildren(children[i].children);
                }
                $container.append($item);
            }
            $childrenArea.append($container);
            this.jqueryObj.children("a.wrapper").append("<i class='fa fa-chevron-right arrow'></i>").append($childrenArea);
            this.childrenJqueryObj=$childrenArea;
        },
        /**
         * @author zhengchj
         * @mail CJ_Zheng1023@hotmail.com
         * @public 绑定菜单项事件
         *
         */
        bindEvent:function(){
            var me=this;
            me.jqueryObj.delegate(">a.wrapper:not(.disabled)",{
                click:function(e){
                    me.options.action();
                    e.stopPropagation();
                },
                mouseenter:function(){
                    $(this).addClass("hover");
                    if(me.childrenJqueryObj){
                        me.childrenJqueryObj.css({
                            top:0,
                            left:me.jqueryObj.outerWidth()
                        }).show().find("a.wrapper").removeClass("hover");
                    }
                },
                mouseleave:function(){
                    $(this).removeClass("hover");
                    $(this).find("."+CONTEXTMENU_CHILDREN_PANEL_CSS).hide();
                }
            })
        }
    })














    $.fn.contextMenu=function(options){
        var me=this;
        return new ContextMenu(me,options);
    }



})(jQuery);