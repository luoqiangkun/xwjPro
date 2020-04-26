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
                    window.location.href = '/dist/views/apply.html';
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
                areaName: '',
                location: {},
                addressName: '',
                addressIndex: 0,
                addressLists: []
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
                selectHandle: function selectHandle(item, index) {
                    this.areaName = item.name;
                    this.location = item.location;
                    this.addressName = item.address;
                    this.addressIndex = index;

                    this.$refs.addressHeader.click();
                },
                submitHandle: function submitHandle() {
                    var params = {
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
                                //window.location.href = '/dist/views/result.html';
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
                }
            },
            mounted: function mounted() {
                $.animationLeft({
                    valve: '#new-address-valve',
                    wrapper: '#new-address-wrapper',
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
            data: {},
            methods: {
                submitHandle: function submitHandle() {
                    var params = {
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
                    var _this3 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Distribution_Directseller&met=info&typ=json',
                        data: { apply_id: this.id },
                        dataType: 'json',
                        success: function success(res) {
                            _this3.state = res.data.apply_state;
                            _this3.type = res.data.apply_type;
                        }
                    });
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
            data: {},
            methods: {
                commissionRouterHandle: function commissionRouterHandle() {
                    window.location.href = '/dist/views/commission.html';
                },
                orderRouterHandle: function orderRouterHandle() {
                    window.location.href = '/dist/views/order.html';
                }
            },
            created: function created() {}
        });
    }
})();
/* ***********我的收入结束********** */

/* ***********我的小店开始********** */
(function () {
    if (document.getElementById('store')) {
        var app = new Vue({
            el: '#store',
            data: {},
            methods: {},
            created: function created() {}
        });
    }
})();
/* ***********我的小店结束********** */

/* ***********佣金明细开始********** */
(function () {
    if (document.getElementById('commission')) {
        var app = new Vue({
            el: '#commission',
            data: {},
            methods: {},
            created: function created() {}
        });
    }
})();
/* ***********佣金明细结束********** */

/* ***********分销任务开始********** */
(function () {
    if (document.getElementById('task')) {
        var app = new Vue({
            el: '#task',
            data: {},
            methods: {},
            created: function created() {}
        });
    }
})();
/* ***********分销任务结束********** */

/* ***********订单明细开始********** */
(function () {
    if (document.getElementById('order')) {
        var app = new Vue({
            el: '#order',
            data: {},
            methods: {},
            created: function created() {}
        });
    }
})();
/* ***********订单明细结束********** */