const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const mediaBaseDir = path.resolve(__dirname, '../src/images/events');

const uploadFile = async (filePath, folder) => {
    const fileName = path.basename(filePath);
    const resourceType = filePath.match(/\.(mp4|mov|avi)$/i) ? 'video' : 'image';

    console.log(`Uploading ${fileName} to folder events/${folder}...`);

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `events/${folder}`,
            use_filename: true,
            unique_filename: false,
            resource_type: resourceType
        });
        console.log(`Successfully uploaded: ${result.secure_url}`);
    } catch (error) {
        console.error(`Failed to upload ${fileName}:`, error.message);
    }
};

const migrateFolder = async (folderName) => {
    const folderPath = path.join(mediaBaseDir, folderName);
    if (!fs.existsSync(folderPath)) {
        console.warn(`Folder ${folderName} does not exist at ${folderPath}`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    // Standard sorting to maintain "order" as requested
    files.sort();

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            await uploadFile(filePath, folderName);
        }
    }
};

const runMigration = async () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Error: Cloudinary credentials missing in .env file.');
        process.exit(1);
    }

    const foldersToMigrate = ['inaug', 'Threads_of_herit_1', 'Uncensored'];

    // Also migrate files directly in the events folder (like toh1.jpg, etc.)
    const rootFiles = fs.readdirSync(mediaBaseDir).filter(f => fs.statSync(path.join(mediaBaseDir, f)).isFile());
    rootFiles.sort();

    console.log('Starting migration of root files...');
    for (const file of rootFiles) {
        await uploadFile(path.join(mediaBaseDir, file), '');
    }

    for (const folder of foldersToMigrate) {
        console.log(`\nStarting migration of folder: ${folder}...`);
        await migrateFolder(folder);
    }

    console.log('\nMigration complete!');
};

runMigration();
