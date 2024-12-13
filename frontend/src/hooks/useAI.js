import { useState } from 'react';
import axios from 'axios';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content, subject) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/chat', {
        messages: [{
          role: 'user',
          content
        }],
        subject
      });
      return response.data;
    } catch (error) {
      console.error('AI请求错误:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const extractKeyPoints = async (content) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/extract-key-points', {
        content
      });
      return response.data;
    } catch (error) {
      console.error('提取知识点错误:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateExercises = async (topic, difficulty) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/generate-exercises', {
        topic,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('生成练习题错误:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendMessage,
    extractKeyPoints,
    generateExercises
  };
};
