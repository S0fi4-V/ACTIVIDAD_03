const inst = Vue.createApp({
    created() {
        this.cargarMaquillaje();
        this.maquillajeFiltrado = this.maquillaje;
    },

    data() {
        return {
            maquillaje:[],
            maquillajeFiltrado: [],
            seleccionarCategoria:'Todos',
            seleccionarProducto:{},
            carrito: [],
        }
    },
    computed: {
        progreso() {
            if (this.maquillaje.length === 0) return 0;
            let porcentaje = (this.maquillajeFiltrado.length / this.maquillaje.length) * 100;
            return Math.round(porcentaje);
        },
        color(){
            return{
            'bg-danger': this.progreso <= 15,
            'bg-warning': this.progreso >= 15 && this.progreso <= 19,
            'bg-info': this.progreso >= 19
            }
        }
    },
    methods: {
        cargarMaquillaje() {
            axios.get("http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline").then(respuesta => {
            //Agregue esta funcion con nuevas funciones para que mis imagenes se mostraran correctamente
            //Estas funciones arreglan los enlaces y ponen una imagen de repuesto si el link falla.
            //Ya que mi página se encontraba vacía (sin imagenes)
            this.maquillaje = respuesta.data.map(prod => {
                if (prod.image_link && prod.image_link.startsWith('//')) {
                    prod.image_link = 'https:' + prod.image_link;
                }
                return prod;
            });
                this.maquillajeFiltrado = this.maquillaje;
            })
                .catch(error => console.error("Error:", error));
        },
        filtrarPorCategoria(categoria) {
        this.seleccionarCategoria=categoria;
        if(this.seleccionarCategoria == 'Todos'){
                this.maquillajeFiltrado = this.maquillaje;
        }else{
            this.maquillajeFiltrado = this.maquillaje.filter(item => 
            item.product_type && item.product_type.includes(categoria)
            );
        }
        },
        mostrarProducto(maquillaje){
            this.seleccionarProducto= maquillaje;
        },
        regresar() {
            this.seleccionarProducto = {};
        },
        agregarCarrito(producto) {
            const item = {
                id: producto.id,
                nombre: producto.name,
                precio: producto.price,
                imagen: producto.image_link
        };
        this.carrito.push(item);
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        alert("Producto añadido al carrito");
    },
},
        
});

const app = inst.mount("#contenedor");