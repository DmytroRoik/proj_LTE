var can_place_station=false;
var can_place_MSstation=false;
var can_delete_station=false;

var map;

var MStation_id=0;
var Station_id=0;

var bsStations=[],
msStation=[];


function BaseStation(id,position,radius,title){
  this.position=position;
  this.id=id;
  this.mobileStations_id=[];
  this.typeStation = 'BS';
  this.power=20;
  this.h=30;//м над землею
  this.deltaF=10;//MHz
  this.speed={
    uplink:1,
    downlink:1
  }
  this.area = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.2,
    strokeWeight: 1,
    fillColor: '#FF8700',
    fillOpacity: 0.35,
    map: map,
    center: new google.maps.LatLng(position.lat,position.lng),
    radius: radius
  });
  
  this.icon= {
       url: "./img/BaseStation_icon.png", // url
       scaledSize: new google.maps.Size(30, 30), // scaled size
       origin: new google.maps.Point(0,0), // origin
       anchor: new google.maps.Point(15, 30) // anchor
     };

     this.marker = new google.maps.Marker({
       position: new google.maps.LatLng(position.lat,position.lng),
       map: map,
       icon: this.icon,
       title: title
     });
     
     var temp_self= this;
     
     this.marker.addListener('click', function () {
      if(!can_delete_station){
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading"> BS № '+temp_self.id+'</h1>'+
        '<div id="bodyContent">'+
        '<span>Radius of coverage: '+temp_self.area.radius +' m</span><br>'+
        '<span>Power: '+temp_self.power +' dBm</span><br>'+
        '<span>Mobile station numbers: '+temp_self.mobileStations_id.join(' , ') +';</span><br>'+
        '<span>Speed:</span><br>'+
        '<span> Uplink: '+temp_self.speed.uplink.toFixed(2) +'Mbit/s</span><br>'+
        '<span> Downlink: '+temp_self.speed.downlink.toFixed(2) +'Mbit/s</span><br>'+
        '</div>'+
        '</div>';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(map,this);
      }
      else deleteStation(temp_self);
    }); 

     google.maps.event.addListener(this.area,'click',function(e){
      place_station(e.latLng.lat(),e.latLng.lng());
    });
   }

   function MobileStation (id,position,BS_id,title) {
    this.position=position;
    this.id=id;
    this.BS_id=BS_id;
    this.typeStation = 'MS';
    this.distanceToBS=undefined;
    this.sensetive=undefined;//dB
    // this.speed={
    //   uplink: 
    //   downlink: 4/7*2.38=
    // }
    this.icon= {
       url: "./img/mobile_station.png", // url
       scaledSize: new google.maps.Size(30, 30), // scaled size
       origin: new google.maps.Point(0,0), // origin
       anchor: new google.maps.Point(15, 30) // anchor
     };

     this.marker = new google.maps.Marker({
       position: new google.maps.LatLng(position.lat,position.lng),
       map: map,
       icon: this.icon,
       title: BS_id==-1?"Не під'єднано до станції" : title
     });
     var temp_self=this;
     this.marker.addListener('click', function() {
      if(!can_delete_station){
        var temp_string=[temp_self.BS_id==-1?"No connection! ":temp_self.BS_id,
                         temp_self.sensetive==undefined?"No signal": -temp_self.sensetive.toFixed(2)+' dBm',
                         temp_self.distanceToBS==undefined?"infinity": temp_self.distanceToBS.toFixed(2)+' m'
        ];
           
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading"> MS № '+temp_self.id+'</h1>'+
        '<div id="bodyContent">'+
        '<span>Connected to BS: '+ temp_string[0]+'</span><br>'+
        '<span>Signal level: '+ temp_string[1] +'</span><br>'+
        '<span>Distance to BS: '+ temp_string[2] +'</span><br>'+
        '<span>Speed:</span><br>'+
       // '<span> Uplink: '+temp_self.speed.uplink.toFixed(2) +'Mbit/s</span><br>'+
        //'<span> Downlink: '+temp_self.speed.downlink.toFixed(2) +'Mbit/s</span><br>'+
        '</div>'+
        '</div>';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(map,this);
      }
      else deleteStation(temp_self);

    }); 
   }

   function place_station(lat,lng,gmap)
   {
    if(can_place_station&&can_place_MSstation==false)
    {
      var bs=new BaseStation(Station_id,{'lat': lat,'lng': lng },120,'testBS\nqweqwesasaf\nasdqawr;');
      bsStations.push(bs);
      Station_id+=1;
    }
    else if (can_place_station==false&&can_place_MSstation) {

      var min_dist=10000,BS_id=-1,index=-1;
      
      for(var i=0;i<bsStations.length;i++)
      {
        var distance=calcDistance(lat,lng,bsStations[i].position.lat,bsStations[i].position.lng);
        if(distance>=min_dist)continue;
        else {
          min_dist=distance;
          if(distance<=bsStations[i].area.radius){
            BS_id=bsStations[i].id;
            index=i;
          }
        }
      }
      var ms=new MobileStation(MStation_id,{'lat': lat,'lng': lng },BS_id,'<h1>123</h1>');
      MStation_id+=1;
      if(index!=-1&&BS_id!=-1){
        bsStations[index].mobileStations_id.push(ms.id);
        ms.distanceToBS=min_dist;
        ms.sensetive=(69.55-13.82*1.47+26.16*3.7-3.2*(1.6))+(44.9-6.55*1.47)*(Math.log(min_dist/1000))+20;
      }
      
      msStation.push(ms);
    };
    
    
  }
  
  
  function calcDistance (fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
  }
