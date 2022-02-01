window.onload = function () {
    fetch('/line-id')
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            const liffId = data.lineLiffId
            initLiff(liffId)
        })
        .catch(function (error) {
            console.log(error)
        })
}

let requestUrl
let ogTitle
let ogDescription
let ogImage
let aspectRatio
// function initializeLiffOrDie(myLiffId) {
//     if (!myLiffId) {} else {
//         initializeLiff(myLiffId)
//     }
// }

function initLiff(id) {
    liff
        .init({
            liffId: id
        })
        .then(() => {
            initApp()
        })
        .catch((err) => {})
}

function initApp() {
    checkIsShareUrl()
    addButtonListener()

    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').classList.add('hidden')
    }
}

function validUrlInput(url) {
    if (!url)
        document.getElementById('sharedUrl').focus()
    return !!url
}

function validMetaData() {
    let valid = true
    if (requestUrl === undefined) valid = false
    if (ogTitle === undefined) valid = false
    if (ogDescription === undefined) valid = false
    if (ogImage === undefined) valid = false
    if (aspectRatio === undefined) valid = false
    if (valid) {
        document.getElementById('fetchButton').click()
    }
    return valid
}

function checkIsShareUrl() {
    // scenario: the shared url is brought from url path
    // by pass '?url='
    let url = ''
    const search = window.location.search
    const hasParam = search.startsWith('?url=')
    if (hasParam) {
        url = search.substring(5)
    }

    if (url !== '') {
        document.getElementById('sharedUrl').value = url
        previewUrlInfo(url, true)
    }

}

function previewUrlInfo(url, isAutoSend = false) {
    fetch('/meta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url
            }),
        })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            ogTitle = data.ogTitle || ''
            ogDescription = data.ogDescription || ''
            ogImage = data.ogImage || ''
            if (ogImage && ogImage.width && ogImage.width) {
                aspectRatio = `${ogImage.width}:${ogImage.height}`
            } else {
                aspectRatio = '20:13'
            }

            const titleHtml = document.getElementById('title')
            const descriptionHtml = document.getElementById('description')
            const imageContainerHtml = document.getElementById('imageContainer')
            const imageHtml = document.getElementById('image')
            titleHtml.textContent = ogTitle
            descriptionHtml.textContent = ogDescription

            if (imageHtml) {
                imageContainerHtml.removeChild(imageHtml)
            }
            if (ogImage) {
                const newImageHtml = document.createElement('img')
                newImageHtml.src = ogImage.url
                newImageHtml.alt = 'Preview Picture'
                newImageHtml.id = 'image'
                imageContainerHtml.appendChild(newImageHtml)
            }
            if (isAutoSend) {
                sendFlexMessage(url)
            }
        })
        .catch(function (error) {
            console.log('parse API error' + error)
        })

}

function addButtonListener() {
    // get preview 
    document.getElementById('fetchButton').addEventListener('click', function () {
        const url = document.getElementById("sharedUrl").value
        if (validUrlInput(url)) previewUrlInfo(url)
    })

    document.getElementById('shareButton').addEventListener('click', function () {
        const url = document.getElementById("sharedUrl").value
        if (validUrlInput(url)) {
            if (validMetaData()) {
                sendFlexMessage(url)
            } else {
                previewUrlInfo(url)
                sendFlexMessage(url)
            }
        }
    })

    // login call, only when external browser is used
    document.getElementById('liffLoginButton').addEventListener('click', function () {
        if (!liff.isLoggedIn()) {
            // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
            liff.login()
        }
    })
}

function sendFlexMessage(url) {
    liff.shareTargetPicker([
        createFlexMessage(ogTitle, ogDescription, ogImage.url, url, aspectRatio)
    ]).then(function (res) {
        liff.closeWindow()
    }).catch(function (error) {
        alert(JSON.stringify(error))
        const shareResultHtml = document.getElementById('shareResult')
        shareResultHtml.textContent = `Sending Failed: ${JSON.stringify(error)}`
    })
}

function createFlexMessage(title, description, image, url, aspectRatio) {
    const flexContent = {
        type: 'bubble',
        hero: {
            type: 'image',
            url: image,
            size: 'full',
            aspectRatio: aspectRatio,
            aspectMode: 'cover',
            action: {
                type: 'uri',
                uri: url
            }
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [{
                    type: 'text',
                    text: title,
                    weight: 'bold',
                    size: 'xl',
                    wrap: true
                },
                {
                    type: 'text',
                    text: description,
                    weight: 'regular',
                    size: 'xs',
                    margin: 'sm',
                    wrap: true
                }
            ]
        },
        footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [{
                    type: 'button',
                    style: 'link',
                    height: 'sm',
                    action: {
                        type: 'uri',
                        label: "查看",
                        uri: url
                    }
                },
                {
                    type: 'spacer',
                    size: 'sm'
                }
            ],
            flex: 0
        }
    }

    const flex = {
        type: 'flex',
        altText: title,
        contents: flexContent,
    }
    return flex
}