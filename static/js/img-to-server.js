  window.onload = function(){  
  
    // 选择图片  
    document.getElementById('img').onchange = function(){  
  
        var img = event.target.files[0];  
  
        // 判断是否图片  
        if(!img){  
            return ;  
        }  
  
        // 判断图片格式  
        if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) ){  
            alert('图片只能是jpg,gif,png');  
            return ;  
        }  
  
        var reader = new FileReader();  
        reader.readAsDataURL(img);  
  
        reader.onload = function(e){ // reader onload start  
            // ajax 上传图片  
            $.post("server.php", { img: e.target.result},function(ret){  
                if(ret.img!=''){  
                    alert('upload success');  
                    $('#showimg').html('<img src="' + ret.img + '">');  
                }else{  
                    alert('upload fail');  
                }  
            },'json');  
        } // reader onload end  
    }  
  
  }  