// Appwrite Configuration

const client = new Appwrite.Client();

client
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6a23f8af000fd95f3984");

// Services

const account = new Appwrite.Account(client);

const databases = new Appwrite.Databases(client);

const storage = new Appwrite.Storage(client);

// Global variables available on all pages

window.client = client;
window.account = account;
window.databases = databases;
window.storage = storage;