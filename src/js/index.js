
//  import { Button, Cell } from 'mint-ui'   
//  Vue.use(Button)
//  Vue.use(Cell)
class Directseller {
    //state  = -1; 
    //data = {};
    // router = {};
    // state  = -1; 
    constructor() {
        this.state = -1;
        this.router = {};
        this.data = {};
        this._data();
        this._router();
        this._check();
    }
    _data(){
        $.request({
            type:'post',
            url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=info&typ=json',
            dataType:'json',
            async: false,
            success:  (res) => {
                if( res.status === 200 ){
                   this.state = res.data.directseller_enable; 
                   this.data = res.data;
                } 
            }
        }); 
    }
    _check(){
        if( this.state > -1 ){
            if( this.state === 0 || this.state === 2 ){
                if( this.router.path !== 'result' ){
                    window.location.href = '/dist/views/result.html';
                }
            } else {
                if( this.router.path === 'result' || this.router.path === 'apply' || this.router.path === 'distributor' || this.router.path === 'sharer' ){
                    window.location.href = '/dist/views/home.html';
                }
            } 
        } else {
            if( this.router.path !== 'apply' && this.router.path !== 'distributor' && this.router.path !== 'sharer' ){
                window.location.href = '/dist/views/distributor.html';
            }
        }
    }
    // //路由相关
    _router(){
        const location = window.location;
        const dir = '/dist/views/';
        let path;
        if( location.pathname ){
            switch(location.pathname) {
                case dir + 'apply.html':
                    path = 'apply';
                    break;
                case dir + 'distributor.html':
                    path = 'distributor';
                    break;
                case dir + 'home.html':
                    path = 'home';
                    break;
                case dir + 'income.html':
                    path = 'income';
                    break;
                case dir + 'order.html':
                    path = 'order';
                    break;
                case dir + 'result.html':
                    path = 'result';
                    break;
                case dir + 'store.html':
                    path = 'store';
                    break;
                case dir + 'sharer.html':
                    path = 'sharer';
                    break;
                case dir + 'setting.html':
                    path = 'setting';
                    break;
                default:
                    path = 'index';
            } 
        }
        const router = {
            path:path,
            href:location.search,
            search:location.search,
        }
        this.router = router;
    }
}

let directseller = new Directseller();

/* ***********用户申请开始********** */
(function () { 
    if( document.getElementById('apply') ){
        let app = new Vue({
            el: '#apply',
            data: {},
            methods:{
            },
            created(){
            }
        })
    }
} ()); 
/* ***********用户申请结束********** */

/* ***********申请成为分销商开始********** */
(function () { 
    if( document.getElementById('distributor') ){
        let app = new Vue({
            el: '#distributor',
            data: {
                storeId:0,
                storeName:'',
                areaName:'',
                location:{},
                addressName:'',
                addressIndex:0,
                addressLists:[],
                storeLists:{}
            },
            methods:{
                initBMapView(){
                    let self = this;
                    const geolocation = new BMap.Geolocation();
                    let geoc = new BMap.Geocoder();
        
                    geolocation.getCurrentPosition(function (r) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS)
                        {
                            let map = new BMap.Map("baidu_map");          // 创建地图实例 
                            let point = new BMap.Point(r.point.lng, r.point.lat);  // 创建点坐标 
                            map.centerAndZoom(point, 15);                   // 初始化地图，设置中心点坐标和地图级别
        
                            var mk = new BMap.Marker(r.point);
                            map.addOverlay(mk);
                            map.panTo(r.point);
                            self.location = {lat: r.point.lat, lng: r.point.lng};
                            self.getLocateLists();
                        }
                        else
                        {                          
                        }
                    }, {enableHighAccuracy: true})
        
                    //关于状态码
                    //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
                    //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
                    //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
                    //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
                    //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
                    //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
                    //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
                    //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
                    //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)
                },
                getLocateLists(){
                    let params = {
                        'location':this.location.lat + ',' + this.location.lng,
                        'area_name' : this.areaName,
                    };
                    $.request({
                        type:'post',
                        url: ApiUrl + '/index.php?ctl=Index&met=nearbyArea&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (result) => {
                            this.addressLists = result.data.items;
                            
                        }
                    });
                },
                getStoreLists(){
                    $.request({
                        type:'post',
                        url: ApiUrl + '/index.php?ctl=Store&met=lists&typ=json',
                        data:{show_product:1},
                        dataType:'json',
                        success:  (result) => {
                            this.storeLists = result.data;
                        }
                    });
                },
                storeHandle(){
                    this.getStoreLists();
                },
                clickHandle(row){
                    this.storeId = row.store_id;
                    this.storeName = row.store_name;
                    this.$refs.storeHeader.click();
                },
                selectHandle( item,index ){
                    this.areaName = item.name;
                    this.location = item.location;
                    this.addressName = item.address;
                    this.addressIndex = index;
                    
                    this.$refs.addressHeader.click();
                },
                submitHandle(){
                    let params = {
                        'store_id' : this.store_id,
                        'area':this.areaName,
                        'latitude':this.location.lat,
                        'longitude' :this.location.lng,
                        'address' : this.addressName,
                        'directseller_type' : 1
                    };
                    $.request({
                        type:'post',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=apply&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            if( res.status === 200 ){
                                window.location.href = '/dist/views/result.html';
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                })
                            }
                        }
                    });
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            mounted(){
                $.animationLeft({
                    valve: '#new-address-valve',
                    wrapper: '#new-address-wrapper',
                    scroll: ''
                });

                $.animationLeft({
                    valve: '#new-store-valve',
                    wrapper: '#new-store-wrapper',
                    scroll: ''
                });

            },
            created(){
                this.initBMapView();
            }
        })
    }
} ()); 

