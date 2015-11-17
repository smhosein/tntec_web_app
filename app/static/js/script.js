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
    var i;
        
        // $('#graph-1').highcharts({
        //     chart: {
        //         type: 'spline',
        //         animation: Highcharts.svg, // don't animate in old IE
        //         marginRight: 10,
        //         events: {
        //             load: function () {

        //                 // set up the updating of the chart each second
        //                 var series = this.series[0];
        //                 setInterval(function () {
        //                     $.get("get_data_val", function(data){
        //                         value = data['value'];
                                
        //                         var x = (new Date()).getTime(), // current time
        //                             y = value.length;
        //                         series.addPoint([x, y], true, true);
        //                     }, "json");
        //                 }, 1000);
        //             }
        //         }
        //     },
        //     title: {
        //         text: 'Live  Data'
        //     },
        //     xAxis: {
        //         type: 'datetime',
        //         tickPixelInterval: 150
        //     },
        //     yAxis: {
        //         title: {
        //             text: 'Value'
        //         },
        //         plotLines: [{
        //             value: 0,
        //             width: 1,
        //             color: '#808080'
        //         }]
        //     },
        //     tooltip: {
        //         formatter: function () {
        //             return '<b>' + this.series.name + '</b><br/>' +
        //                 Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
        //                 Highcharts.numberFormat(this.y, 2);
        //         }
        //     },
        //     legend: {
        //         enabled: false
        //     },
        //     exporting: {
        //         enabled: false
        //     },
        //     series: [{
        //         name: 'Random data',
        //         data: (function () {
        //             // generate an array of random data
        //             var data = [],
        //                 time = (new Date()).getTime(),
        //                 i;

        //             for (i = -19; i <= 0; i += 1) {
        //                 data.push({
        //                     x: time + i * 1000,
        //                     y: 0
        //                 });
        //             }
        //             return data;
        //         }())
        //     }]
        // });


        // $('#graph-2').highcharts({
        //     chart: {
        //         plotBackgroundColor: null,
        //         plotBorderWidth: null,
        //         plotShadow: false,
        //         type: 'pie'
        //     },
        //     title: {
        //         text: 'Browser market shares January, 2015 to May, 2015'
        //     },
        //     tooltip: {
        //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        //     },
        //     plotOptions: {
        //         pie: {
        //             allowPointSelect: true,
        //             cursor: 'pointer',
        //             dataLabels: {
        //                 enabled: true,
        //                 format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        //                 style: {
        //                     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
        //                 }
        //             }
        //         }
        //     },
        //     series: [{
        //         name: "Brands",
        //         colorByPoint: true,
        //         data: [["Anomlous",0],["Nominal",1]]
        //     }]
        // });
        

        // function add_to_pie(){
        //     var chart = $('#graph-2').highcharts();
        //     var anom;
        //     var nom;
        //     $.get("get_data_val", function(data){
        //         anom = data['count_anom'];
        //         nom = data['count_nom'];
        //         chart.series[0].setData([["Anomalous",Number(anom)],["Nominal",Number(nom)]]);
        //     }, "json");
            
            
        // }

        // var pie_interval = setInterval(add_to_pie,1000);


    $("#map-btn").click(function(){
        map = new google.maps.Map(
                document.getElementById('view-side'), {
                center: new google.maps.LatLng(10.383734, -61.244866),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        //intialize all the data points
        $.get("get_data_points", function(data){
                lat = data['lat'];
                lon = data['long'];
                var i;
                for (i = 0; i < lat.length; i++) { 

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0"
                    });
                }
            }, "json");

        //add ccu
        var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(10.383734, -61.244866),
                        map: map,
                        icon: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue.png"
                    });

        var time = 0;

        i = setInterval( get_pon, 3000 );

        function get_pon(){
            $.get("/get_data/"+time , function(data){
                lat = data['lat'];
                lon = data['long'];
                pon = data['pon'];

                var i ;
                for (i = 0; i < lat.length; i++) { 
                    
                    var icon = "";
                    switch (pon[i]) {
                        case 0:   //means sending out pon
                            icon = "125";
                            break;
                        case 1: //means it is running
                            icon = "129";
                            break;
                        default:
                            icon = "129";
                            break;

                    }
                    // icon = "https://storage.googleapis.com/support-kms-prod/SNP_2752" + icon + "_en_v0";
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat[i], lon[i]),
                        map: map,
                        icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752" + icon + "_en_v0"
                    });
                }
                
            },"json");
            time = time + 10;
        }

        // a = 100;
        // var i = setInterval( timer, 1000 );

        // function timer() {
        //     console.log( a );
        //     if ( a < 1 ) {
        //         console.log( 'Reaching Stop' ); 
        //         clearInterval( i );
        //         return;         
        //     } 
        //     a -= 1;
        // }

    }); //end map-btn

    $("#stop-btn").click(function(){
        clearInterval(interval);
        clearInterval(i);
    });
    
});