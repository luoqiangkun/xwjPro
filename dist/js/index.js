var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//  import { Button, Cell } from 'mint-ui'   
//  Vue.use(Button)
//  Vue.use(Cell)
var Directseller = function () {
    //state  = -1; 
    //data = {};
    // router = {};
    // state  = -1; 
    function Directseller() {
        _classCallCheck(this, Directseller);

        this.state = -1;
        this.router = {};
        this.data = {};
        this._data();
        this._router();
        this._check();
    }

    _createClass(Directseller, [{
        key: '_data',
        value: function _data() {
            var _this = this;

            $.request({
                type: 'post',
                url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=info&typ=json',
                dataType: 'json',
                async: false,
                success: function success(res) {
                    if (res.status === 200) {
                        _this.state = res.data.directseller_enable;
                        _this.data = res.data;
                    }
                }
            });
        }
    }, {
        key: '_check',
        value: function _check() {
            if (this.state > -1) {
                if (this.state === 0 || this.state === 2) {
                    if (this.router.path !== 'result') {
                        window.location.href = '/dist/views/result.html';
                    }
                } else {
                    if (this.router.path === 'result' || this.router.path === 'apply' || this.router.path === 'distributor' || this.router.path === 'sharer') {
                        window.location.href = '/dist/views/home.html';
                    }
                }
            } else {
                if (this.router.path !== 'apply' && this.router.path !== 'distributor' && this.router.path !== 'sharer') {
                    window.location.href = '/dist/views/distributor.html';
                }
            }
        }
        // //路由相关

    }, {
        key: '_router',
        value: function _router() {
            var location = window.location;
            var dir = '/dist/views/';
            var path = void 0;
            if (location.pathname) {
                switch (location.pathname) {
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
            var router = {
                path: path,
                href: location.search,
                search: location.search
            };
            this.router = router;
        }
    }]);

    return Directseller;
}();

var directseller = new Directseller();

/* ***********用户申请开始********** */
(function () {
    if (document.getElementById('apply')) {
        var app = new Vue({
            el: '#apply',
            data: {},
            methods: {},
            created: function created() {}
        });
    }
})();
/* ***********用户申请结束********** */

/* ***********申请成为分销商开始********** */
(function () {
    if (document.getElementById('distributor')) {
        var app = new Vue({
            el: '#distributor',
            data: {
                storeId: 0,
                storeName: '',
                areaName: '',
                location: {},
                addressName: '',
                addressIndex: 0,
                addressLists: [],
                storeLists: {}
            },
            methods: {
                initBMapView: function initBMapView() {
                    var self = this;
                    var geolocation = new BMap.Geolocation();
                    var geoc = new BMap.Geocoder();

                    geolocation.getCurrentPosition(function (r) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            var map = new BMap.Map("baidu_map"); // 创建地图实例 
                            var point = new BMap.Point(r.point.lng, r.point.lat); // 创建点坐标 
                            map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别

                            var mk = new BMap.Marker(r.point);
                            map.addOverlay(mk);
                            map.panTo(r.point);
                            self.location = { lat: r.point.lat, lng: r.point.lng };
                            self.getLocateLists();
                        } else {}
                    }, { enableHighAccuracy: true });

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
                getLocateLists: function getLocateLists() {
                    var _this2 = this;

                    var params = {
                        'location': this.location.lat + ',' + this.location.lng,
                        'area_name': this.areaName
                    };
                    $.request({
                        type: 'post',
                        url: ApiUrl + '/index.php?ctl=Index&met=nearbyArea&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(result) {
                            _this2.addressLists = result.data.items;
                        }
                    });
                },
                getStoreLists: function getStoreLists() {
                    var _this3 = this;

                    $.request({
                        type: 'post',
                        url: ApiUrl + '/index.php?ctl=Store&met=lists&typ=json',
                        data: { show_product: 1 },
                        dataType: 'json',
                        success: function success(result) {
                            _this3.storeLists = result.data;
                        }
                    });
                },
                storeHandle: function storeHandle() {
                    this.getStoreLists();
                },
                clickHandle: function clickHandle(row) {
                    this.storeId = row.store_id;
                    this.storeName = row.store_name;
                    this.$refs.storeHeader.click();
                },
                selectHandle: function selectHandle(item, index) {
                    this.areaName = item.name;
                    this.location = item.location;
                    this.addressName = item.address;
                    this.addressIndex = index;

                    this.$refs.addressHeader.click();
                },
                submitHandle: function submitHandle() {
                    var params = {
                        'store_id': this.store_id,
                        'area': this.areaName,
                        'latitude': this.location.lat,
                        'longitude': this.location.lng,
                        'address': this.addressName,
                        'directseller_type': 1
                    };
                    $.request({
                        type: 'post',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=apply&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            if (res.status === 200) {
                                window.location.href = '/dist/views/result.html';
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                });
                            }
                        }
                    });
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            mounted: function mounted() {
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
            created: function created() {
                this.initBMapView();
            }
        });
    }
})();

