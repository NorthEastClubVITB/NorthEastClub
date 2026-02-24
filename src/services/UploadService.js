const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading media:', error);
        throw error;
    }
};
