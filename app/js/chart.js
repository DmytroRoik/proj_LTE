      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);


      var  PSK = {
        PSK_4: 1,
        PSK_16: 2
      };  
      
      function createArray(type_PSK,code)
      {
        var data;
        
        if(type_PSK==PSK.PSK_4)
        {
          data = google.visualization.arrayToDataTable([
           ['I', 'Q'],
           [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
           ]);

          for(var i=0;i<code.length/2;i++){
            var temp_code=code[i*2]+code[i*2+1];
            if(temp_code=='11'){
              data.og[i].c[0].v=1;
              data.og[i].c[1].v=1;
            }
            else if(temp_code=='01'){
              data.og[i].c[0].v=-1;
              data.og[i].c[1].v=1;
            }
            else if(temp_code=='00'){
              data.og[i].c[0].v=-1;
              data.og[i].c[1].v=-1;
            }
            else if(temp_code=='10'){
              data.og[i].c[0].v=1;
              data.og[i].c[1].v=-1;
            }
          }
        }
        else if(type_PSK==PSK.PSK_16)
        {
          data = google.visualization.arrayToDataTable([
           ['I', 'Q'], 
           [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
           ]);
          for(var i=0;i<code.length/4;i++){
            var temp_code=code[i*4]+code[i*4+1]+code[i*4+2]+code[i*4+3];
            if(temp_code=='0000'){
              data.og[i].c[0].v=0.33;
              data.og[i].c[1].v=0.33;
            }
            else if(temp_code=='0001'){
              data.og[i].c[0].v=-0.33;
              data.og[i].c[1].v=-1;
            }
            else if(temp_code=='0010'){
              data.og[i].c[0].v=-1;
              data.og[i].c[1].v=-0.33;
            }
            else if(temp_code=='0011'){
              data.og[i].c[0].v=-1;
              data.og[i].c[1].v=-1;
            }
            else if(temp_code=='0100'){
              data.og[i].c[0].v=0.33;
              data.og[i].c[1].v=0.33;
            }
            else if(temp_code=='0101'){
              data.og[i].c[0].v=-0.33;
              data.og[i].c[1].v=1;
            }
            else if(temp_code=='0110'){
              data.og[i].c[0].v=-1;
              data.og[i].c[1].v=-0.33;
            }
            else if(temp_code=='0111'){
              data.og[i].c[0].v=-1;
              data.og[i].c[1].v=1;
            }
            else if(temp_code=='1000'){
              data.og[i].c[0].v=0.33;
              data.og[i].c[1].v=-0.33;
            }
            else if(temp_code=='1001'){
              data.og[i].c[0].v=0.33;
              data.og[i].c[1].v=-1;
            }
            else if(temp_code=='1010'){
              data.og[i].c[0].v=1;
              data.og[i].c[1].v=-0.33;
            }
            else if(temp_code=='1011'){
              data.og[i].c[0].v= 1;
              data.og[i].c[1].v=-1;
            }
            else if(temp_code=='1100'){
              data.og[i].c[0].v=0.33;
              data.og[i].c[1].v=0.33;
            }
            else if(temp_code=='1101'){
              data.og[i].c[0].v=0.33;
              data.og[i].c[1].v=1;
            }
            else if(temp_code=='1110'){
              data.og[i].c[0].v=1;
              data.og[i].c[1].v=0.33;
            }
            else if(temp_code=='1111'){
              data.og[i].c[0].v=1;
              data.og[i].c[1].v=1;
            }

          }
        }

            console.log(data.og);
            return data;
          }

          function drawChart() {

            var data = createArray(PSK.PSK_16,"101110011010");

            var options = {
              title: '',
              hAxis: {title: 'I', minValue: -2, maxValue: 2},
              vAxis: {title: 'Q', minValue: -2, maxValue: 2},
              legend: 'none'
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(data, options);
          }