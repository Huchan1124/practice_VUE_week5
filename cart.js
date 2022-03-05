
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'alicia';


const app = Vue.createApp({
    data() {
        return {
            products: [],
            cartData: {},
            productId: '',
            isLoadingItem: '',
            form: {
                "user": {
                  "name": '',
                  "email": '',
                  "tel": '',
                  "address": ''
                },
                "message": ''
              },
        }
    },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then((res) => {
                    this.products = res.data.products;
                })
                .catch((error) => {
                })
        },
        openProductModal(id) {
            this.productId = id;
            this.$refs.productModal.openModal()
        },
        getCart() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then((res) => {
                    this.cartData = res.data.data;
                })
                .catch((error) => {
                })

        },
        addToCart(id, qty = 1) {
            const postData = {
                "data": {
                    "product_id": id,
                    qty,
                }
            };

            this.isLoadingItem = id;

            axios.post(`${apiUrl}/api/${apiPath}/cart`, postData)
                .then((res) => {
                    this.getCart();
                    this.$refs.productModal.closeModal()
                    this.isLoadingItem = '';
                })
                .catch((error) => {
                })
        },
        removeCartItem(id) {

            this.isLoadingItem = id;
            if (confirm("確定要移除品項?")) {
                axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
                    .then((res) => {
                        this.getCart();
                        this.isLoadingItem = '';
                    })
                    .catch((error) => {
                    })
            }

        },
        updateCartItem(cartItem) {

            const postData = {
                "data": {
                    "product_id": cartItem.id,
                    "qty": cartItem.qty,
                }
            };

            this.isLoadingItem = cartItem.id;

            axios.put(`${apiUrl}/api/${apiPath}/cart/${cartItem.id}`, postData)
                .then((res) => {
                    this.isLoadingItem = '';
                    this.getCart();
                })
                .catch((error) => {
                })

        },
        removeAllCart() {
            if (confirm("確定要清空購物車?")) {
                axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                    .then((res) => {
                        this.getCart();
                    })
                    .catch((error) => {
                    })
            }

        },
        createOrder(){
           const postData = {
            "data": this.form
          }

           this.isLoadingItem = true;
           
           axios.post(`${apiUrl}/api/${apiPath}/order`, postData)
           .then((res) => {
               console.log(res)
               this.$refs.form.resetForm()
               this.isLoadingItem = '';
               
           })
           .catch((error) => {
           })
        }
        ,
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;

            if(value === undefined ){
                return '手機號碼 為必填';
            }

            if(phoneNumber.test(value)){
                return true
            } else {
                return '請輸入正確的手機號碼格式'
            }
          
        }





    },
    mounted() {

        this.getProducts();
        this.getCart();

    },
});

app.component('product-modal', {
    template: '#userProductModal',
    props: ['id'],
    data() {
        return {
            // 相同作用域
            modal: {},
            product: {},
            qty: 1,

        }
    },
    watch: {
        id() {
            this.getProduct()
        }

    },
    methods: {
        openModal() {
            this.modal.show()
        },
        closeModal() {
            this.modal.hide()
        },
        getProduct() {
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then((res) => {
                    this.product = res.data.product;

                })
                .catch((error) => {

                })
        },
        addToCart() {
            this.$emit('add-cart', this.product.id, this.qty);
            setTimeout(() => { this.qty = 1; }, 1000);

        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);

    },
})

// 加入全部規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

// i18n
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'), //語系設定
    
});


app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');