/* ***********申请成为分销商结束************** */

/* ***********申请成为分享员开始********** */
(function () {
    if (document.getElementById('sharer')) {
        var app = new Vue({
            el: '#sharer',
            data: {
                storeId: 0,
                storeName: ''
            },
            methods: {
                submitHandle: function submitHandle() {
                    var params = {
                        'store_id': this.storeId,
                        'directseller_type': 2
                    };
                    $.request({
                        type: 'post',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=apply&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            if (res.status === 200) {
                                window.location.href = '/dist/views/result.html';
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                });
                            }
                        }
                    });
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            }
        });
    }
})();

/* ***********申请成为分享员结束********** */

/* ***********申请结果展示开始********** */
(function () {
    if (document.getElementById('result')) {
        var app = new Vue({
            el: '#result',
            data: {
                id: '',
                state: 1,
                type: ''
            },
            methods: {
                getData: function getData() {
                    var _this4 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=info&typ=json',
                        data: { apply_id: this.id },
                        dataType: 'json',
                        success: function success(res) {
                            _this4.state = res.data.apply_state;
                            _this4.type = res.data.apply_type;
                        }
                    });
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                this.state = directseller.state;
                this.type = directseller.data.directseller_type;
            }
        });
    }
})();
/* ***********申请结果展示结束********** */

/* ***********分销中心开始********** */
(function () {
    if (document.getElementById('home')) {
        var app = new Vue({
            el: '#home',
            data: {},
            methods: {
                storeRouterHandle: function storeRouterHandle() {
                    window.location.href = '/dist/views/store.html';
                },
                incomeRouterHandle: function incomeRouterHandle() {
                    window.location.href = '/dist/views/income.html';
                },
                taskRouterHandle: function taskRouterHandle() {
                    window.location.href = '/dist/views/task.html';
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                this.type = directseller.data.directseller_type;
            }
        });
    }
})();
/* ***********分销中心结束********** */

/* ***********我的收入开始********** */
(function () {
    if (document.getElementById('income')) {
        var app = new Vue({
            el: '#income',
            data: {
                data: {}
            },
            methods: {
                getData: function getData() {
                    var _this5 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=income&typ=json',
                        data: { apply_id: this.id },
                        dataType: 'json',
                        success: function success(res) {
                            _this5.data = res.data;
                        }
                    });
                },
                commissionRouterHandle: function commissionRouterHandle() {
                    window.location.href = '/dist/views/commission.html';
                },
                orderRouterHandle: function orderRouterHandle() {
                    window.location.href = '/dist/views/order.html';
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                this.getData();
            }
        });
    }
})();
/* ***********我的收入结束********** */

