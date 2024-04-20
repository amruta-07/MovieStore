const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ region: 'us-east-1' });

const docClient = new AWS.DynamoDB.DocumentClient();
const rawData = fs.readFileSync('movies.json');
const moviesData = JSON.parse(rawData);

async function insertData() {
    try {
        for (const movie of moviesData) {
            // Insert movie data into the Movies table
            const movieParams = {
                TableName: 'Movies',
                Item: {
                    movieId: movie.title.replace(/\s+/g, '_'), // Generate movieId from the movie title
                    title: movie.title,
                    year: movie.year,
                    genres: movie.genres,
                    href: movie.href,
                    extract: movie.extract,
                    thumbnail: movie.thumbnail,
                    thumbnail_width: movie.thumbnail_width,
                    thumbnail_height: movie.thumbnail_height
                }
            };
            await docClient.put(movieParams).promise();

            // Insert cast members into CastMembers table and create entries in MovieCast table
            for (const castMember of movie.cast) {
                // Insert cast member data into CastMembers table
                const castId = `${movie.title.replace(/\s+/g, '_')}_${castMember.replace(/\s+/g, '_')}`;
                const castParams = {
                    TableName: 'CastMembers',
                    Item: {
                        castId: castId,
                        name: castMember
                    }
                };
                await docClient.put(castParams).promise();

                // Create entry in MovieCast table
                const movieCastParams = {
                    TableName: 'MovieCast',
                    Item: {
                        movieId: movie.title.replace(/\s+/g, '_'),
                        castId: castId
                    }
                };
                await docClient.put(movieCastParams).promise();
            }

            console.log(`Inserted data for movie: ${movie.title}`);
        }
        console.log('All data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

insertData();
