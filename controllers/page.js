import ogs from 'open-graph-scraper'

class Page {
    constructor(url) {
        this.url = url
    }
    async getMeta() {
        const options = { url: this.url }
        const { error, result, response } = await ogs(options)
        if (error) throw new Error('Fetch Failed')
        return result
    }
}

export default Page