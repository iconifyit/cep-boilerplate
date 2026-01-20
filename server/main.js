/* npm Modules */
const express    = require("express");
const axios      = require("axios");
const http       = require("http");
const path       = require("path");
const bodyParser = require("body-parser");
const fs         = require("fs");

const app        = express();
const httpServer = http.Server(app);

module.exports = run;

function run() {
    const port     = 3200;
    const hostname = "localhost";

    /* Start the server */
    httpServer.listen(port);

    /* Middlewares */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.static(path.join(__dirname, "../client")));

    /* /import route that can be hit from the client side */
    app.get("/import", async (req, res) => {

        try {
            /* Get the directory path from the header and name the file */
            const filePath = path.join(req.headers["directory"], "placeholder.png");

            /* Example URL */
            const uri = "http://via.placeholder.com/350x150";

            /* Download and save image */
            await saveImage(uri, filePath);

            /* Send the path back to the client */
            res.status(200).send(filePath);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("Failed to import image");
        }
    });
}

/**
 * Download an image and save it to disk
 */
const saveImage = async (uri, filePath) => {
    const response = await axios({
        method       : 'get',
        url          : uri,
        responseType : 'stream',
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};