import axios from 'axios';

const BASE_URL = 'http://192.168.0.33:5984';
const username = 'admin';
const password = 'admin';
const DB_NAME = 'home_help';

const couch = axios.create({
    baseURL: BASE_URL,
    auth: {
        username: username,
        password: password,
    },
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkConnection = async () => {
    try {
        const res = await couch.get('/');
        console.log('✅ Connected to CouchDB:', res.data);
        return true;
    } catch (error) {
        console.log('❌ CouchDB connection failed:', error);
        return false;
    }
}

export default {
    createDoc: async (doc: any) => {
        try {
            const res = await couch.post(`/${DB_NAME}`, doc);
            console.log('✅ Document created:', res.data);
            return res.data;
        } catch (error: any) {
            console.log('❌ Failed to create doc:', error.message);
        }
    },
    getDoc: async (id: string) => {
        const res = await couch.get(`/${DB_NAME}/${id}`);
        return res.data;
    },
    updateDoc: async (id: string, doc: any) => {
        const res = await couch.put(`/${DB_NAME}/${id}`, doc);
        return res.data;
    },
    deleteDoc: async (id: string, rev: string) => {
        const res = await couch.delete(`/${DB_NAME}/${id}?rev=${rev}`);
        return res.data;
    },
    find: async ({ selector }: any) => {
        try {
            const res = await couch.post(`/${DB_NAME}/_find`, {
                selector,
                use_index: ["_design/attendance-index", "attendance-index"]
            });
            return res.data;
        } catch (err) {
            console.log(err)
        }
    },
    findByRole: async ({ selector }: any) => {
        try {
            const res = await couch.post(`/${DB_NAME}/_find`, {
                selector,
                use_index: ["_design/helper-index", "helper-index"]
            });
            return res.data;
        } catch (err) {
            console.log(err)
        }
    },
    getAllDocs: async () => {
        try {
            const res = await couch.get(`/${DB_NAME}/_all_docs`, {
                params: {
                    include_docs: true,
                },
            });

            const allDocs = res.data.rows.map((row: any) => row.doc);

            // Extract all roles and deduplicate them
            const docs = [...new Set(allDocs.map((doc: any) => doc).filter(Boolean))];
            return docs;
        } catch (error: any) {
            console.log('❌ Failed to get roles:', error.message);
            return [];
        }
    },
};
