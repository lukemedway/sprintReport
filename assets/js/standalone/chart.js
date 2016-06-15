

var path = window.location.pathname;
var arrPath = path.split("/");
var sprintId = arrPath[arrPath.length - 1];
var projectId = arrPath[1];


$().ready(function(){
        
    $.ajax({
        url: '/' + projectId + '/sprints/getSprintsBySprintJson/' + sprintId,
        method: 'GET',
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
                        
            // BUILD CHART

            var arrLabels = [];
            var arrVelocities = [];
            var arrTargets = [];
            var arrVelocityAvgs = [];
            
            for(i=0; i<data.length; i++) {
                arrLabels.push(data[i].sprintname);
                arrVelocities.push(data[i].sprintvelocity);
                arrTargets.push(data[i].sprintvelocitytarget);
                arrVelocityAvgs.push(data[i].sprintvelocityavg);
            }
                        
            var chartData = {
                labels: arrLabels,
                series: [ arrVelocities, arrTargets, arrVelocityAvgs ]
            };
            
            var largestVelocity = Math.max.apply(Math, arrVelocities);
            var largestTarget = Math.max.apply(Math, arrTargets);
            var largest = Math.max(largestVelocity, largestTarget);
           
            
            var chartOptionsLine = {
                low: 0,
                high: largest,
                height: "245px",
                axisX: {
                    showGrid: false,
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2
                }),
                showLine: true,
                showPoint: true,
            };
            
            var chartOptionsBar = {
                seriesBarDistance: 60,
                axisX: {
                    showGrid: false
                },
                height: "245px"
            };
        
            
            var chartResponsive = [
                ['screen and (max-width: 640px)', {
                    axisX: {
                        labelInterpolationFnc: function (value, index) {
                            return index + 1;
                        }
                    }
                }]
            ];
           
           if(data.length > 1) {
                new Chartist.Line('.vel-chart', chartData, chartOptionsLine, chartResponsive);
           } else {
               new Chartist.Bar('.vel-chart', chartData, chartOptionsBar, chartResponsive);
           }
 
        },
        error: function(err) {
            console.dir(err);
        }
    });
      
});
