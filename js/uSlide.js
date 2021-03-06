(function( $ ) {
    var methods = {
        init : function(options){
            //settings
            var settings = $.extend( {
                'height':550,
                'spacing': 0,
                'duration': 200,
                'easing': 'linear',
                'forwardOnClick': true,
                'onChange': undefined
            }, options);
            
            //run for each element
            return this.each(function(){

                var $this = $(this);
                //create the data block for each element
                $this.data('uslide', {});
                var data = $this.data('uslide');
                data["settings"] = settings;
                data["position"] = 0;
                //style $this

                $this.css('overflow',"hidden");
                $this.height(settings.height);
                
                //move all children to a new div inside $this
                var children = $this.children();
                $this.append("<div class='container'></div>");
                var container = $this.find(".container");
                container.append(children);
                
                children.each(function(index, child){
                    //set display to block and float
                    var $child = $(child);
                    if(data.settings.forwardOnClick == true)
                        $child.bind('click', function(){$this.uSlide("next");});
                    $child.css("float","left");
                    $child.css("display", "block");
                    $child.css("margin-right",settings.spacing+"px");
                    if($child.height()<settings.height)
                         $child.css("margin-bottom",(settings.height - $child.height())+"px");
                    if($child.width()==0){//images or other elements might not have a width when the page is ready, so we must update the onload
                        //child.tagName.toLowerCase() == "img" &&
                        $child.load(function(){
                            setTimeout(function(){$this.uSlide("update");}, 30); //not sure if this is a good idea but it fixed some issues with cached images and local websites
                        });
                    }else{
                        $this.uSlide("update");
                    }
                    //alert($(child).width());
                })
                
            });
        },
        
        next : function(){
            var $this = $(this);
            var container = $this.find(".container");
            var data = $this.data('uslide');
                            
            if($this.width()>=container.width())
                return;
            
            if(data.isMoving)
                return;
            
            data.isMoving = true;
            
            var firstChild = $(container.children()[0]);
            var clone = firstChild.clone();
            container.append(clone);
            if(data.settings.forwardOnClick == true)
                clone.bind('click', function(){$this.uSlide("next");});
            container.animate({"marginLeft":-firstChild.width()+data.settings.spacing}, data.settings.duration, data.settings.easing, function(){
                firstChild.remove();
                container.css("marginLeft",0);
                data.isMoving = false;
                data["position"] += 1;
                if(data["position"] >= container.children().length)
                    data["position"] = 0;
                $this.uSlide("fireEvent");
            });
        },
        
        prev : function(){
            var $this = $(this);
            var container = $this.find(".container");
            var data = $this.data('uslide');
            
            if($this.width()>=container.width())
                return;
            
            if(data.isMoving)
                return;
            
            data.isMoving = true;
            
            var lastChild = $(container.children()[container.children().length-1]);
            var clone = lastChild.clone();
            container.prepend(clone);
            container.css("marginLeft", -1*(lastChild.width()+data.settings.spacing));
            if(data.settings.forwardOnClick == true)
                clone.bind('click', function(){$this.uSlide("next");});
            container.animate({"marginLeft":0}, data.settings.duration, data.settings.easing, function(){
                lastChild.remove();
                data.isMoving = false;
                data["position"] -= 1;
                if(data["position"] < 0)
                    data["position"] = container.children().length-1;
                $this.uSlide("fireEvent");
            });
        },
        
        update: function(){
            var $this = $(this);
            var data = $this.data('uslide');
            var container = $this.find(".container");
            var newWidth = 0;
            container.children().each(function(index, child){
                newWidth += $(child).width()+data.settings.spacing;
            });
            container.width(newWidth);
        },
        
        canMove: function(){
            return !($(this).width()>=$(this).find(".container").width());
        },

        fireEvent: function(){
            var $this = $(this);
            var data = $this.data('uslide');
            console.log
            if(data.settings.onChange != undefined){
                data.settings.onChange(data["position"]);
            }
        },

        getPosition: function(){
            var $this = $(this);
            var data = $this.data('uslide');
            return data["position"];
        }
    }
    
    $.fn.uSlide = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.uSlide' );
        }    
    };
})( jQuery );