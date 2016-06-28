///////////////////////////////
// Fix the Home Height
///////////////////////////////
$(function() {
    var setHomeBannerHeight = function(){
        var homeHeight= $(window).height();
        $('#height-fix').height(homeHeight);
    }

    setHomeBannerHeight();
});


/*=================================================================
            Load more
===================================================================*/

$(document).ready(function () {

    var map;
    var interval = null;
    var ccu_interval, fault_interval;
    // var  gmarkers = [];
    var markers = {};

    /**
     * Concatenates given lat and lng with an underscore and returns it.
     * This id will be used as a key of marker to cache the marker in markers object.
     * @param {!number} lat Latitude.
     * @param {!number} lng Longitude.
     * @return {string} Concatenated marker id.
     */
    var getMarkerUniqueId= function(lat, lng) {
        return lat + '_' + lng;
    }

    /**
     * Creates an instance of google.maps.LatLng by given lat and lng values and returns it.
     * This function can be useful for getting new coordinates quickly.
     * @param {!number} lat Latitude.
     * @param {!number} lng Longitude.
     * @return {google.maps.LatLng} An instance of google.maps.LatLng object
     */ 
    // var getLatLng = function(lat, lng) {
    //     return new google.maps.LatLng(lat, lng);
    // };

    /**
     * Binds click event to given map and invokes a callback that appends a new marker to clicked location.
     */ 
    // var addMarker = google.maps.event.addListener(map, 'click', function(e) {
    //     var lat = e.latLng.lat(); // lat of clicked point
    //     var lng = e.latLng.lng(); // lng of clicked point
    //     var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.
    //     var marker = new google.maps.Marker({
    //         position: getLatLng(lat, lng),
    //         map: map,
    //         id: 'marker_' + markerId
    //     });
    //     markers[markerId] = marker; // cache marker in markers object
    //     bindMarkerEvents(marker); // bind right click event to marker
    // });

    /**
     * Binds right click event to given marker and invokes a callback function that will remove the marker from map.
     * @param {!google.maps.Marker} marker A google.maps.Marker instance that the handler will binded.
     */ 
    // var bindMarkerEvents = function(marker) {
    //     google.maps.event.addListener(marker, "rightclick", function (point) {
    //         var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
    //         var marker = markers[markerId]; // find marker
    //         removeMarker(marker, markerId); // remove it
    //     });
    // };

    /**
     * Removes given marker from map.
     * @param {!google.maps.Marker} marker A google.maps.Marker instance that will be removed.
     * @param {!string} markerId Id of marker.
     */ 
    var removeMarker = function(marker, markerId) {
        marker.setMap(null); // set markers setMap to null to remove it from map
        delete markers[markerId]; // delete marker instance from markers object
    };

    $('#graph-1').highcharts({
        chart: {
            colors: ['#0000FF', '#0066FF', '#00CCFF'],
            // type: 'spline',
            // zoomType: 'x',
            animation: Highcharts.svg, // don't animate in old IE
            // marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    var series2 = this.series[1];
                    var series3 = this.series[2];
                    setInterval(function () {
                        $.get("get_outage", function(data){                            
                            var x = (new Date()).getTime(), // current time
                                y = data['val'];
                                // z = data['cust'];
                            console.log((new Date()).getTime());
                            console.log(x);
                            series.addPoint([x, y], false, true);
                            // series2.addPoint([x, z], true, true);
                            series2.addPoint([x, 5], true, true);
                        }, "json");
                    }, 5000);
                }
            }
        },
        title: {
            text: 'Average User Outage per Hour'
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: [
        // {
        //     title: {
        //         text: 'Number of Customers'
        //     },
        //     opposite:true,
        //     labels: {
        //         align: 'left'
        //     }
        //     },
            { // Secondary yAxis
                // gridLineWidth: 0,
                title: {
                    text: 'Outage Time (minutes)',
                    
                },
        }],
        // tooltip: {
        //     formatter: function () {
        //         return '<b>' + this.series.name + '</b><br/>' +
        //             Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
        //             Highcharts.numberFormat(this.y, 2);
        //     },
        //     shared: true
        // },
        legend: {
            layout: 'vertical',
            align: 'left',
            // x: 80,
            verticalAlign: 'top',
            // y: 55,
            floating: true,
            // backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        exporting: {
            enabled: true
        },
        series: [{
            type: 'area',
            name: 'avg outage time',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -4; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            }())
        },
        // {
        //     // type: 'area',
        //     type: 'spline',
        //     name: 'customers',
        //     data: (function () {
        //         // generate an array of random data
        //         var data = [],
        //             time = (new Date()).getTime(),
        //             i;

        //         for (i = -4; i <= 0; i += 1) {
        //             data.push({
        //                 x: time + i * 1000,
        //                 y: 0
        //             });
        //         }
        //         return data;
        //     }())
        // },
        {
            // type: 'area',
            type: 'spline',
            name: 'threshold',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -4; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 5
                    });
                }
                return data;
            }())
        }]
    }); //end graph 1


    $('#graph-2').highcharts({
        chart: {
            type: 'spline',
            colors: ['#0066FF', '#0066FF'],
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    var series2 = this.series[1];
                    setInterval(function () {
                        $.get("get_outage", function(data){
                            value = data['out_p'];
                            
                            var x = (new Date()).getTime(), // current time
                                y = value;
                            series.addPoint([x, y], true, true);
                            series2.addPoint([x, 13], true, true);
                        }, "json");
                    }, 5000);
                }
            }
        },
        title: {
            text: 'Health'
        },
        xAxis: {
            title: {
                text: 'Time'
            },
            type: 'datetime',

            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Cutomers with Failures (%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            // x: 80,
            verticalAlign: 'top',
            // y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        exporting: {
            enabled: true
        },
        series: [{
            name: 'Data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -5; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            }())
        },
        {
            // type: 'area',
            type: 'spline',
            name: 'threshold',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -5; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 13
                    });
                }
                return data;
            }())
        }]
    }); //end of graph 2


    $('#graph-3').highcharts({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    var series2 = this.series[1];
                    setInterval(function () {
                        $.get("get_trans_outage", function(data){
                            value = data['out_p'];
                            
                            var x = (new Date()).getTime(), // current time
                                y = value;
                            series.addPoint([x, y], true, true);
                            series2.addPoint([x, 10], true, true);
                        }, "json");
                    }, 5000);
                }
            }
        },
        title: {
            text: 'Percent of Transformer Failures'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Transformers with Failures (%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        exporting: {
            enabled: true
        },
        series: [{
            name: 'Data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 0
                    });
                }
                return data;
            }())
        },
        {
            name: 'threshold',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: 10
                    });
                }
                return data;
            }())
        }]
    }); //end of graph 3
    
            // var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
            // var marker = markers[markerId]; // find marker
            // removeMarker(marker, markerId); // remove it

    // $("#map-btn").click(function(){
    //     map = new google.maps.Map(
    //             document.getElementById('view-side'), {
    //             center: new google.maps.LatLng(10.383734, -61.244866),
    //             zoom: 10,
    //             mapTypeId: google.maps.MapTypeId.ROADMAP
    //         });

    //     //get all the data points and display
    //     $.get("get_data_points", function(data){
    //             lat = data['lat'];
    //             lon = data['long'];
    //             var i;
    //             for (i = 0; i < lat.length; i++) { 
    //                 var markerId = getMarkerUniqueId(lat[i], lon[i]);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(lat[i], lon[i]),
    //                     map: map,
    //                     icon: "http://www.geocodezip.com/mapIcons/small_green_dot.png"
    //                 });
    //                 // gmarkers.push(marker);
    //                 markers[markerId] = marker;
    //             }
    //         }, "json");

    //     //add tranformers, power stations and substations
    //     $.get("get_stations_points", function(data){
    //             lat = data['lat'];
    //             lon = data['long'];
    //             var i;
                
    //             // add transformers
    //             for (i = 0; i < 20; i++) { 
    //                 var markerId = getMarkerUniqueId(lat[i], lon[i]);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(lat[i], lon[i]),
    //                     map: map,
    //                     icon: "http://maps.google.com/mapfiles/kml/paddle/blu-square-lv.png"
    //                 });
    //                 // gmarkers.push(marker);
    //                 markers[markerId] = marker;
    //             }

    //             // add substations
    //             for (i = 20; i < 22; i++) { 
    //                 var markerId = getMarkerUniqueId(lat[i], lon[i]);
    //                 var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(lat[i], lon[i]),
    //                     map: map,
    //                     icon: "http://maps.google.com/mapfiles/kml/paddle/blu-diamond.png"
    //                 });
    //                 // gmarkers.push(marker);
    //                 markers[markerId] = marker;
    //             }

    //             var markerId = getMarkerUniqueId(10.383734, -61.244866);
    //             // add power station
    //             var marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(10.383734, -61.244866),
    //                     map: map,
    //                     icon: "http://maps.google.com/mapfiles/kml/paddle/blu-stars.png"
    //                 });
    //             // gmarkers.push(marker);
    //             markers[markerId] = marker;

    //         }, "json");

    //     var time = 0;

    //     // i = setInterval( get_pon, 3000 );

    //     // function get_pon(){
    //     //     $.get("/get_data/"+time , function(data){
    //     //         lat = data['lat'];
    //     //         lon = data['long'];
    //     //         pon = data['pon'];

    //     //         var i ;
    //     //         for (i = 0; i < lat.length; i++) { 
                    
    //     //             var icon = "";
    //     //             switch (pon[i]) {
    //     //                 case 0:   //means sending out pon
    //     //                     icon = "125";
    //     //                     break;
    //     //                 case 1: //means it is running
    //     //                     icon = "129";
    //     //                     break;
    //     //                 default:
    //     //                     icon = "129";
    //     //                     break;

    //     //             }
    //     //             // icon = "https://storage.googleapis.com/support-kms-prod/SNP_2752" + icon + "_en_v0";
    //     //             var marker = new google.maps.Marker({
    //     //                 position: new google.maps.LatLng(lat[i], lon[i]),
    //     //                 map: map,
    //     //                 icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752" + icon + "_en_v0"
    //     //             });
    //     //         }
                
    //     //     },"json");
    //     //     time = time + 10;
    //     // }

    //     // a = 100;
    //     // var i = setInterval( timer, 1000 );

    //     // function timer() {
    //     //     console.log( a );
    //     //     if ( a < 1 ) {
    //     //         console.log( 'Reaching Stop' ); 
    //     //         clearInterval( i );
    //     //         return;         
    //     //     } 
    //     //     a -= 1;
    //     // }

    // }); //end map-btn

    $("#map-btn-ccu").click(function(){

        
        clearInterval(fault_interval);
        map = new google.maps.Map(
                document.getElementById('view-side'), {
                center: new google.maps.LatLng(10.383734, -61.244866),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

        //get all the data points and display
        $.get("get_data_points", function(data){
                lat = data['lat'];
                lon = data['long'];
                var i;
                for (i = 0; i < lat.length; i++) { 
                    var markerId = getMarkerUniqueId(lat[i], lon[i]);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: "http://www.geocodezip.com/mapIcons/small_green_dot.png"
                    });
                    // gmarkers.push(marker);
                    markers[markerId] = marker;
                }
            }, "json");

        var markerId = getMarkerUniqueId(10.457549, -61.349466);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(10.457549, -61.349466),
            map: map,
            icon: "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png"
        });
        // gmarkers.push(marker);
        markers[markerId] = marker;

        var markerId = getMarkerUniqueId(10.431873, -61.131320);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(10.431873, -61.131320),
            map: map,
            icon: "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png"
        });
        // gmarkers.push(marker);
        markers[markerId] = marker;



        ccu_interval = setInterval( get_pon, 3000 );

        function get_pon(){
            $.get("/get_data", function(data){
                lat = data['lat'];
                lon = data['long'];
                pon = data['pon'];
                sub = data['sub'];
                console.log(sub);
                var i, icn;
                for (i = 0; i < lat.length; i++) { 
                    
                    if(pon[i] == 1 ) {
                        icn = "http://www.geocodezip.com/mapIcons/small_red_dot.png"
                    } else {
                         icn = "http://www.geocodezip.com/mapIcons/small_green_dot.png"
                    }
                    var markerId = getMarkerUniqueId(lat[i], lon[i]); // get marker id by using clicked point's coordinate
                    var marker = markers[markerId]; // find marker
                    removeMarker(marker, markerId); // remove it

                    var markerId = getMarkerUniqueId(lat[i], lon[i]);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: icn
                    });
                    // icon = "https://storage.googleapis.com/support-kms-prod/SNP_2752" + icon + "_en_v0";
                    // gmarkers.push(marker);
                    markers[markerId] = marker;
                }

                var icn_1 = "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png";
                var icn_2 = "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png"
                

                for (i = 0; i < sub.length; i++) {
                    if(sub[i] == 1) {
                        console.log("i1");
                        icn_1 = "http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png"
                    }

                    if(sub[i] == 2){
                        console.log("i2");
                         icn_2 = "http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png"
                    }
                }// end for

                var markerId = getMarkerUniqueId(10.457549, -61.349466); // get marker id by using clicked point's coordinate
                var marker = markers[markerId]; // find marker
                removeMarker(marker, markerId); // remove it

                var markerId = getMarkerUniqueId(10.457549, -61.349466);
                // console.log("icn_1 is" + icn_1)
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(10.457549, -61.349466),
                    map: map,
                    icon: icn_1
                });
                // gmarkers.push(marker);
                markers[markerId] = marker;

                var markerId = getMarkerUniqueId(10.431873, -61.131320); // get marker id by using clicked point's coordinate
                var marker = markers[markerId]; // find marker
                removeMarker(marker, markerId); // remove it

                var markerId = getMarkerUniqueId(10.431873, -61.131320);
                // console.log("icn_2 is" + icn_2)
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(10.431873, -61.131320),
                    map: map,
                    icon: icn_2
                });
                // gmarkers.push(marker);
                markers[markerId] = marker;

            },"json");
        }

    }); //end map-ccu

    $("#stop-btn").click(function(){
        clearInterval(ccu_interval);
        clearInterval(fault_interval);
    });
    
    $("#map-btn-fault").click(function(){
        // map = new google.maps.Map(
        //         document.getElementById('view-side'), {
        //         center: new google.maps.LatLng(10.383734, -61.244866),
        //         zoom: 10,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     });
        clearInterval(ccu_interval);

        map = new google.maps.Map(
                document.getElementById('view-side'), {
                center: new google.maps.LatLng(10.383734, -61.244866),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

        //get all the data points and display
        $.get("get_data_points", function(data){
                lat = data['lat'];
                lon = data['long'];
                var i;
                for (i = 0; i < lat.length; i++) { 
                    var markerId = getMarkerUniqueId(lat[i], lon[i]);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: "http://www.geocodezip.com/mapIcons/small_green_dot.png"
                    });
                    // gmarkers.push(marker);
                    markers[markerId] = marker;
                }
            }, "json");

        //add tranformers, power stations and substations
        $.get("get_stations_points", function(data){
                lat = data['lat'];
                lon = data['long'];
                var i;
                
                // add transformers
                for (i = 0; i < 20; i++) { 
                    var markerId = getMarkerUniqueId(lat[i], lon[i]);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: "http://maps.google.com/mapfiles/kml/paddle/blu-square-lv.png"
                    });
                    // gmarkers.push(marker);
                    markers[markerId] = marker;
                }

                // add substations
                for (i = 20; i < 22; i++) { 
                    var markerId = getMarkerUniqueId(lat[i], lon[i]);
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: "http://maps.google.com/mapfiles/kml/paddle/blu-diamond.png"
                    });
                    // gmarkers.push(marker);
                    markers[markerId] = marker;
                }

                var markerId = getMarkerUniqueId(10.383734, -61.244866);
                // add power station
                var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(10.383734, -61.244866),
                        map: map,
                        icon: "http://maps.google.com/mapfiles/kml/paddle/blu-stars.png"
                    });
                // gmarkers.push(marker);
                markers[markerId] = marker;

            }, "json");

        fault_interval = setInterval( get_faults, 3000 );

        function get_faults(){
            //get all the data points and display
            $.get("get_faults", function(data){
                    sm_pon = data['sm_pon']; //meters pon
                    tr_pon = data['tr_pon']; //tranformer pon
                    sb_pon = data['sb_pon']; //substation pon
                    ps_pon = data['ps_pon']; //power station pon
                    sm_lat = data['sm_lat']; //meters latitude
                    sm_lon = data['sm_lon']; //meters long
                    s_lat = data['s_lat']; //stations latitude
                    s_lon = data['s_lon']; //stations long

                    console.log(tr_pon);

                    var i;
                    for (i = 0; i < sm_pon.length; i++) {
                        var markerId = getMarkerUniqueId(sm_lat[i], sm_lon[i]); // get marker id by using clicked point's coordinate
                        var marker = markers[markerId]; // find marker
                        removeMarker(marker, markerId); // remove it

                        if(sm_pon[i] === 1) {
                            var markerId = getMarkerUniqueId(sm_lat[i], sm_lon[i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(sm_lat[i], sm_lon[i]),
                                map: map,
                                icon: "http://www.geocodezip.com/mapIcons/small_yellow_dot.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;
                        } else {
                            var markerId = getMarkerUniqueId(sm_lat[i], sm_lon[i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(sm_lat[i], sm_lon[i]),
                                map: map,
                                icon: "http://www.geocodezip.com/mapIcons/small_green_dot.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;

                        }
                            
                    }//end for 

                    for (i = 0; i < tr_pon.length; i++) { 
                        var markerId = getMarkerUniqueId(s_lat[i], s_lon[i]); // get marker id by using clicked point's coordinate
                        var marker = markers[markerId]; // find marker
                        removeMarker(marker, markerId); // remove it

                        if(tr_pon[i] === 1) {
                            var markerId = getMarkerUniqueId(s_lat[i], s_lon[i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(s_lat[i], s_lon[i]),
                                map: map,
                                icon: "http://maps.google.com/mapfiles/kml/paddle/ylw-square-lv.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;
                        } else if(tr_pon[i] === -1) {
                            var markerId = getMarkerUniqueId(s_lat[i], s_lon[i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(s_lat[i], s_lon[i]),
                                map: map,
                                icon: "http://maps.google.com/mapfiles/kml/paddle/stop-lv.png"
                            });
                            // gmarkers.push(marker); 
                            markers[markerId] = marker; 
                        } else {
                            var markerId = getMarkerUniqueId(s_lat[i], s_lon[i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(s_lat[i], s_lon[i]),
                                map: map,
                                icon: "http://maps.google.com/mapfiles/kml/paddle/blu-square-lv.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;  
                        }//end if
                    }//end for

                    for (i = 0; i < sb_pon.length; i++) { //substations down
                        var markerId = getMarkerUniqueId(s_lat[20+i], s_lon[20+i]); // get marker id by using clicked point's coordinate
                        var marker = markers[markerId]; // find marker
                        removeMarker(marker, markerId); // remove it

                        if(sb_pon[i] === 1) {
                            var markerId = getMarkerUniqueId(s_lat[20+i], s_lon[20+i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(s_lat[20+i], s_lon[20+i]),
                                map: map,
                                icon: "http://maps.google.com/mapfiles/kml/paddle/orange-diamond.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;
                        } else if(sb_pon[i] === -1) {
                            var markerId = getMarkerUniqueId(s_lat[20+i], s_lon[20+i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(s_lat[20+i], s_lon[20+i]),
                                map: map,
                                icon: "http://maps.google.com/mapfiles/kml/paddle/red-diamond.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;  
                        } else {
                            var markerId = getMarkerUniqueId(s_lat[20+i], s_lon[20+i]);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(s_lat[20+i], s_lon[20+i]),
                                map: map,
                                icon: "http://maps.google.com/mapfiles/kml/paddle/blu-diamond.png"
                            });
                            // gmarkers.push(marker);
                            markers[markerId] = marker;  
                        }//end if
                    }//end for

                    var markerId = getMarkerUniqueId(10.383734, -61.244866); // get marker id by using clicked point's coordinate
                    var marker = markers[markerId]; // find marker
                    removeMarker(marker, markerId); // remove it
                    if(ps_pon[0] === -1) { //power station down

                        var markerId = getMarkerUniqueId(10.383734, -61.244866);
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(10.383734, -61.244866),
                            map: map,
                            icon: "http://maps.google.com/mapfiles/kml/paddle/red-stars.png"
                        });
                        // gmarkers.push(marker);
                        markers[markerId] = marker;
                    } else {
                        var markerId = getMarkerUniqueId(10.383734, -61.244866);
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(10.383734, -61.244866),
                            map: map,
                            icon: "http://maps.google.com/mapfiles/kml/paddle/blu-stars.png"
                        });
                        // gmarkers.push(marker);
                        markers[markerId] = marker;  
                    }//end if

                }, "json"); //end get_data_points

        } //end get fault function        

    }); //end map-fault

    $("#clear-btn").click(function(){
        // for(i=0; i< gmarkers.length; i++){
        //     gmarkers[i].setMap(null);
        // }
        for(var id in markers) {
            var marker = markers[id]; // find marker
            removeMarker(marker, id); // remove it
        }
    }); //end of stop button
    
});