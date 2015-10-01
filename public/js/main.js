/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

function init(){
    $.get('/js/templates.html', function(html){
        $('body').append(html);

        var test_template = Handlebars.compile($('#test_template').html());
        var test_items_template = Handlebars.compile($('#test_items_template').html());

        $.get('/api/tests', function(tests){
            $('.tests').html('');
            tests.forEach(function(test){
                (function(test){
                    $('.tests').append(test_template({name: test}));

                    $.get('/api/tests/' + test, function(res){
                        var json = JSON.parse(res);
                        var div = $('.test[data-name="' + test + '"');

                        div.find('.runtime').text(json.stats.duration + 'ms');
                        div.find('.pass').html(test_items_template({
                            data: json.passes,
                            success: true
                        }));
                        div.find('.fail').html(test_items_template({
                            data: json.failures,
                            success: false
                        }));

                        console.log(json);
                    });
                })(test);
            });
        });
    });

}

$(function(){
    init();
});