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
        $('#modals').append(`<p class="subject-text">${layers.subject}</p>`)

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
//<a id="file_name" href="#" location=${data[i].fileID} filename=${data[i].file_firstname}>DELETE</a>

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
                    </div>`

            )
        }
        $('#modals').append(`<p class="subject-text">${layers.units}</p>`)

    })
}
