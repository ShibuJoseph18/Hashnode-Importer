import axios from 'axios';

const hashNodeApiKey = ""; // Replace with your actual API key

const graphqlClient = axios.create({
  baseURL: 'https://gql.hashnode.com/',
  headers: {
    'Content-Type': 'application/graphql',
    'Authorization': hashNodeApiKey,
  },
});

const publishArticleMutation = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        slug
        title
        author {
          id
          username
          name
          profilePicture
        }
        url
        canonicalUrl
        coverImage {
          url
        }
        content {
          markdown
          html
        }
      }
    }
  }
`;

async function publishArticleToGraphQL(dataHeadersFromDevTo) {
  try {
    console.log("Posting data to GraphQL...");
    const response = await graphqlClient.post('', {
      query: publishArticleMutation,
      variables: {
        input: dataHeadersFromDevTo,
      },
    });

    if (response.status === 200) {
      const publishedArticle = response.data?.data?.publishPost?.post;

      if (publishedArticle) {
        console.log("Article published successfully!");
        return publishedArticle;
      } else {
        throw new Error("Error: Invalid response structure. Post data not found.");
      }
    } else {
      throw new Error(`Error publishing article. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error making GraphQL request: ${error}`);
    throw error;
  }
}

export { publishArticleToGraphQL };

