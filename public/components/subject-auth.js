const layers = {
    level: null,
    subject: null,
    units: null
}

// var deleteFile = null

$(document).ready(function () {
    $('#back').hide()
    $('.alert').hide()
    $('#progress').hide()
    $('.card-link').click(function () {
        layers.level = $(this).find('p').text().toLowerCase()
        getSubject()
        $('#back').show()
    });
    $('#back').click(function () {
        getBack()
    })
    $(document).on('click', '.subject-link', function () {
        // This will work!
        layers.subject = $(this).find('p').text().toLowerCase()
        // console.log(layers.subject)
        getUnit(layers.subject)
        $('#back').show()
    });
    $(document).on('click', '.unit-link', function () {
        layers.units = $(this).find('p').text().toLowerCase()
        getFiles()
        $('#back').show()
    })
    $('#unit-btn').click(function (e) {
        e.preventDefault()
        UnitPost()
    })
    $('#file-btn').click(function (e) {
        e.preventDefault()
        FilePost()
    })
    $(document).on('click', '#file_name', function (e) {
        // console.log(e)
        Delete(e)
    })
})
    // Post()





function getBack() {
    if (layers.units != null) {
        layers.units = null
        $('#modals').empty()
        $('#subj-row').empty()
        $('#back').show()
        getUnit()
    }
    else if (layers.subject != null) {
        layers.subject = null
        $('#levels').hide()
        $('#subj-row').empty()
        $('#modals').empty()
        $('#back').show()
        getSubject()
    }
    else if (layers.level != null) {
        layers.subject = null
        layers.level = null
        $('#modals').empty()
        $('#back').hide()
        $('#subj-row').empty()
        $('#levels').toggle()
    }

}

function getUnit() {
    $('#level').hide()
    $('#subj-row').empty()
    // console.log(layers)
    $('#modals').empty()
    $('#progress').show()
    $.get(`/api/igcse/${layers.subject}`, function (data) {
        $('#progress').hide()
        // console.log(data)
        for (i in data) {
            // console.log(data[i].name)
            $('#subj-row').append(
                `<div class="col m4 s12">
                        <a href="#" class="unit-link">
                            <div class="card">
                                <div class="card-content">
                                    <p>${data[i].name}</p>
                                </div>
                            </div>

                        </a>
                    </div>`
            )

        }
        $('#modals').append(`<a class="waves-effect white btn modal-trigger" href="#unit-modal"><i class="material-icons">add
        </i></a> <p class="subject-text">${layers.subject}</p>`)

    })

}

function getSubject() {
    $('#levels').hide();
    $('#progress').show()
    $.get('/api/igcse', function (data) {
        $('#progress').hide()
        subject = data.subjects
        for (i in subject) {
            $('#subj-row').append(
                `<div class="col m4 s12">
                        <a href="#" class="subject-link">
                            <div class="card">
                                <div class="card-content">
                                    <p>${subject[i]}</p>
                                </div>
                            </div>
                        </a>
                    </div>`

            )

        }

    })
}
//get file

function getFiles() {
    $('#level').hide()
    $('#subj-row').empty()
    $('#progress').show()
    $.get(`/api/igcse/${layers.subject}/${layers.units}`, function (data) {
        $('#progress').hide()
        // console.log(data)
        // $('#modals').toggle()
        $('#modals').empty()
        for (i in data) {
            $('#subj-row').append(
                `<div class="col m4 s12">
                        <a href="/file/${data[i].filename}" target="_blank">
                            <div class="card">
                                <div class="card-content file-card">
                                    <p>${data[i].file_firstname}</p>
                                </div>
                            </div>
                        </a>
                        <a id="file_name" href="#" location=${data[i].fileID} filename=${data[i].file_firstname}>DELETE</a>
                    </div>`

            )
        }
        $('#modals').append(`<a class="waves-effect white  btn modal-trigger" href="#file-modal"><i class="material-icons">file_upload</i></a><p class="subject-text">${layers.units}</p>`)

    })
}

function Delete(e) {
    let location = $(e.target).attr('location')
    let name = $(e.target).attr('filename')
    console.log(name)
    var confirm = window.confirm(`You are going to delete ${name}. Are you sure?`);
    if (confirm == true) {
        $('#progress').show()
        $.ajax({
            url: `/file/${location}`,
            type: 'DELETE',
            success: function(data) {
                // Do something with the result
                // console.log(data)
                getFiles()
                $('#progress').hide()
            }
        });
    } else {
        // console.log('Cancel')
    }

}


function warn(el) {
    $(el).addClass('warning')
}

function unwarn(el) {
    $(el).removeClass('warning')
}
//POSTING PROTOTYPE FUNCTION
function UnitPost() {
    let unit_name = $('#unit-name').val()
    // $.post( "/igcse/physics", { name: "Unit 3: Light", subject: "physics" } );
    var posting = $.post("/api/igcse/add", { name: unit_name, subject: layers.subject });

    $('#progress').show()
    // Put the results in a div
    posting.done(function (data) {
        $('#progress').hide()
        $('.alert').text(data.text)

        if (data.error == true) {
            // console.log(data.error)
            warn('#alert')
        }
        $('#unit-name').val('');
        $('.alert').show()
        $('.alert').fadeOut(2000, function () {
            unwarn('#alert')
        })
        // console.log(data)
        $('#level').hide()
        $('#subj-row').empty()
        // console.log(layers)
        getUnit()
    });
}


function FilePost() {
    var fd = new FormData();
    // console.log(file.files[0])
    // var file = this.files[0];
    fd.append('file', file.files[0]);
    fd.append('unit', layers.units)
    //send ajax POST to api

    $('#progress').show()
    var posting = $.ajax({
        url: '/upload',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        // success: function (data) {
        //     alert(data);
        // }
    });

    posting.done(function (data) {
        $('#progress').hide()
        console.log('done')
        if (data.error == true) {
            // console.log(data.error)
            warn('#alert')
            // $('#alert').addClass('warning');
        }
        $('.alert').text(data.text)
        $('#file-name').val('');
        $('.alert').show()
        $('.alert').fadeOut(2000, function () {
            unwarn('#alert')
        })
        // console.log(data)
        $('#level').hide()
        $('#subj-row').empty()
        getFiles()
    })

}
