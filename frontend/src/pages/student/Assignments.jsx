import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAssignments } from '../../services/assignmentService';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignments();
      setAssignments(response.data);
    } catch (error) {
      message.error('获取作业列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status, submission) => {
    if (!submission) {
      return <Tag color="warning">未提交</Tag>;
    }
    switch (submission.status) {
      case 'draft':
        return <Tag color="processing">草稿</Tag>;
      case 'submitted':
        return <Tag color="success">已提交</Tag>;
      case 'graded':
        return <Tag color="blue">已批改</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const columns = [
    {
      title: '作业标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          quiz: '测验',
          project: '项目',
          essay: '论文'
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => getStatusTag(record.status, record.Submissions?.[0]),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => navigate(`/student/assignments/${record.id}`)}>
            查看详情
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="assignments-container">
      <h2>我的作业</h2>
      <Table
        columns={columns}
        dataSource={assignments}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default Assignments;
