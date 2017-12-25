     var MODULATION = (function () {
       var module={}
       module.init=function () {
         google.charts.load('current', {'packages':['corechart']});
       }
       return module;
     })();
     MODULATION.init();

     var  PSK = {
      PSK_4: 4,
      PSK_16: 16
    };  
    var modulation=PSK.PSK_4;
    var Code="";
    var SNR_value=100;

    function setModulation()
    {
      var radioBut=document.getElementsByName("modulation");
      if(radioBut[0].checked)
        modulation=PSK.PSK_4;
      else if(radioBut[1].checked)
        modulation=PSK.PSK_16;
    }
    $('.radio').on("change click", ()=>{
      Update();
    });

    function setCode(){
      var textArea=document.getElementById("entered_code");
      enteredCode=try_validateCode(textArea.value);

      if(enteredCode==""){textArea.value=""; return false;}
      return true;                     
    }

    function try_validateCode (code) {
      var temp_code="";
      for(var i=0;i<code.length;i++)
      {
        if(code[i]==' ')continue;
        else if(code[i]!='1'&&code[i]!='0'){return "";}
        else temp_code+=code[i];
      }
      if(modulation==PSK.PSK_4&&temp_code.length%2!=0){
        temp_code+='0';
      }
      else if(modulation==PSK.PSK_16&&temp_code.length%4!=0)
      {
        for(var i=0;i<temp_code.length%4;i++)
        {
          temp_code+='0';
        }
      }
      //alert(temp_code);
      return temp_code;
    }



    function SNRChange (e) {
      SNR_value=e.value;
      document.getElementById('SNR_Span').innerText=SNR_value+'dB';
   
 //     this.previousSibling.innerText=SNR_value;
      //#TODO: 
      Update();
    }
    

    function createArray(type_PSK,code)
    {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'I');
      data.addColumn('number', 'Q');
      data.addColumn({type: 'string', role: 'tooltip'});
      if(type_PSK==PSK.PSK_4)
      {
        for(var i=0;i<code.length/2;i++){
          var temp_code=code[i*2]+code[i*2+1];

          if(temp_code=='11'){
            data.addRows([[1,1,temp_code]]);
          }
          else if(temp_code=='01'){
            data.addRows([[-1,1,temp_code]]);
          }
          else if(temp_code=='00'){
            data.addRows([[-1,-1,temp_code]]);
          }
          else if(temp_code=='10'){
            data.addRows([[1,-1,temp_code]]);
          }
        }
      }
      else if(type_PSK==PSK.PSK_16)
      {
        for(var i=0;i<code.length/4;i++){

          var temp_code=code[i*4]+code[i*4+1]+code[i*4+2]+code[i*4+3];
          if(temp_code=='0000'){
            data.addRows([[0.4472,0.4472,temp_code]]);
          }
          else if(temp_code=='0001'){
            data.addRows([[0.4472,1.3416,temp_code]]);
          }
          else if(temp_code=='0010'){
            data.addRows([[1.3416,0.4472,temp_code]]);
          }
          else if(temp_code=='0011'){
            data.addRows([[1.3416,1.3416,temp_code]]);
          }
          else if(temp_code=='0100'){
            data.addRows([[0.4472,-0.4472,temp_code]]);
          }
          else if(temp_code=='0101'){
            data.addRows([[0.4472,-1.3416,temp_code]]);
          }
          else if(temp_code=='0110'){
            data.addRows([[1.3416,-0.4472,temp_code]]);
          }
          else if(temp_code=='0111'){
            data.addRows([[1.3416,-1.3416,temp_code]]);
          }
          else if(temp_code=='1000'){
            data.addRows([[-0.4472,0.4472,temp_code]]);
          }
          else if(temp_code=='1001'){
            data.addRows([[-0.4472,1.3416,temp_code]]);
          }
          else if(temp_code=='1010'){
            data.addRows([[-1.3416,0.4472,temp_code]]);
          }
          else if(temp_code=='1011'){
            data.addRows([[-1.3416,1.3416,temp_code]]);
          }
          else if(temp_code=='1100'){
            data.addRows([[-0.4472,-0.4472,temp_code]]);
          }
          else if(temp_code=='1101'){
            data.addRows([[-0.4472,-1.3416,temp_code]]);
          }
          else if(temp_code=='1110'){
            data.addRows([[-1.3416,-0.4472,temp_code]]);
          }
          else if(temp_code=='1111'){
            data.addRows([[-1.3416,-1.3416,temp_code]]);
          }
        }
      }
      return data;
    }
    /*

    function Array_with_error (type_PSK,code,SNR) {
      var data = createArray(type_PSK,code);
      if(SNR>=30)return data;

      var data1= new google.visualization.DataTable();
      data.addColumn('number', 'I');
      data.addColumn('number', 'Q');
      data.addColumn({type: 'string', role: 'tooltip'});
        //data.og -- points
        console.log(data.og);
        
        if(type_PSK==PSK.PSK_4){
          if(SNR>=16)return data;
          else{

          }
        }
        else if(type_PSK==PSK.PSK_16){
          if(SNR>=25)return data;
          else{

          }
        }
      }
      */




      function drawChart() {

        var data = createArray(modulation,enteredCode);
        //console.log(data);
        var options = {
          title: '',
          hAxis: {title: 'I', minValue: -2, maxValue: 2},
          vAxis: {title: 'Q', minValue: -2, maxValue: 2},
          legend: 'none'
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

        chart.draw(data, options);
      }


      function makeErrors(value){
        //max = 200 min = 7
        var size;
        value = +value;
  
        if(modulation==PSK.PSK_4){
         switch (value) {
           case 1:
             size = 200;
             break;
           case 2:
             size = 195;
             break;
           case 3:
             size = 185;
             break;
           case 4:
             size = 175;
             break;
           case 5:
             size = 170;
             break;
           case 6:
             size = 160;
             break;
           case 7:
             size = 150;
             break;
           case 8:
             size = 140;
             break;
           case 9:
             size = 130;
             break;
           case 10:
             size = 120;
             break;
           case 11:
             size = 110;
             break;
           case 12:
             size = 100;
             break;
           case 13:
             size = 90;
             break;
           case 14:
             size = 75;
             break;
           case 15:
             size = 60;
             break;
           case 16:
             size = 45;
             break;
           case 17:
             size = 30;
             break;
           case 18:
             size = 20;
             break;
           case 19:
             size = 15;
             break;
           case 20:
             size = 12;
             break;
           case 21:
             size = 12;
             break;
           case 22:
             size = 12;
             break;
           case 23:
             size = 11;
             break;
           case 24:
             size = 11;
             break;
           case 25:
             size = 11;
             break;
           case 26:
             size = 10;
             break;
           case 27:
             size = 9;
             break;
           case 28:
             size = 9;
             break;
           case 29:
             size = 8;
             break;
           case 30:
             size = 8;
             break;
           default:
             size = 7;
             break;
         }

      }
      if(modulation==PSK.PSK_16){
          switch (value) {
           case 1:
             size = 200;
             break;
           case 2:
             size = 194;
             break;
           case 3:
             size = 188;
             break;
           case 4:
             size = 182;
             break;
           case 5:
             size = 176;
             break;
           case 6:
             size = 170;
             break;
           case 7:
             size = 164;
             break;
           case 8:
             size = 158;
             break;
           case 9:
             size = 152;
             break;
           case 10:
             size = 146;
             break;
           case 11:
             size = 140;
             break;
           case 12:
             size = 134;
             break;
           case 13:
             size = 128;
             break;
           case 14:
             size = 122;
             break;
           case 15:
             size = 116;
             break;
           case 16:
             size = 110;
             break;
           case 17:
             size = 104;
             break;
           case 18:
             size = 98;
             break;
           case 19:
             size = 92;
             break;
           case 20:
             size = 96;
             break;
           case 21:
             size = 90;
             break;
           case 22:
             size = 80;
             break;
           case 23:
             size = 70;
             break;
           case 24:
             size = 62;
             break;
           case 25:
             size = 54;
             break;
           case 26:
             size = 40;
             break;
           case 27:
             size = 28;
             break;
           case 28:
             size = 20;
             break;
           case 29:
             size = 15;
             break;
           case 30:
             size = 13;
             break;
            case 31:
             size = 13;
             break;
            case 32:
             size = 12;
             break;
            case 33:
             size = 12;
             break;
           case 34:
             size = 11;
             break;
           case 35:
             size = 10;
             break;
           case 36:
             size = 10;
             break;
           case 37:
             size = 9;
             break;
           case 38:
             size = 9;
             break;
           case 39:
             size = 8;
             break;
           case 40:
             size = 8;
             break;
           default:
             size = 7;
             break;
         }
      }

        return size;
      }

      function draw_chart2()
      {
        var data = createArray(modulation,enteredCode);
        var errorValue = makeErrors(SNR_value);

        var options = {
          title: '',
          hAxis: {title: 'I', minValue: -2, maxValue: 2},
          vAxis: {title: 'Q', minValue: -2, maxValue: 2},
          legend: 'none',
          pointSize: errorValue
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div_second'));

        chart.draw(data, options);
      }

      function Update () {
        if(!setCode()){alert("Введено неправильні дані!\n Спробуйте ще раз!");return;}
        setModulation();
        drawChart();
        draw_chart2();
      }

      //apply after loading page
      window.onload = () => {
       document.getElementById('SNR_Span').innerText = 100+'dB';
       Update();
      }

