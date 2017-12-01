var can_place_station=false;
var can_place_MSstation=false;
var can_delete_station=false;

var map;
var markers=[];
var areas=[];
var Station_id=0;
function initMap() 
      {//create a map
       map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 49, lng: 24},
        mapTypeId: 'terrain',
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
      });

       var AddBaseLTE_Btn = document.createElement('div');
       var AddBaseLTE_Control = new Add_BS_LTE_Control(AddBaseLTE_Btn);
       AddBaseLTE_Btn.index = 1;
       map.controls[google.maps.ControlPosition.LEFT_TOP].push(AddBaseLTE_Btn);

       var AddMSLTE_Btn = document.createElement('div');
       var AddMSLTE_Control = new Add_MS_Control(AddBaseLTE_Btn);
       AddBaseLTE_Btn.index = 1;
       map.controls[google.maps.ControlPosition.LEFT_TOP].push(AddMSLTE_Btn);

       var ClearMap_Btn = document.createElement('div');
       var clearMap_Control = new ClearMap_Control(ClearMap_Btn);
       AddBaseLTE_Btn.index = 1;
       map.controls[google.maps.ControlPosition.LEFT_TOP].push(ClearMap_Btn);

       var DeleteBS_Btn = document.createElement('div');
       var deleteBS_Control = new DeleteBS_Control(DeleteBS_Btn);
       AddBaseLTE_Btn.index = 1;
       map.controls[google.maps.ControlPosition.LEFT_TOP].push(DeleteBS_Btn);

       google.maps.event.addListener(map,'click',function(e)
       {
        place_station(e.latLng.lat(),e.latLng.lng());
      });
     }

function place_station(lat,lng,gmap)
{
  var marker;
  if(can_place_station&&can_place_MSstation==false)
  {
    var icon = {
                url: "../img/BaseStation_icon.png", // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(15, 30) // anchor
              };

              marker = new google.maps.Marker({
               position: new google.maps.LatLng(lat,lng),
               map: map,
               icon:icon,
               title: Station_id.toString()
             });
              Station_id+=1;
              marker.addListener('click', function() {
                deleteStation(this);
              });
              place_station_cover(lat,lng,[2,4,6]);//((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))
              markers.push(marker);
          
             // can_place_station=false;
           }
           else if (can_place_station==false&&can_place_MSstation) {
             var icon = {
                url: "../img/mobile_station.png", // url
                scaledSize: new google.maps.Size(30, 30), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(15, 30) // anchor
              };

              marker = new google.maps.Marker({
               position: new google.maps.LatLng(lat,lng),
               map: map,
               icon:icon,
               title: 'Click to zoom'
             });
              markers.push(marker);

             // can_place_MSstation=false;
           } 
         }

         function place_station_agreement(sender)
    {//can you place station?
      if(sender.id=='Add_MS_Btn'){can_place_MSstation=!can_place_MSstation; can_place_station=false;}
      else if(sender.id=='Add_BS_Btn'){can_place_station=!can_place_station; can_place_MSstation=false;}
    }

    function place_station_cover(lat,lng,radius)
    {
      for(var i=0;i<radius.length;i++)
      {
        var circle = new google.maps.Circle({
          strokeColor: '#FF'+i.toString()+i.toString()+'00',
          strokeOpacity: 0.2*i,
          strokeWeight: 1*i,
          fillColor: '#FF'+i.toString()+i.toString()+'00',
          fillOpacity: 0.35,
          map: map,
          center: new google.maps.LatLng(lat,lng),
          radius:radius[i]*1000
        },);
        areas.push(circle);
        google.maps.event.addListener(circle,'click',function(e){
          place_station(e.latLng.lat(),e.latLng.lng());
        });
      }
    }

    
function deleteStation (station) {
if(!can_delete_station)return;
  for(var i=areas.length-1;i>=0;i--){
    if(areas[i].center.lat()==station.position.lat()&&areas[i].center.lng()==station.position.lng()){
      areas[i].setMap(null);
      areas.splice(i,1);
      console.log(areas.length)

    }
  }
  for(var i=markers.length-1;i>=0;i--){
    if(markers[i]==station){
      markers[i].setMap(null);
      markers.splice(i,1);
      Station_id--;
      return;
    }
  }
}
function clear_map() {//delete all obj from map
  setMapOnAll(areas,null);
  setMapOnAll(markers,null);
  Station_id=0;
}
function setMapOnAll(mark,map1) {
  for (var i = 0; i < mark.length; i++) {
    mark[i].setMap(map1);
    mark[i]=null;
  }
  if(map1==null)mark.length=0;
}

////////////////////
//Custom Buttons
//////////////////
function Add_BS_LTE_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="Add_BS_Btn";
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.display = 'block';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Add LTE Base station';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Add LTE BASE';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    place_station_agreement(this);
    var anotherBtn= document.getElementById('Add_MS_Btn');
    anotherBtn.style.backgroundColor = 'white';
    if(can_place_station&&!can_place_MSstation)this.style.backgroundColor='green';
    else this.style.backgroundColor='white';
  });
}

function Add_MS_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="Add_MS_Btn";
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Add MS Base station';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Add MS BASE';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    place_station_agreement(this);
    var anotherBtn= document.getElementById('Add_BS_Btn');
    anotherBtn.style.backgroundColor = 'white';
    if(can_place_MSstation)this.style.backgroundColor='green';
    else this.style.backgroundColor='white';
  });
}
function DeleteBS_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="DeleteBS_Btn";
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Delete Base stations';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Delete Base Station';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    can_delete_station=!can_delete_station;
    if(can_delete_station==true){
      this.style.backgroundColor='green';
    }
     else this.style.backgroundColor='white';
  });
}


function ClearMap_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="Clear_Btn";
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Delete Base and mobile stations';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Clear Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    clear_map();
  });
}
   