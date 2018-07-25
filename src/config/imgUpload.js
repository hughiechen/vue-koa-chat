// code by hehe
function ImgPrevirewer(config) {

    /**
    * The tag ID for upload images.
    */
    this.fileId = config.fileId;

    /**
    * tip for error message.
    * @type {string}
    */
    this.tip = config.tip;
    /**
    * The ID for the container which contains img tags.
    * @type {string}
    */
    this.containerId = config.containerId;
    /**
    * CSS style for previewing imgs.
    * @type {string}
    */
    this.imgStyle = config.imgStyle;

    /**
    * 过滤图片格式，可进行相对应的删减操作。
    * @type {{jpeg: string, gif: string, png: string}}
    */
    this.filter = {
        /**
        * jpg或者jpeg格式的图片。
        */
        "jpeg": "/9j/4",
        /**
        * gif格式的图片。
        */
        "gif": "R0lGOD",
        /**
        * PNG格式的图片。
        */
        "png": "iVBORw"
    };


    /**
    * 开始预览。自动调用原生JavaScript实现相关元素的定位以及渲染。
    */
    this.preview = function () {
        var file = document.getElementById(this.fileId);
        var container = document.getElementById(this.containerId);
        container.innerHTML = "";
        /**
        * 防止内部作用域覆盖问题。
        * @type {ImgPrevirewer}
        */
        var that = this;
        // HTML5 需要使用FileReader的相关API来读取本地数据。
        if (window.FileReader) {
            // 针对多个上传文件批量处理。
            for (var index = 0, f; f = file.files[index]; index++) {
                var filereader = new FileReader();
                filereader.onload = function (event) {
                    var srcpath = event.target.result;
                    if (!that.validateImg(srcpath)) {
                        console.log(this.tip);
                    } else {
                        that.showPreviewImg(srcpath);
                    }
                };
                filereader.readAsDataURL(f);
            }
        } else {
            // 低版本降级处理。
            if (!/\.jpg$|\.png$|\.gif$/i.test(file.value)) {
                console.log(this.tip);
            } else {
                that.showPreviewImg(file.value);
            }
        }
    }


    /**
    * 根据图片的base64编码格式查看图片是否符合要求。
    * @param data  编码后的图片数据。
    * @returns {*}
    */
    this.validateImg = function (data) {
        var pos = data.indexOf(",") + 1;
        for (var e in this.filter) {
            if (data.indexOf(this.filter[e]) === pos) {
                return e;
            }
        }
        return null;
    }

    /**
    * 开始实现对图片的预览，根据this.imgStyle进行相关渲染操作。
    * @param src
    */
    this.showPreviewImg = function (src) {
        var img = document.createElement('img');
        img.src = src;
        img.style = this.imgStyle;
        container.appendChild(img);
    }


}
export default ImgPrevirewer;