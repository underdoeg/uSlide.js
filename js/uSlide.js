(function( $ ) {
    var methods = {
        init : function(options){
            //settings
            var settings = $.extend( {
                'height':550,
                'margin': 0
            }, options);
            
            //run for each element
            return this.each(function(){
                var $this = $(this);
                //create the data block for each element
                $this.data('uslide', {});
                var data = $this.data('uslide');
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
                    container.width(container.width()+$(el).width()+settings.margin);
                }
                
                children.each(function(index, child){
                    //set display to block and float
                    var $child = $(child);
                    $child.css("float","left");
                    $child.css("margin-right",settings.margin+"px");
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
            var data = $this.data('uslide');
        },
        
        prev : function(){
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