/* ***********申请成为分销商结束************** */


/* ***********申请成为分享员开始********** */
(function () { 
    if( document.getElementById('sharer') ){
        let app = new Vue({
            el: '#sharer',
            data: {
                storeId:0,
                storeName:'',
            },
            methods:{
                submitHandle(){
                    let params = {
                        'store_id' : this.storeId,
                        'directseller_type' : 2
                    };
                    $.request({
                        type:'post',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=apply&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            if( res.status === 200 ){
                                window.location.href = '/dist/views/result.html';
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                })
                            }
                        }
                    });
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            }
        })
    }
    
} ()); 

/* ***********申请成为分享员结束********** */


/* ***********申请结果展示开始********** */
(function () { 
    if( document.getElementById('result') ){
        let app = new Vue({
            el: '#result',
            data: {
                id:'',
                state:1,
                type:''
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=info&typ=json',
                        data:{apply_id:this.id},
                        dataType:'json',
                        success:  (res) => {
                            this.state = res.data.apply_state;
                            this.type = res.data.apply_type;
                        }
                    });
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.state = directseller.state;
                this.type = directseller.data.directseller_type;
            }
        })
    }
} ()); 
/* ***********申请结果展示结束********** */


/* ***********分销中心开始********** */
(function () { 
    if( document.getElementById('home') ){
        let app = new Vue({
            el: '#home',
            data: {},
            methods:{
                storeRouterHandle(){
                    window.location.href =  '/dist/views/store.html';
                },
                incomeRouterHandle(){
                    window.location.href =  '/dist/views/income.html';
                },
                taskRouterHandle(){
                    window.location.href =  '/dist/views/task.html';
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.type = directseller.data.directseller_type;
            }
        })
    }
} ()); 
/* ***********分销中心结束********** */


/* ***********我的收入开始********** */
(function () { 
    if( document.getElementById('income') ){
        let app = new Vue({
            el: '#income',
            data: {
                data:{}
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=income&typ=json',
                        data:{apply_id:this.id},
                        dataType:'json',
                        success:  (res) => {
                            this.data = res.data;
                        }
                    });
                },
                commissionRouterHandle(){
                    window.location.href =  '/dist/views/commission.html';
                },
                orderRouterHandle(){
                    window.location.href =  '/dist/views/order.html';
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.getData();
            }
        })
    }
} ()); 
/* ***********我的收入结束********** */



/* ***********我的小店开始********** */
(function () { 
    if( document.getElementById('store') ){
        let app = new Vue({
            el: '#store',
            data: {
                show:false,
                shop:{}
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=info&typ=json',
                        dataType:'json',
                        success:  (res) => {
                            this.shop = res.data;
                        }
                    });
                },
                shareHandle(){
                   this.show = true;
                },
                qrcodeHandle(){
                    this.show = true;
                },
                storeRouterHandle(){
                    window.location.href = '/dist/views/setting.html';
                },
                settingRouterHandle(){
                    window.location.href = '/dist/views/setting.html';
                },
                productRouterHandle(){
                    window.location.href = '/dist/views/product.html';
                },
                shopRouterHandle(shop_id){
                    window.location.href = '/dist/views/shop.html?shop_id=' + shop_id;
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.getData();
            }
        })
    }
} ()); 
/* ***********我的小店结束********** */



/* ***********佣金明细开始********** */
(function () { 
    if( document.getElementById('commission') ){
        let app = new Vue({
            el: '#commission',
            data: {
                orderData:{
                    page:1,
                    records:0,
                    total:0,
                    items:[]
                }
            },
            methods:{
                getOrderData( page ){
                   
                    if( this.orderData.total == this.orderData.page ){
                        return;
                    }
                    let params = {
                        page:page ? page : 1,
                        rows:10
                    };
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_User&met=listsOrder&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            this.orderData.page = res.data.page;
                            this.orderData.records = res.data.records;
                            this.orderData.total = res.data.total;
                            this.orderData.items.push.apply(this.orderData.items,res.data.items);

                        }
                    });
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.getOrderData();

                $(window).scroll(() => {
                    if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){

                       this.getOrderData((this.orderData.page+1));
                    }
                });

            }
        })
    }
} ()); 
/* ***********佣金明细结束********** */


