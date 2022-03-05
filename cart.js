import { createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';


const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'alicia';


const app = createApp({
    data(){
        return {
            products:[],
            cartData:{},
            productId: '',
        }
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
            .then((res) => {
              this.products = res.data.products;
            })
            .catch((error) => {
    
            })
        },
        openProductModal(id){
            this.productId = id;
            this.$refs.productModal.openModal()
        },

   



    },
    mounted() {

        this.getProducts()
        
    },
});

app.component('product-modal',{
    template:'#userProductModal',
    props:['id'],
    data(){
        return{
            // 相同作用域
            modal:{},
            product:{},
            qty:1,

        }
    },
    watch:{
        id(){
           this.getProduct() 
        }

    },
    methods:{
        openModal(){
            this.modal.show()
        },
        closeModal(){
            this.modal.hide()
        },
        getProduct(){
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
            .then((res) => {
                console.log(res.data.product)
              this.product = res.data.product;
              
            })
            .catch((error) => {
    
            })
        }
    },
    mounted(){
      this.modal = new bootstrap.Modal(this.$refs.modal);
      
    },
})

app.mount('#app');