/* ***********我的小店开始********** */
(function () {
    if (document.getElementById('store')) {
        var app = new Vue({
            el: '#store',
            data: {
                show: false,
                shop: {}
            },
            methods: {
                getData: function getData() {
                    var _this6 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=info&typ=json',
                        dataType: 'json',
                        success: function success(res) {
                            _this6.shop = res.data;
                        }
                    });
                },
                shareHandle: function shareHandle() {
                    this.show = true;
                },
                qrcodeHandle: function qrcodeHandle() {
                    this.show = true;
                },
                storeRouterHandle: function storeRouterHandle() {
                    window.location.href = '/dist/views/setting.html';
                },
                settingRouterHandle: function settingRouterHandle() {
                    window.location.href = '/dist/views/setting.html';
                },
                productRouterHandle: function productRouterHandle() {
                    window.location.href = '/dist/views/product.html';
                },
                shopRouterHandle: function shopRouterHandle(shop_id) {
                    window.location.href = '/dist/views/shop.html?shop_id=' + shop_id;
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                this.getData();
            }
        });
    }
})();
/* ***********我的小店结束********** */

/* ***********佣金明细开始********** */
(function () {
    if (document.getElementById('commission')) {
        var app = new Vue({
            el: '#commission',
            data: {
                orderData: {
                    page: 1,
                    records: 0,
                    total: 0,
                    items: []
                }
            },
            methods: {
                getOrderData: function getOrderData(page) {
                    var _this7 = this;

                    if (this.orderData.total == this.orderData.page) {
                        return;
                    }
                    var params = {
                        page: page ? page : 1,
                        rows: 10
                    };
                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_User&met=listsOrder&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            _this7.orderData.page = res.data.page;
                            _this7.orderData.records = res.data.records;
                            _this7.orderData.total = res.data.total;
                            _this7.orderData.items.push.apply(_this7.orderData.items, res.data.items);
                        }
                    });
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                var _this8 = this;

                this.getOrderData();

                $(window).scroll(function () {
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {

                        _this8.getOrderData(_this8.orderData.page + 1);
                    }
                });
            }
        });
    }
})();
/* ***********佣金明细结束********** */

/* ***********分销任务开始********** */
(function () {
    if (document.getElementById('task')) {
        var app = new Vue({
            el: '#task',
            data: {
                task: '0',
                order_amount: '0'
            },
            methods: {
                getData: function getData() {
                    var _this9 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=income&typ=json',
                        data: { apply_id: this.id },
                        dataType: 'json',
                        success: function success(res) {
                            _this9.order_amount = res.data.order_amount;
                        }
                    });
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                this.task = directseller.data.directseller_task;
                this.getData();
            }
        });
    }
})();
/* ***********分销任务结束********** */

/* ***********订单明细开始********** */
(function () {
    if (document.getElementById('order')) {
        var app = new Vue({
            el: '#order',
            data: {
                activeIndex: -1,
                dropdownMenu: [{
                    text: '订单状态',
                    index: 0
                }, {
                    text: '订单结算',
                    index: 0
                }],
                income: '0.00',
                orderData: {
                    page: 1,
                    records: 0,
                    total: 0,
                    items: []
                },
                orderTitle: '',
                orderStatus: ''
            },
            methods: {
                getData: function getData() {
                    var _this10 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=income&typ=json',
                        data: { apply_id: this.id },
                        dataType: 'json',
                        success: function success(res) {
                            _this10.income = res.data.commission_amount;
                        }
                    });
                },
                getOrderData: function getOrderData(page) {
                    var _this11 = this;

                    if (this.orderData.total == this.orderData.page) {
                        return;
                    }
                    var params = {
                        page: page ? page : 1,
                        rows: 5,
                        order_title: this.orderTitle,
                        order_status: this.orderStatus
                    };

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_User&met=listsOrder&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            _this11.orderData.page = res.data.page;
                            _this11.orderData.records = res.data.records;
                            _this11.orderData.total = res.data.total;
                            _this11.orderData.items.push.apply(_this11.orderData.items, res.data.items);
                        }
                    });
                },
                clickHandle: function clickHandle(activeIndex, clickIndex, text) {
                    if (this.dropdownMenu[activeIndex].index !== clickIndex) {
                        this.searchHandle();
                    }
                    this.activeIndex = -1;
                    this.dropdownMenu[activeIndex] = {
                        text: text,
                        index: clickIndex
                    };
                },
                searchHandle: function searchHandle() {
                    this.orderData = {
                        page: 1,
                        records: 0,
                        total: 0,
                        items: []
                    };
                    this.getOrderData();
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                var _this12 = this;

                this.getData();

                this.getOrderData();

                $(window).scroll(function () {
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {

                        _this12.getOrderData(_this12.orderData.page + 1);
                    }
                });
            }
        });
    }
})();
/* ***********订单明细结束********** */

