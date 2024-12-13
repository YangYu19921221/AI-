import axios from 'axios';

const API_URL = '/api';

export const getAssignments = async () => {
  try {
    const response = await axios.get(`${API_URL}/student/assignments`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAssignmentDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/student/assignments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitAssignment = async (id, data) => {
  try {
    const response = await axios.post(`${API_URL}/student/assignments/${id}/submit`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveDraft = async (id, data) => {
  try {
    const response = await axios.post(`${API_URL}/student/assignments/${id}/draft`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
