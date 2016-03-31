import can from "can";

import Mousewheel from "../../vendor/svg/jquery.mousewheel";
import svgPanZoom from "../../vendor/svg/svg-pan-zoom";
import canvg from "../../vendor/svg/canvg/canvg";

import SiteController from "../controller/SiteController";

import "../../assets/css/sd-content.css!";
import "../../assets/css/markdown.css!";

export default can.Component.extend({
	tag: 'sd-content',
	template: can.view('templates/content.mustache'),
	viewModel: {
		strings: sharpDox.strings,
		disqusShortName: sharpDox.projectData.disqusShortName,
		setTitle: function() {
			if(this.site.attr('currentPageType').isArticle){
				document.title = sharpDox.projectData.name + " - " + this.site.attr('currentPage').title;
			}
			else if(this.site.attr('currentPageType').isNamespace || this.site.attr('currentPageType').isType){
				document.title = sharpDox.projectData.name + " - " + this.site.attr('currentPage').name;
			}
			else{
				document.title = sharpDox.projectData.name;
			}
		},
		initDisqus: function() {
			if(this.attr('disqusShortName') != null){
				window.disqus_title = document.title;
				window.disqus_url = window.location.href;
				var dsq = document.createElement('script'); 
				dsq.type = 'text/javascript'; 
				dsq.async = true;
				dsq.src = 'http://' + sharpDox.projectData.disqusShortName + '.disqus.com/embed.js';
				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
			}
		},
		setHighlight: function(){
      		$('#syntax').html($('#dummy-syntax').html()); //because of Prism the syntax will not update. So i have to do a dummy bind and copy the value to the syntax box.
	        Prism.highlightAll();
		},
		setLinks: function(){
			$('a').filter(function() {
	      	   return this.hostname && this.hostname !== location.hostname;
	      	}).attr("target","_blank");
		},
		hideLoader: function(){
			$('sd-loader').fadeOut();
		},
		setSvg: function(){
			$.each($('.svgpan'), function (index, value) {
	            var parentId = $(value).attr('id');
				var fit = $(value).attr('data-fit');

	            var id = "#" + parentId + " svg";
	            svgPanZoom(id, { fit: (fit == "True") });
	        });
		},
		setSvgLinks: function(){
			$('.resetZoom').click(function () {
	            var svgPan = svgPanZoom("#" + $(this).parent().prev().attr('id') + " svg");
	            svgPan.resetZoom();
	            svgPan.center();
	        });
			
			var gotClicked = false;
	        $('.save a').click(function (event) {
	            if ($(this).attr('href') == "#") //just create diagram one time
	            {
					event.preventDefault();
	                var svgPan = svgPanZoom("#" + $(this).parent().parent().prev().attr('id') + " svg");
	                svgPan.resetZoom();
	                svgPan.center();
	
	                var isClassDiagram = $(this).parent().parent().prev().attr('id') == "sd-class-diagram";
	                gotClicked = false; //set gotClicked to false
	
	                var bbox = $($(this).parent().parent().prev().children()[0])[0].getBBox();
	                var svgData = "<svg xmlns='http://www.w3.org/2000/svg' width='" + (bbox.width + 10) + "' height='" + (bbox.height + 55) + "'>" + $($($($(this).parent().parent().prev()).children()[0]).children()[0]).html().trim() + "</svg>";
	
	                var link = this;
	                var canvas = document.createElement('canvas');
	                canvg(canvas, svgData, {
	                    renderCallback: function () {
	                        var png_dataurl = canvas.toDataURL();
	                        link.download = "diagram.png";
	                        link.href = png_dataurl;
	
	                        //Diagrams get not downloaded automatically - workaround
	                        if (!gotClicked) {
	                            gotClicked = true;
	                            link.click();
	                        }
	                    }
	                });
	            }
	        });
		}
	},
	events: {
		"inserted": function(){
			this.viewModel.attr('site', this.viewModel.sitecontroller.site);
			var that = this;
			this.viewModel.sitecontroller.site.bind('currentPage', function(ev, newVal, oldVal){
				setTimeout(function(){
					that.viewModel.setTitle();
					that.viewModel.setHighlight();
					that.viewModel.setLinks();
					
					that.viewModel.setSvg();
					that.viewModel.setSvgLinks();
					$('.member-content').css('display', 'none');	
					that.viewModel.initDisqus();
					
					that.viewModel.hideLoader();
				}, 500);
			});
		},
		".member-header click": function(header){
			var body = $(header).next();
		    body.slideToggle();
		
		    var icon = $($($(header).children()[0]).children()[0]);
		    if (icon.hasClass('icon-caret-right')) {
		        icon.removeClass('icon-caret-right');
		        icon.addClass('icon-caret-down');
		    }
		    else {
		        icon.removeClass('icon-caret-down');
		        icon.addClass('icon-caret-right');
		    }
		}
	}
});