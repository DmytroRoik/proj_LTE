function initMap() 
      {//create a map
          var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 10,
              center: {lat: 49, lng: 24},
              mapTypeId: 'terrain'
            });

        google.maps.event.addListener(map,"click",function(e)
        {
            place_station(e.latLng.lat(),e.latLng.lng());
        });
      }