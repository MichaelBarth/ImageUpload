//
var showWorkbench = function (image,callback){
		console.log("Workbench");
				var cropImg=$("#myImageUploadCropImg")[0];
				var realWidth=image.width;
				var realHeight=image.height;
				var aspectRatio=3/2;
				$("#myImageUploadCropButton")[0].callback=callback;
				$("#myImageUploadWorkbench").show();
				cropImg.onload=function(){
					$(cropImg).css("height","auto");
					// Jcrop laden	
					$(cropImg).Jcrop({
						aspectRatio:aspectRatio,
			        	setSelect:[0,0,realWidth,realWidth*aspectRatio],
			        	onSelect:updateCoord,
			        	onChange:updateCoord,
			        	},function(){
						jcrop_api=this;
						
						
						}
						);  
				
		       		
			   		
					
				};
				cropImg.src=image.src;
	};
			
// Aufruf: files=fileDialog({multiple:true, accept:image/*},function (files){alert(console.log(files)});
 var fileDialog = function(options,callback) {
	 console.log("fileDialog");
		// Default Arguemnte
		var default_arguments ={
			'type':'file',
			'multiple':false,
			'accept':'image/*'
		}
		
		// Fehlende Argzmente mit Default Werten ergänzen
		for (var index in default_arguments){
			if(typeof options[index]== 'undefined') options[index]=default_arguments[index];
		}
	 	var inputElement=$(document.createElement('input'));
	 
        inputElement.attr("type", "file");
        inputElement.attr("multiple", options.multiple);
        inputElement.attr("accept", options.accept);
       
        // Filemanager öffnen durch antriggern
        inputElement.trigger('click'); 
        // Datei laden	
        inputElement.on("change",function (event){
	        console.log("files"+event.target.files);  
        	callback(event.target.files);	
         	});         
};	

// readImageFile
var readImageFile = function (file,callback){
console.log("readImageFile");
	var reader=new FileReader();
	reader.onload = function(event){
		var image=new Image();
		image.onload = function(){
			//Sehr große Bilder verkleinern
			var aspectRatio=image.width/image.height;
			var canvas = document.createElement("canvas");
			canvas.width=1000;
			canvas.height=1000/aspectRatio;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			data=canvas.toDataURL("image/png", 1	);
		        image.onload=function(){
				callback(image);
        		};
			image.src=data;
			
			}; //image.onload
		
		 
		image.src=event.target.result;
	};
	reader.readAsDataURL(file);
};
			
var updateCoord = function(img){
	
img.cropWidth=$("#myImageUploadCropImg").width();
img.cropHeight=$("#myImageUploadCropImg").height();

a=$("#myImageUploadCropButton")[0];
a.img=img;


   
};

// cutImage
console.log("cutImage");
var cutImage = function (image,coord,callback) {
			var joptions=jcrop_api.getOptions();
			var aspectRatio=joptions.aspectRatio;
        	var canvas = document.createElement("canvas");
        	var cutImage= document.createElement("img");
        	f=image.width/coord.cropWidth;
        	
			canvas.width = Math.floor(coord.w*f);
			canvas.height = Math.floor(coord.h*f);
			
			var ctx = canvas.getContext("2d");
			
			
			ctx.drawImage(image, Math.floor(coord.x*f), Math.floor(coord.y*f), canvas.width, canvas.height,0,0,canvas.width,canvas.height);
			data=canvas.toDataURL("image/png", 1);
			cutImage.onload =function (){
			callback (cutImage);
			};
			
			cutImage.src=data;			
 		};
 		
var shrinkImage = function (image,maxSize,callback) {
	//console.log("shrinkImage");
			if(typeof maxSize=="undefined") maxSize="180";
        	var canvas = document.createElement("canvas");
			canvas.width = image.width *0.8;
			canvas.height = image.height *0.8;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			data=canvas.toDataURL("image/png", .5	);
			// 1331=130% von 1024 --> Das Bild wird am Ende beim Speichern wegen der Bas64decodierung ca. 30% kleiner
			while (data.length >maxSize*1350){
	      
	       shrinkImage (canvas,maxSize,callback);
	      
        }
        image.onload=function(){
	        callback(image);
        };
        image.src=data;
        
				
 		};


var saveImage = function (image,callback) {
	console.log("saveImage");
	if (image!=""){
	var canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	// Bilddaten in die Variable dataURL schreiben
	var imageData=image.src;

  // call upload.php and post the data
  
	$.ajax({
		type: "POST",
		url: "upload.php",
		data: {image: imageData}
		})
	 .done(function(respond ) {
	 	callback ( respond);
	 	});
	 	}
}; //saveCanvas



	
$(document).ready(function(){
		$("body").append("<div id='myImageUploadWrapper'></div>");

		$("#myImageUploadWrapper").load("workbench.html",function(){
		// Workbench verstecken
		$("#myImageUploadWorkbench").hide();
			$("#myImageUploadAspectRatio8_3").on ("click",function(){
				jcrop_api.setOptions({ aspectRatio: 8/3 });
				jcrop_api.focus();
				});
			// Buttons anbinden
					$("#myImageUploadCropButton").click(function(){
						jcrop_api.destroy();
						this.callback (this.img);
						$("#myImageUploadWorkbench").hide();
		       		});
		       		
		       		$("#myImageUploadAbortButton").on("click",function(){
			   			jcrop_api.destroy();
			   			// Blild löschen, damit beim erneuten Laden des gleichen Bildes onload ausgelöst wird
			   			//cropImg.src="";
			   			$("#myImageUploadWorkbench").hide();
					});
		       		
			$("#myImageUploadAspectRatio4_3").on ("click",function(){
				jcrop_api.setOptions({ aspectRatio: 4/3 });
				jcrop_api.focus();
				
						
			});
		
		$("#myImageUploadAspectRatio1_1").on ("click",function(){
				jcrop_api.setOptions({ aspectRatio: 1 });
				jcrop_api.focus();
				
						
			});
		});
		
		
		

				
});
		
	
	