/* ***********店铺设置开始********** */
(function () {
    if (document.getElementById('setting')) {
        var app = new Vue({
            el: '#setting',
            data: {
                form: {
                    shop_id: 0,
                    shop_name: '',
                    shop_logo: '',
                    shop_banner: '',
                    shop_description: ''
                }
            },
            methods: {
                getData: function getData() {
                    var _this13 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=info&typ=json',
                        dataType: 'json',
                        success: function success(res) {
                            var _res$data = res.data,
                                shop_id = _res$data.shop_id,
                                shop_name = _res$data.shop_name,
                                shop_logo = _res$data.shop_logo,
                                shop_banner = _res$data.shop_banner,
                                shop_description = _res$data.shop_description;

                            _this13.form = {
                                shop_id: shop_id,
                                shop_name: shop_name,
                                shop_logo: shop_logo,
                                shop_banner: shop_banner,
                                shop_description: shop_description
                            };
                        }
                    });
                },
                submitHandle: function submitHandle() {
                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=edit&typ=json',
                        dataType: 'json',
                        data: this.form,
                        success: function success(res) {
                            if (res.status === 200) {
                                alert('操作成功');
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                });
                            }
                        }
                    });
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            mounted: function mounted() {
                var _this14 = this;

                $('input[name="upfile"]').ajaxUploadImage({
                    url: SYS.URL.upload,
                    data: {},
                    start: function start(element) {
                        element.parent().after('<div class="upload-loading"><i></i></div>');
                        element.parent().siblings('.pic-thumb').remove();
                    },
                    success: function success(element, result) {
                        //checkLogin(result.login);
                        if (result.status != 200) {
                            element.parent().siblings('.upload-loading').remove();
                            $.sDialog({
                                skin: "red",
                                content: __('图片尺寸过大！'),
                                okBtn: false,
                                cancelBtn: false
                            });
                            return false;
                        }
                        element.parent().after('<div class="pic-thumb"><img src="' + result.data.url + '"/></div>');
                        element.parent().siblings('.upload-loading').remove();
                        _this14.form[element[0].id] = result.data.url;
                    }
                });
            },
            created: function created() {
                this.getData();
            }
        });
    }
})();
/* ***********店铺设置结束********** */

