export async function GET() {
    const response = await fetch(
        'https://api.github.com/repos/BUSY-LOOPING/WebConnect/releases/latest',
        {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            next: { revalidate: 3600 }
        }
    )
    
    const release = await response.json()
    
    const assets = release.assets.map(asset => ({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size
    }))
    
    return Response.json({ 
        version: release.tag_name,
        assets 
    })
}