/* ***********分销任务开始********** */
(function () { 
    if( document.getElementById('task') ){
        let app = new Vue({
            el: '#task',
            data: {
                task:'0',
                order_amount:'0'
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=income&typ=json',
                        data:{apply_id:this.id},
                        dataType:'json',
                        success:  (res) => {
                            this.order_amount = res.data.order_amount;
                        }
                    });
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.task = directseller.data.directseller_task;
                this.getData();
            }
        })
    }
} ()); 
/* ***********分销任务结束********** */


/* ***********订单明细开始********** */
(function () { 
    if( document.getElementById('order') ){
        let app = new Vue({
            el: '#order',
            data: {
                activeIndex:-1,
                dropdownMenu:[
                    {
                        text:'订单状态',
                        index:0
                    },
                    {
                        text:'订单结算',
                        index:0
                    }
                ],
                income:'0.00',
                orderData:{
                    page:1,
                    records:0,
                    total:0,
                    items:[]
                },
                orderTitle:'',
                orderStatus:'',
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=income&typ=json',
                        data:{apply_id:this.id},
                        dataType:'json',
                        success:  (res) => {
                            this.income = res.data.commission_amount;
                        }
                    });
                },
                getOrderData( page ){
                   
                    if( this.orderData.total == this.orderData.page ){
                        return;
                    }
                    let params = {
                        page:page ? page : 1,
                        rows:5,
                        order_title:this.orderTitle,
                        order_status:this.orderStatus
                    };

                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_User&met=listsOrder&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            this.orderData.page = res.data.page;
                            this.orderData.records = res.data.records;
                            this.orderData.total = res.data.total;
                            this.orderData.items.push.apply(this.orderData.items,res.data.items);

                        }
                    });
                },
                clickHandle(activeIndex,clickIndex,text){
                    if( this.dropdownMenu[activeIndex].index !== clickIndex ){
                        this.searchHandle();
                    }
                    this.activeIndex = -1;
                    this.dropdownMenu[activeIndex] = {
                        text:text,
                        index:clickIndex
                    };
                },
                searchHandle(){
                    this.orderData = {
                        page:1,
                        records:0,
                        total:0,
                        items:[]
                    };
                    this.getOrderData();
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.getData();

                this.getOrderData();

                $(window).scroll(() => {
                    if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){

                       this.getOrderData((this.orderData.page+1));
                    }
                });
            }
        })
    }
} ()); 
/* ***********订单明细结束********** */


/* ***********店铺设置开始********** */
(function () { 
    if( document.getElementById('setting') ){
        let app = new Vue({
            el: '#setting',
            data: {
                form:{
                    shop_id:0,
                    shop_name:'',
                    shop_logo:'',
                    shop_banner:'',
                    shop_description:''
                }
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=info&typ=json',
                        dataType:'json',
                        success:  (res) => {
                            const {shop_id,shop_name,shop_logo,shop_banner,shop_description } = res.data;
                            this.form = {
                                shop_id:shop_id,
                                shop_name:shop_name,
                                shop_logo:shop_logo,
                                shop_banner:shop_banner,
                                shop_description:shop_description
                            };
                        }
                    });
                },
                submitHandle(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=edit&typ=json',
                        dataType:'json',
                        data:this.form,
                        success:  (res) => {
                            if( res.status === 200 ){
                               alert('操作成功');
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                })
                            }
                        }
                    });
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            mounted(){
                $('input[name="upfile"]').ajaxUploadImage({
                    url : SYS.URL.upload,
                    data:{},
                    start :  function(element){
                        element.parent().after('<div class="upload-loading"><i></i></div>');
                        element.parent().siblings('.pic-thumb').remove();
                    },
                    success : (element, result) => {
                        //checkLogin(result.login);
                        if (result.status != 200) {
                            element.parent().siblings('.upload-loading').remove();
                            $.sDialog({
                                skin:"red",
                                content:__('图片尺寸过大！'),
                                okBtn:false,
                                cancelBtn:false
                            });
                            return false;
                        }
                        element.parent().after('<div class="pic-thumb"><img src="'+result.data.url+'"/></div>');
                        element.parent().siblings('.upload-loading').remove();
                        this.form[element[0].id] = result.data.url;
                    }
                });
            },
            created(){
                this.getData();
            }
        })
    }
} ()); 
/* ***********店铺设置结束********** */


