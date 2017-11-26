var can_place_station=false;
var map;
function initMap() 
      {//create a map
           map = new google.maps.Map(document.getElementById('map'), {
              zoom: 10,
              center: {lat: 49, lng: 24},
              mapTypeId: 'terrain'
            });

        google.maps.event.addListener(map,"click",function(e)
        {
            place_station(e.latLng.lat(),e.latLng.lng());
        });
      }

//////////////////////////////////////////////////////////////
var can_place_station=false;
var map;
function place_station(lat,lng,gmap)
    {
        if(can_place_station)
        {
            var icon = {
            url: "https://cdn2.iconfinder.com/data/icons/hotel-and-restaurant-solid-icons-vol-1/64/013-128.png", // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(15, 30) // anchor
            };

            var marker = new google.maps.Marker({
             position: new google.maps.LatLng(lat,lng),
             map: map,
             icon:icon,
            title: 'Click to zoom'
             });
            markers.push(marker);
            can_place_station=false;
        }
    }
    function place_station_agreement()
    {//can you place station?
        can_place_station=!can_place_station;
    }

    function place_station_cover(lat,lng)
    {
        var circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(lat,lng),
            radius:100000
        },);
        return circle;
    }

 function setMapOnAll(mark,map1) {
    for (var i = 0; i < mark.length; i++) {
      mark[i].setMap(map1);
      mark[i]=null;
    }
    if(map1==null)mark.length=0;
  }
function clear_map(argument) {//delete all obj from map
    setMapOnAll(areas,null);
    setMapOnAll(markers,null);
}
    function show_stations_cover()//pred_cover_button
    {//show actions area each station
        if(areas.length>0){setMapOnAll(areas,null);}
        
        for(var i=0;i<markers.length;i++)
        {   
            console.log(markers[i].position.lat()+"iii"+markers[i].position.lng());
            areas.push(place_station_cover(markers[i].position.lat(),markers[i].position.lng()));
        }
    }