/* ***********商品管理开始********** */
(function () {
    if (document.getElementById('product')) {
        var app = new Vue({
            el: '#product',
            data: {
                productLists: {
                    page: 1,
                    records: 0,
                    total: 0,
                    items: []
                },
                productData: {
                    page: 1,
                    records: 0,
                    total: 0,
                    items: []
                }
            },
            methods: {
                getData: function getData(page) {
                    var _this15 = this;

                    if (this.productLists.total == this.productLists.page) {
                        return;
                    }
                    var params = {
                        page: page ? page : 1,
                        rows: 10
                    };
                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=lists&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            _this15.productLists.page = res.data.page;
                            _this15.productLists.records = res.data.records;
                            _this15.productLists.total = res.data.total;
                            _this15.productLists.items.push.apply(_this15.productLists.items, res.data.items);
                        }
                    });
                },
                getProduct: function getProduct(page) {
                    var _this16 = this;

                    if (this.productData.total == this.productData.page) {
                        return;
                    }
                    var params = {
                        page: page ? page : 1,
                        rows: 1000
                    };
                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=product&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            _this16.productData.page = res.data.page;
                            _this16.productData.records = res.data.records;
                            _this16.productData.total = res.data.total;
                            _this16.productData.items.push.apply(_this16.productData.items, res.data.items);
                        }
                    });
                },
                productRouterHandle: function productRouterHandle(row) {
                    var url = void 0;
                    if (row.item_id) {
                        url = WapSiteUrl + '/tmpl/product_detail.html?item_id=' + row.item_id + '&sharer=' + row.directseller_id;
                    } else {
                        url = WapSiteUrl + '/tmpl/product_detail.html?product_id=' + row.product_id + '&sharer=' + row.directseller_id;
                    }
                    window.location.href = url;
                },
                addHandle: function addHandle(product_id) {
                    var _this17 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=add&typ=json',
                        data: { product_id: product_id },
                        dataType: 'json',
                        success: function success(res) {
                            if (res.status === 200) {
                                alert('操作成功');
                                _this17.productLists.items.unshift(res.data);
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                });
                            }
                        }
                    });
                },
                removeHandle: function removeHandle(directseller_product_id, index) {
                    var _this18 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=remove&typ=json',
                        data: { directseller_product_id: directseller_product_id },
                        dataType: 'json',
                        success: function success(res) {
                            if (res.status === 200) {
                                alert('操作成功');
                                _this18.productLists.items.splice(index, 1);
                            } else {
                                $.sDialog({
                                    skin: "red",
                                    content: res.msg,
                                    okBtn: false,
                                    cancelBtn: false
                                });
                            }
                        }
                    });
                },
                clickHandle: function clickHandle() {
                    this.getProduct();
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            mounted: function mounted() {
                $.animationLeft({
                    valve: '#add',
                    wrapper: '#productAdd',
                    scroll: ''
                });
            },
            created: function created() {
                var _this19 = this;

                this.getData();
                $(window).scroll(function () {
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
                        _this19.getData(_this19.productLists.page + 1);
                    }
                });
            }
        });
    }
})();
/* ***********商品管理结束********** */

/* ***********微店开始********** */
(function () {
    if (document.getElementById('shop')) {
        var app = new Vue({
            el: '#shop',
            data: {
                shop_id: 0,
                shopData: {},
                productLists: {
                    page: 1,
                    records: 0,
                    total: 0,
                    items: []
                }
            },
            methods: {
                getData: function getData() {
                    var _this20 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Shop&met=get&typ=json',
                        data: { shop_id: this.shop_id },
                        dataType: 'json',
                        success: function success(res) {
                            _this20.shopData = res.data;
                        }
                    });
                },
                getProductData: function getProductData(page) {
                    var _this21 = this;

                    if (this.productLists.total == this.productLists.page) {
                        return;
                    }
                    var params = {
                        page: page ? page : 1,
                        rows: 10
                    };
                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Product&met=lists&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            _this21.productLists.page = res.data.page;
                            _this21.productLists.records = res.data.records;
                            _this21.productLists.total = res.data.total;
                            _this21.productLists.items.push.apply(_this21.productLists.items, res.data.items);
                        }
                    });
                },
                productRouterHandle: function productRouterHandle(row) {
                    var url = void 0;
                    if (row.item_id) {
                        url = WapSiteUrl + '/tmpl/product_detail.html?item_id=' + row.item_id + '&sharer=' + row.directseller_id;
                    } else {
                        url = WapSiteUrl + '/tmpl/product_detail.html?product_id=' + row.product_id + '&sharer=' + row.directseller_id;
                    }
                    window.location.href = url;
                },
                backHandle: function backHandle() {
                    history.go(-1); //返回上一层
                }
            },
            created: function created() {
                this.shop_id = getQueryString('shop_id');
                this.getData();
                this.getProductData();
            }
        });
    }
})();
/* ***********微店结束********** */