/* ***********商品管理开始********** */
(function () { 
    if( document.getElementById('product') ){
        let app = new Vue({
            el: '#product',
            data: {
                productLists:{
                    page:1,
                    records:0,
                    total:0,
                    items:[]
                },
                productData:{
                    page:1,
                    records:0,
                    total:0,
                    items:[]
                }
            },
            methods:{
                getData( page ){
                    if( this.productLists.total == this.productLists.page ){
                        return;
                    }
                    let params = {
                        page:page ? page : 1,
                        rows:10
                    };
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=lists&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            this.productLists.page = res.data.page;
                            this.productLists.records = res.data.records;
                            this.productLists.total = res.data.total;
                            this.productLists.items.push.apply(this.productLists.items,res.data.items);
                        }
                    });
                },
                getProduct( page ){
                    if( this.productData.total == this.productData.page ){
                        return;
                    }
                    let params = {
                        page:page ? page : 1,
                        rows:1000
                    };
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=product&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            this.productData.page = res.data.page;
                            this.productData.records = res.data.records;
                            this.productData.total = res.data.total;
                            this.productData.items.push.apply(this.productData.items,res.data.items);
                        }
                    });
                },
                productRouterHandle(row){
                    let url;
                    if( row.item_id ){
                        url = WapSiteUrl + '/tmpl/product_detail.html?item_id=' + row.item_id + '&sharer=' + row.directseller_id;
                    } else {
                        url = WapSiteUrl + '/tmpl/product_detail.html?product_id=' + row.product_id + '&sharer=' + row.directseller_id;
                    }
                    window.location.href = url;
                },
                addHandle( product_id ){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=add&typ=json',
                        data:{product_id:product_id},
                        dataType:'json',
                        success:  (res) => {
                            if( res.status === 200 ){
                                alert('操作成功');
                                this.productLists.items.unshift(res.data);
                            } else {
                                $.sDialog({
                                    skin:"red",
                                    content:res.msg,
                                    okBtn:false,
                                    cancelBtn:false
                                });
                            }
                        }
                    });
                },
                removeHandle(directseller_product_id,index){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=remove&typ=json',
                        data:{directseller_product_id:directseller_product_id},
                        dataType:'json',
                        success:  (res) => {
                            if( res.status === 200 ){
                                alert('操作成功');
                                this.productLists.items.splice(index,1);
                            } else {
                                $.sDialog({
                                    skin:"red",
                                    content:res.msg,
                                    okBtn:false,
                                    cancelBtn:false
                                });
                            }
                        }
                    });
                },
                clickHandle(){
                    this.getProduct();
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            mounted(){
                $.animationLeft({
                    valve: '#add',
                    wrapper: '#productAdd',
                    scroll: ''
                });
            },
            created(){
                this.getData();
                $(window).scroll(() => {
                    if(($(window).scrollTop() + $(window).height() > $(document).height()-1)){
                       this.getData((this.productLists.page+1));
                    }
                });
            }
        })
    }
} ()); 
/* ***********商品管理结束********** */


/* ***********微店开始********** */
(function () { 
    if( document.getElementById('shop') ){
        let app = new Vue({
            el: '#shop',
            data: {
                shop_id:0,
                shopData:{},
                productLists:{
                    page:1,
                    records:0,
                    total:0,
                    items:[]
                }
            },
            methods:{
                getData(){
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=get&typ=json',
                        data:{shop_id:this.shop_id},
                        dataType:'json',
                        success:  (res) => {
                            this.shopData = res.data;
                        }
                    });
                },
                getProductData( page ){
                    if( this.productLists.total == this.productLists.page ){
                        return;
                    }
                    let params = {
                        page:page ? page : 1,
                        rows:10
                    };
                    $.request({
                        type:'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=lists&typ=json',
                        data:params,
                        dataType:'json',
                        success:  (res) => {
                            this.productLists.page = res.data.page;
                            this.productLists.records = res.data.records;
                            this.productLists.total = res.data.total;
                            this.productLists.items.push.apply(this.productLists.items,res.data.items);
                        }
                    });
                },

                productRouterHandle(row){
                    let url;
                    if( row.item_id ){
                        url = WapSiteUrl + '/tmpl/product_detail.html?item_id=' + row.item_id + '&sharer=' + row.directseller_id;
                    } else {
                        url = WapSiteUrl + '/tmpl/product_detail.html?product_id=' + row.product_id + '&sharer=' + row.directseller_id;
                    }
                    window.location.href = url;
                },
                backHandle(){
                    history.go(-1);//返回上一层
                }
            },
            created(){
                this.shop_id = getQueryString('shop_id');
                this.getData();
                this.getProductData();
                
            }
        })
    }
} ()); 
/* ***********微店结束********** */