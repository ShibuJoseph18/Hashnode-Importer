import express from "express";
import bodyParser from "body-parser";
import { getDevToArticleData } from './fetchApiData.js';
import { publishArticleToGraphQL } from './postApiData.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 3000;

// Root endpoint, Once this endpoint is hit, The index.ejs file will be renderded in the client side
app.get("/", async (req, res) => {
    res.render("index.ejs")
});

app.post('/submit', async (req, res) => {
    try {
        const url = req.body.data; // Extractiong URL from the client side request

        // Use a regular expression to extract username and slug
        const match = url.match(/https:\/\/dev\.to\/([^\/]+)\/([^\/]+)/);

        if (match && match.length === 3) {
            const username = match[1];
            const slug = match[2];

            console.log('Username:', username);
            console.log('Slug:', slug);

            const articleData = await getDevToArticleData(username, slug);
            console.log(articleData);
            const publishedArticle = await publishArticleToGraphQL(articleData);
            
            // Assuming you want to send some response back
            res.send(`Article published successfully for ${username}/${slug}`);
        } else {
            console.log('Invalid URL format');
            res.status(400).send('Invalid URL format');
        }
    } catch (error) {
        // console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);;
});