function clear_map() {//delete all obj from map
  can_delete_station=true;
  for(var i=bsStations.length-1;i>=0;i--){
    deleteStation(bsStations[i]);
  }
  Station_id=0;

  for (var i = msStation.length - 1; i >= 0; i--) {
   deleteStation(msStation[i]);
 }
 MStation_id=0;
 can_delete_station=false;
}

function deleteStation (station) 
{
  if(!can_delete_station)return;

  if(station.typeStation=='BS')
  {
    station.area.setMap(null);
    station.area=null;
    station.marker.setMap(null);
    station.marker=null;      

    for(var i=0;i<bsStations.length;i++){
     if(bsStations[i].id==station.id){
       bsStations.splice(i,1);
       return;
     }
   }
 }
 else if(station.typeStation=='MS')
 {
  for(var i=0;i<bsStations.length;i++){
    if(bsStations[i].id==station.BS_id){
      if(bsStations[i].mobileStations_id.includes(station.id))
       bsStations[i].mobileStations_id.splice(bsStations[i].mobileStations_id.indexOf(station.id), 1);        
     break;
   }
 }
 station.marker.setMap(null);
 station.marker=null;
 msStation.splice(msStation.indexOf(station),1);
}
}

function initMap() 
      {//create a map

       map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: 49.83476128325918, lng: 24.01436448097229},
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

////////////////////
//Custom Buttons
//////////////////
function ActiveMapButton (button) {
  var clearMap=document.getElementById('Clear_Btn'),
  addMS=document.getElementById('Add_MS_Btn'),
  addBS=document.getElementById('Add_BS_Btn'),
  deleteBS=document.getElementById('DeleteBS_Btn');
  
  var mapButtons=[clearMap,addMS,addBS,deleteBS];
  if(button.style.backgroundColor=='green'){
    button.style.backgroundColor='rgba(25,25,25,0.3)';
  }
  else{
    can_place_station = can_place_MSstation = can_delete_station=false;
    for(let i=0;i<mapButtons.length;i++){
      mapButtons[i].style.backgroundColor='rgba(25,25,25,0.3)';
    }
    button.style.backgroundColor='green';
  }
  switch (button.id) {
    case 'Clear_Btn':
    clear_map();
    Station_id=0;
    button.style.backgroundColor = 'rgba(25,25,25,0.3)';
    break;
    case 'Add_MS_Btn':
    can_place_MSstation=!can_place_MSstation;
    break;
    case 'Add_BS_Btn':
    can_place_station=!can_place_station;
    break;
    case 'DeleteBS_Btn':
    can_delete_station=!can_delete_station;
    break;
  }
}

function Add_BS_LTE_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="Add_BS_Btn";
  controlUI.style.backgroundColor = 'rgba(25,25,25,.2)'
  controlUI.style.backgroundImage = 'url(http://cdn.onlinewebfonts.com/svg/img_502736.png)';
  controlUI.style.backgroundSize = 'cover';
  controlUI.style.height = '60px';
  controlUI.style.width = '60px';
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
  controlText.innerHTML = '';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    ActiveMapButton(this);
  });
}

function Add_MS_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.style.backgroundImage = 'url(http://icons.iconarchive.com/icons/designbolts/free-multimedia/1024/iPhone-icon.png)'
  controlUI.style.backgroundSize = 'cover';
  controlUI.style.backgroundColor = 'rgba(25,25,25,.2)'
  controlUI.style.width = controlUI.style.height= '60px';
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
  controlText.innerHTML = '';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    ActiveMapButton(this);
  });
}
function DeleteBS_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="DeleteBS_Btn";
  controlUI.style.backgroundImage = 'url(https://cdn1.iconfinder.com/data/icons/toolbar-signs/512/erase-512.png)';
  controlUI.style.backgroundSize = 'cover';
  controlUI.style.backgroundColor = 'rgba(25,25,25,.2)'
  controlUI.style.width = controlUI.style.height= '60px';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Delete selected station';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    ActiveMapButton(this);
  });
}

function ClearMap_Control(controlDiv) {
  // Set CSS for the control border.
  var controlUI = document.createElement('button');
  controlUI.id="Clear_Btn";
  controlUI.style.backgroundColor = 'rgba(12,12,12,.3)';
  controlUI.style.backgroundImage = 'url(http://www.free-icons-download.net/images/clear-icon-37966.png)'
  
  controlUI.style.height=controlUI.style.width =  '60px';
  controlUI.style.backgroundSize = 'contain';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Clear Map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '';
  controlUI.appendChild(controlText);

  // Setup the click event listeners to button
  controlUI.addEventListener('click', function() {
    ActiveMapButton(this);
  });
}
