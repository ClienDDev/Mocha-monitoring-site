/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

var item_dialog_template;

function test_item_click(){
    $('.test_item').unbind('click').click(function(){
        var $this = $(this);
        var title = $this.find('.title').text();
        var duration = $this.find('.duration').text();
        var is_fail = $this.closest('.items_group').hasClass('fail');
        var error = $this.data('error');
        var stack = $this.data('stack');

        bootbox.dialog({
            title: 'Просмотр теста',
            message: item_dialog_template({
                is_fail: is_fail,
                duration: duration,
                title: title,
                error: error,
                stack: stack
            })
        });
    });
}

function panel_click(){
    $('.panel-heading').unbind('click').click(function(){
        $(this).parent().find('.panel-body').slideToggle(100);
    });
}

function search_init(){
    $('#search')
        .unbind('change')
        .unbind('keydown')
        .fastLiveFilter('.tests *:not(h3)', {
            selector: 'li, .name'
        })
        .change(function(){
            if($(this).val()=='')
                $('.tests > *').slideDown(200);
        });
}

function init(){
    $.get('/js/templates.html', function(html){
        $('body').append(html);

        var test_template = Handlebars.compile($('#test_template').html());
        var test_items_template = Handlebars.compile($('#test_items_template').html());
        item_dialog_template = Handlebars.compile($('#item_dialog_template').html());

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

                        test_item_click();
                        search_init();

                        console.log(json);
                    });
                })(test);
            });

            panel_click();
            search_init();
        });
    });
}

$(function(){
    init();
});