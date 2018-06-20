
function attachEvents()
{

    let weatherSymbols = 
    {
        'Sunny' : '&#x2600;',
        'Partly sunny' : '&#x26C5;',
        'Overcast' : '&#x2601;',
        'Rain' : '&#x2614;',
        'Degrees' : '&#176;'
    }

    
    let degree = weatherSymbols.Degrees;

    $('#submit').click(function(){

        $('#current').empty();
        $('#upcoming').empty();
        
        let inputText = $('#location').val();

        $.ajax({
            
            method : 'GET',
            url : 'https://judgetests.firebaseio.com/locations.json',
            success : function s(res){

                let currentLocation = res.filter(r => r.name === inputText)[0];
                
                if(currentLocation === "" || currentLocation === undefined)
                {
                    
                    $('#current').empty();
                    $('#upcoming').empty();
                    
                    $('#current')                
                        .append(`<div class="label">Current conditions</div>`)
                    
                    $('#upcoming')
                        .append(`<div class="label">Three-day forecast</div>`)
                    
                    $('#forecast')[0].style.display = 'block';
                    $('.label').text('Error')

                    return;
                }

                let code = currentLocation.code;
                
                
                //Conditions
                $.get(`https://judgetests.firebaseio.com/forecast/today/${code}.json`)
                    .then(function ss(res){
                        
                        $('#forecast')[0].style.display = 'block';
                       
                        let symbol = weatherSymbols.Sunny;

                        let conditionSpan = $(`<span class="condition"></span>`)
                            .append(`<span class="forecast-data">${res.name}</span>`)
                            .append(`<span class="forecast-data">${res.forecast.high}${degree}/${res.forecast.low}${degree}</span>`)
                            .append(`<span class="forecast-data">${res.forecast.condition}</span>`)

                        $('#current').empty();

                        $('#current')                
                            .append(`<div class="label">Current conditions</div>`)
                            .append(`<span class="condition symbol">${symbol}</span>`)
                            .append(conditionSpan);
                        
                    })
                    
                
                //3 day forecast
                $.get(`https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`)
                .then(function sss(res){

                    
                    $('#upcoming').empty();
                    
                    $('#upcoming')
                    .append(`<div class="label">Three-day forecast</div>`)
                            
                    for (let obj of res.forecast) {

                        let symbol = weatherSymbols[`${obj.condition}`]
                        
                        let spanUpcoming = $(`<span class="upcoming"></span>`)
                            .append(`<span class="symbol">${symbol}</span>`)
                            .append(`<span class="forecast-data">${obj.high}${degree}/${obj.low}${degree}</span>`)
                            .append(`<span class="forecast-data">${obj.condition}</span>`)
                        
                        $('#upcoming')
                            .append(spanUpcoming);
                        
                    }

                })


            },
            error : function f(err){
                console.log('ERROR!');
                console.log(err);
            }

        });    

    
    })

}