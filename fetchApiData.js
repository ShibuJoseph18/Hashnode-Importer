
import axios from 'axios';

const acceptHeader = "application/vnd.forem.api-v1+json"; // Replace with your actual value
const DevToApiKey = ""; // Replace with your actual value

async function getDevToArticleData(username, slug) {
    try {
        const response = await axios.get(`https://dev.to/api/articles/${username}/${slug}`, {
            headers: {
                "Accept": acceptHeader,
                "api-key": DevToApiKey,
            },
        });

        if (response.status === 200) {
            const responseData = response.data;
            // dataObjectPropertyFromDevTo contains all properties of the data object fetched the DevTo api that matches the hashnode's graphQl 
            const dataObjectPropertyFromDevTo = {
                id: responseData.id,
                slug: responseData.slug,
                title: responseData.title,
                author: {
                    id: responseData.user.user_id,
                    username: responseData.user.username,
                    name: responseData.user.name,
                    profilePicture: responseData.user.profile_image,
                },
                url: responseData.url,
                canonicalUrl: responseData.canonical_url,
                coverImage: {
                    url: responseData.cover_image,
                },
                content: {
                    markdown: responseData.body_markdown,
                    html: responseData.body_html,
                },    
            };
            return dataObjectPropertyFromDevTo
        } else {
            throw new Error(`Error fetching data. Status code: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error making request: ${error.message}`);
    }
}

export { getDevToArticleData };
