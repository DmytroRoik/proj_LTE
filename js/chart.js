      google.charts.load('current', {'packages':['corechart']});
     // google.charts.setOnLoadCallback(drawChart);


     var  PSK = {
      PSK_4: 4,
      PSK_16: 16
    };  
    var modulation=PSK.PSK_4;
    var Code="";

    function setModulation()
    {
      var radioBut=document.getElementsByName("modulation");
      if(radioBut[0].checked)
        modulation=PSK.PSK_4;
      else if(radioBut[1].checked)
        modulation=PSK.PSK_16;
    }
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
      alert(temp_code);
      return temp_code;
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
            data.addRows([[0.33,0.33,temp_code]]);
          }
          else if(temp_code=='0001'){
            data.addRows([[0.33,-1,temp_code]]);
          }
          else if(temp_code=='0010'){
            data.addRows([[-1,0.33,temp_code]]);
          }
          else if(temp_code=='0011'){
            data.addRows([[-1,-1,temp_code]]);
          }
          else if(temp_code=='0100'){
            data.addRows([[0.33,0.33,temp_code]]);
          }
          else if(temp_code=='0101'){
            data.addRows([[-0.33,1,temp_code]]);
          }
          else if(temp_code=='0110'){
            data.addRows([[-1,-0.33,temp_code]]);
          }
          else if(temp_code=='0111'){
            data.addRows([[-1,1,temp_code]]);
          }
          else if(temp_code=='1000'){
            data.addRows([[0.33,-0.33,temp_code]]);
          }
          else if(temp_code=='1001'){
            data.addRows([[0.33,-1,temp_code]]);
          }
          else if(temp_code=='1010'){
            data.addRows([[1,-0.33,temp_code]]);
          }
          else if(temp_code=='1011'){
            data.addRows([[1,-1,temp_code]]);
          }
          else if(temp_code=='1100'){
            data.addRows([[0.33,0.33,temp_code]]);
          }
          else if(temp_code=='1101'){
            data.addRows([[0.33,1,temp_code]]);
          }
          else if(temp_code=='1110'){
            data.addRows([[1,0.33,temp_code]]);
          }
          else if(temp_code=='1111'){
            data.addRows([[1,1,temp_code]]);
          }
        }
      }
      return data;
    }

    function Array_with_error (miss) {

    }

    function drawChart() {

      var data = createArray(modulation,enteredCode);
console.log(data);
      var options = {
        title: '',
        hAxis: {title: 'I', minValue: -2, maxValue: 2},
        vAxis: {title: 'Q', minValue: -2, maxValue: 2},
        legend: 'none'
      };

      var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }

    function draw_chart2()
    {
      var data = createArray(modulation,enteredCode);

      var options = {
        title: '',
        hAxis: {title: 'I', minValue: -2, maxValue: 2},
        vAxis: {title: 'Q', minValue: -2, maxValue: 2},
        legend: 'none'
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