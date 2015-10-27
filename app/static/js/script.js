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



    $("#map-btn").click(function(){
        map = new google.maps.Map(
                document.getElementById('view-side'), {
                center: new google.maps.LatLng(10.383734, -61.244866),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        $.get("/get_data", function(data){
            lat = data['lat'];
            lon = data['long'];
            cl = data['color'];

            var i ;
            for (i = 0; i < lat.length; i++) { 
                
                var icon = "";
                switch (cl[i]) {
                    case 0:
                        icon = "125";
                        break;
                    case 1:
                        icon = "063";
                        break;
                    case 2:
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
        // interval = setInterval(generate_map(),1000);

    });


    $("#map-btn").click(function(){
        map = new google.maps.Map(
                document.getElementById('view-side'), {
                center: new google.maps.LatLng(10.383734, -61.244866),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        interval = setInterval(function(){
            $.get("/get_data", function(data){
                lat = data['lat'];
                lon = data['long'];
                cl = data['color'];

                var i ;
                for (i = 0; i < lat.length; i++) { 
                    
                    var icon = "";
                    switch (cl[i]) {
                        case 0:
                            icon = "125";
                            break;
                        case 1:
                            icon = "063";
                            break;
                        case 2:
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
        }, 1000);
        
        // interval = setInterval(generate_map(),1000);

    });

    $("#stop-btn").click(function(){
        clearInterval(interval);
    });
    
});