/**
 * Created by erico on 12/9/16.
 */
var FirstApplication = {
    disableContent: function(){
        $('div#apply-section').addClass('disable-content');
        $('img.ajax-loader').show();
    },
    enableContent: function(){
        $('div#apply-section').removeClass('disable-content');
        $('img.ajax-loader').hide();
    },
    resetFields: function (formObj) {
        formObj.find('input[type="text"], input[type="email"], input[type="number"], select, textarea').val('');
    },
    loopWarnings: function(data){
        for(var key in data.warnings)
        {
            var errors = data.warnings[key];
            for(var i = 0; i < errors.length; i++) {
                new PNotify({
                    title: 'Warning!',
                    text: errors[i],
                    type: 'warning'
                });
            }
        }
    },
    initialize: function(formObj){
        $.ajax({
            url: '//localhost/boda/public/api/first-applications',
            type: 'POST',
            data: formObj.serialize(),
            dataType: 'json',
            beforeSend: function () {
                FirstApplication.disableContent();
            },
            success: function(data){
                if (data.success){
                    new PNotify({
                        title: 'Application has been Sent',
                        text: data.message,
                        type: data.type
                    });
                    FirstApplication.enableContent();
                    FirstApplication.resetFields(formObj);
                }else if(!data.success){
                    if(data.type == 'warnings'){
                        // show the warnings in a pnotify
                        FirstApplication.loopWarnings(data);
                        FirstApplication.enableContent();
                    }else{
                        new PNotify({
                            title: 'Whoops! An Error!',
                            text: data.message,
                            type: data.type
                        });
                        FirstApplication.enableContent();
                    }
                }
            }
        });
    }
}

$('form#first-application').on('submit', function (e) {
    e.preventDefault();

    FirstApplication.initialize($(this));
});
