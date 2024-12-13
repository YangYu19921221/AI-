import React from 'react';
import { Row, Col, Card, Statistic, Table, Timeline, Progress } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const Dashboard = () => {
  // 统计数据
  const stats = [
    {
      title: '在教课程',
      value: 5,
      icon: <BookOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: '学生总数',
      value: 156,
      icon: <UserOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: '待批作业',
      value: 23,
      icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: '已批作业',
      value: 189,
      icon: <CheckCircleOutlined style={{ color: '#13c2c2' }} />,
      color: '#13c2c2'
    }
  ];

  // 近期作业数据
  const recentAssignments = [
    {
      key: '1',
      course: '高等数学',
      title: '第三章习题',
      dueDate: '2024-12-15',
      submitted: 25,
      total: 30,
    },
    {
      key: '2',
      course: '线性代数',
      title: '矩阵运算作业',
      dueDate: '2024-12-14',
      submitted: 28,
      total: 30,
    },
    {
      key: '3',
      course: '概率论',
      title: '概率计算练习',
      dueDate: '2024-12-16',
      submitted: 15,
      total: 30,
    },
  ];

  // 课程活动时间线
  const recentActivities = [
    {
      color: '#1890ff',
      children: '发布了"高等数学"第三章作业',
    },
    {
      color: '#52c41a',
      children: '完成了"线性代数"第二章作业批改',
    },
    {
      color: '#faad14',
      children: '更新了"概率论"课程资料',
    },
    {
      color: '#1890ff',
      children: '回复了学生的课程问题',
    },
  ];

  const columns = [
    {
      title: '课程',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: '作业',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '提交情况',
      key: 'progress',
      render: (_, record) => (
        <Progress
          percent={Math.round((record.submitted / record.total) * 100)}
          size="small"
          format={() => `${record.submitted}/${record.total}`}
        />
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>教学概览</h2>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable className="dashboard-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card
            title="近期作业完成情况"
            className="dashboard-card"
          >
            <Table
              columns={columns}
              dataSource={recentAssignments}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="近期活动"
            className="dashboard-card"
          >
            <Timeline items={recentActivities} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
