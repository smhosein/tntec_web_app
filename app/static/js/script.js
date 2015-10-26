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


    // function initialize() {
    //     var infowindow = new google.maps.InfoWindow();
    //     var map = new google.maps.Map(
    //     document.getElementById('map_canvas'), {
    //       center: new google.maps.LatLng(10.455177, 12.584731),
    //       zoom: 2,
    //       mapTypeId: google.maps.MapTypeId.ROADMAP
          
    //     });
    //     console.log("init");
    //     function addMarker(lat,long,name,content){
    //     var info = content;
    //     var message = name;
    //     var point = new google.maps.LatLng(lat,long);
    //     var newmarker = new google.maps.Marker({position: point,
    //                                          map: map,
    //                                          title: name
    //                                         });
    //     // take this block of code out and I get all the markers fine 
    //      google.maps.event.addListener(newmarker, 'click', function(evt){
    //           infowindow.setContent(info)
    //           infowindow.open(map,newmarker)
    //       });
    //      console.log("marker");
    //     }


    //         var markers = [{lat:40, long: -117, name:"name1",url:"http://1.google.com"},
    //                        {lat:40, long: -117.1, name:"name2",url:"http://2.google.com"},
    //                        {lat:40.1, long: -117, name:"name3",url:"http://3.google.com"}];
    //         var bounds = new google.maps.LatLngBounds();
    //         for (var i=0; i < markers.length; i++) {  
    //              addMarker(markers[i].lat,markers[i].long,markers[i].name, markers[i].url);  
    //              bounds.extend(new google.maps.LatLng(markers[i].lat,markers[i].long));
    //         }
    //         map.fitBounds(bounds);
    // }

    // google.maps.event.addDomListener(window, 'load', initialize);




    // $("#data-btn").click(function(){
        

        $('#graph-1').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            $.get("get_data_val", function(data){
                                value = data['value'];
                                
                                var x = (new Date()).getTime(), // current time
                                    y = value.length;
                                series.addPoint([x, y], true, true);
                            }, "json");
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live  Data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
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
            }]
        });


        $('#graph-2').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Browser market shares January, 2015 to May, 2015'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: "Brands",
                colorByPoint: true,
                data: [["Anomlous",0],["Nominal",1]]
            }]
        });
        

        function add_to_pie(){
            var chart = $('#graph-2').highcharts();
            var anom;
            var nom;
            $.get("get_data_val", function(data){
                anom = data['count_anom'];
                nom = data['count_nom'];
                chart.series[0].setData([["Anomalous",Number(anom)],["Nominal",Number(nom)]]);
            }, "json");
            
            
        }

        var pie_interval = setInterval(add_to_pie,1000);



    // });

    $("#map-btn").click(function(){
        interval = setInterval(generate_map,1000);

    });

    $("#stop-btn").click(function(){
        clearInterval(interval);
    });



    function generate_map() {
        $.get("/get_data", function(data){
            lat = data['lat'];
            lon = data['long'];
            // value = data['value'];
            var i ;

            map = new google.maps.Map(
                document.getElementById('view-side'), {
                center: new google.maps.LatLng(10.383734, -61.244866),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            for (i = 0; i < lat.length; i++) { 
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat[i], lon[i]),
                    map: map,
                    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                });
            }
        },"json");
    }
    
//     $("#loadPortfolio").click(function(event) {
        
//         $.get("php/ajax_portfolio.html", function(data){
//             $('#morePortfolio').append(data);
//         });
//         event.preventDefault();
//         $(this).hide();
//     }) ;
// });

// $(document).ready(function () {
//     $("#loadGallery").click(function(event) {
        
//         $.get("php/ajax_gallery.html", function(data){
//             $('#moreGallery').append(data);
//         });
//         event.preventDefault();
//         $(this).hide();
//     }) ;
});