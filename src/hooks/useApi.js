import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export function useApi(endpoint, options = {}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(endpoint);
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (options.autoFetch !== false) {
            fetchData();
        }
    }, [endpoint]);

    const create = async (newData) => {
        try {
            const response = await apiClient.post(endpoint, newData);
            await fetchData();
            return response.data;
        } catch (err) {
            throw err.response?.data || err;
        }
    };

    const update = async (id, updatedData) => {
        try {
            const response = await apiClient.put(`${endpoint}/${id}`, updatedData);
            await fetchData();
            return response.data;
        } catch (err) {
            throw err.response?.data || err;
        }
    };

    const remove = async (id) => {
        try {
            await apiClient.delete(`${endpoint}/${id}`);
            await fetchData();
        } catch (err) {
            throw err.response?.data || err;
        }
    };

    return { data, loading, error, fetchData, create, update, remove };
}