const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB();

// Create Movies table
const createMoviesTableParams = {
    TableName: 'Movies',
    KeySchema: [{ AttributeName: 'movieId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'movieId', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
};

// Create CastMembers table
const createCastMembersTableParams = {
    TableName: 'CastMembers',
    KeySchema: [{ AttributeName: 'castId', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'castId', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
};

// Create MovieCast table
const createMovieCastTableParams = {
    TableName: 'MovieCast',
    KeySchema: [
        { AttributeName: 'movieId', KeyType: 'HASH' },
        { AttributeName: 'castId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'movieId', AttributeType: 'S' },
        { AttributeName: 'castId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
};

// Create GSIs
const createMovieCastGSIParams = {
    TableName: 'MovieCast',
    IndexName: 'CastIndex',
    KeySchema: [
        { AttributeName: 'castId', KeyType: 'HASH' },
        { AttributeName: 'movieId', KeyType: 'RANGE' }
    ],
    Projection: { ProjectionType: 'ALL' },
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
};

// Function to create tables and GSIs
async function createTables() {
    try {
        await dynamodb.createTable(createMoviesTableParams).promise();
        console.log('Movies table created');
        await dynamodb.createTable(createCastMembersTableParams).promise();
        console.log('CastMembers table created');
        await dynamodb.createTable(createMovieCastTableParams).promise();
        console.log('MovieCast table created');
        await dynamodb.createTable(createMovieCastGSIParams).promise();
        console.log('MovieCast GSI created');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

// Call function to create tables and GSIs
createTables();
