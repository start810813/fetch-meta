import ogs from 'open-graph-scraper'

class Page {
    constructor(url) {
        this.url = this.transformUrl(url)
    }
    transformUrl(url) {
        if (url.includes('www.facebook.com')) return url.replace('www.facebook', 'm.facebook')
        else return url
    }
    async getMeta() {
        const options = {
            url: this.url,
            headers: {
                'user-agent': 'Mozilla/5.0 (iPad; CPU OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1',
            },
        }
        const {
            error,
            result,
            response
        } = await ogs(options)
        if (error) throw new Error('Fetch Failed')
        return result
    }
}

export default Page