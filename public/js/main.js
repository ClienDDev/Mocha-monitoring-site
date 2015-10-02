/**
 * Created by ClienDDev team (clienddev.ru)
 * Developer: Artur Atnagulov (atnartur)
 */

var item_dialog_template, test_template, test_items_template;

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


function test_init(test){
    if($('.test[data-name="' + test + '"').length == 0)
        $('.tests').append(test_template({name: test}));

    var div = $('.test[data-name="' + test + '"');

    div.find('.runtime').html('<i class="fa fa-spin fa-spinner"></i>');
    div.find('.fail, .pass').html('<i class="fa fa-spin fa-spinner fa-2x"></i>');
    div.find('.refresh_test').attr('disabled', 'disabled');

    div.find('.refresh_test').unbind('click').click(function(){
        test_init(test);
    });

    $.get('/api/tests/' + test, function(res){
        try {
            var json = JSON.parse(res);
        }
        catch(e){
            console.error(test, e);
            div.find('.runtime').text('Ошибка разбора JSON');
            div.find('.pass, .fail').text('');
            return;
        }

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
        div.find('.refresh_test').removeAttr('disabled');

        console.log(json);
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

        test_template = Handlebars.compile($('#test_template').html());
        test_items_template = Handlebars.compile($('#test_items_template').html());
        item_dialog_template = Handlebars.compile($('#item_dialog_template').html());

        $.get('/api/tests', function(tests){
            $('.tests').html('');
            tests.forEach(function(test){
                test_init(test);
            });

            panel_click();
            search_init();
        });
    });
}

$(function(){
    init();
});