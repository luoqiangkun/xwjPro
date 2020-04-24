'use strict';

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
                    var _this = this;

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
                            _this.addressLists = result.data.items;
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
                        'apply_type': 1
                    };
                    $.request({
                        type: 'post',
                        url: ApiUrl + '/index.php?ctl=Store&met=apply&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            if (res.status === 200) {
                                window.location.href = '/dist/views/result.html?id=' + res.data.apply_id;
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
                        'apply_type': 2
                    };
                    $.request({
                        type: 'post',
                        url: ApiUrl + '/index.php?ctl=Store&met=apply&typ=json',
                        data: params,
                        dataType: 'json',
                        success: function success(res) {
                            if (res.status === 200) {
                                window.location.href = '/dist/views/result.html?id=' + res.data.apply_id;
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
                    var _this2 = this;

                    $.request({
                        type: 'get',
                        url: ApiUrl + '/index.php?ctl=Store&met=applyInfo&typ=json',
                        data: { apply_id: this.id },
                        dataType: 'json',
                        success: function success(res) {
                            _this2.state = res.data.apply_state;
                            _this2.type = res.data.apply_type;
                        }
                    });
                }
            },
            created: function created() {
                this.id = getQueryString('id');
                this.getData();
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
            methods: {},
            created: function created() {}
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
            methods: {},
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