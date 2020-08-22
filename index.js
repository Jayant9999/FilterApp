(function () {
    const imgFileElem = document.getElementById('imgFile');
    const canvas = document.getElementById('canvas');
    const filterBtn = document.getElementById('applyFilter');
    /** Renderer
     *  Renders image to canvas from data source
     */
    class Renderer {
        constructor() {
            this.canvas = canvas;
            this.imgFileElem = imgFileElem;

        }

        readFile() {
            const fileReader = new FileReader()
            fileReader.onload = this.createImage.bind(this, fileReader);
            fileReader.readAsDataURL(this.imgFileElem.files[0]);
        }

        createImage(fileReader) {
            const img = new Image();
            img.onload = this.imageLoaded.bind(this, img);
            img.src = fileReader.result;
        }

        imageLoaded(img) {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            var ctx = this.canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // this.canvas.toDataURL("image/png"); 
        }
    }
    const renderer = new Renderer();

    imgFileElem.addEventListener('change', fileUpload.bind(renderer));


    function fileUpload() {
        this.readFile();
    }


    class Filter {
        constructor() {
            this.filterState = new FilterState();
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d')
        }

        applyFilter(filterName) {

            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);


            this.filterState.filterState = { imageData: this.update(imageData) };
            return this;
        }

        undoFilter() {
            this.filterState.filterState.pop();
            return this;
        }

        update(imageData, filterName) {
            var d = imageData.data;
            for (let i = 0; i < d.length; i += 4) {
                let r = d[i];
                let g = d[i + 1];
                let b = d[i + 2];
                let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                d[i] = d[i + 1] = d[i + 2] = v
            }
            this.ctx.putImageData(imageData, 0, 0);
            return imageData;
        }

    }


    class FilterState {

        constructor() {
            this._filterState = [];
        }

        set filterState(filterState) {
            this._filterState.push(filterState);
        }


        get filterState() {
            return this._filterState;
        }

    }

    const filter = new Filter();
    filterBtn.addEventListener('click', filter.applyFilter.bind(filter));

})();