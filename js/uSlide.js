(function( $ ) {
    var methods = {
        init : function(options){
            //settings
            var settings = $.extend( {
                'height':550,
                'spacing': 0,
                'duration': 200
            }, options);
            
            //run for each element
            return this.each(function(){
                var $this = $(this);
                //create the data block for each element
                $this.data('uslide', {});
                var data = $this.data('uslide');
                data["settings"] = settings;
                //style $this
                $this.css('overflow',"hidden");
                $this.height(settings.height);
                
                //move all children to a new div inside $this
                var children = $this.children();
                $this.append("<div class='container'></div>");
                var container = $this.find(".container");
                container.append(children);
                
                //helper function to resize the container
                function resizeContainer(el){
                    container.width(container.width()+$(el).width()+settings.spacing);
                }
                
                children.each(function(index, child){
                    //set display to block and float
                    var $child = $(child);
                    $child.bind('click', function(){$this.uSlide("next");});
                    $child.css("float","left");
                    $child.css("display", "block");
                    $child.css("margin-right",settings.spacing+"px");
                    if($child.width()==0){//images or other elements might not have a width when the page is ready, so we must update the onload
                        //child.tagName.toLowerCase() == "img" &&
                        $child.load(function(){
                            resizeContainer(this);
                        });
                    }else{
                        resizeContainer(this);
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
            clone.bind('click', function(){$this.uSlide("next");});
            container.animate({"marginLeft":-firstChild.width()+data["settings"]["spacing"]}, data["settings"]["duration"], function(){
                firstChild.remove();
                container.css("marginLeft",0);
                data.isMoving = false;
            });
        },
        
        prev : function(){
            var $this = $(this);
            el.click(function(){
                $this.uSlide("next");
            });
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