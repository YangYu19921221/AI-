import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Calendar, Badge, Button } from 'antd';
import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [learningStats, setLearningStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLearningTime: 0,
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // TODO: 从后端获取数据
    // 模拟数据
    setLearningStats({
      totalCourses: 5,
      completedCourses: 2,
      totalLearningTime: 24,
    });

    setRecentCourses([
      { id: 1, name: '高等数学', progress: 60, lastStudied: '2023-12-12' },
      { id: 2, name: '线性代数', progress: 30, lastStudied: '2023-12-11' },
      { id: 3, name: '概率论', progress: 45, lastStudied: '2023-12-10' },
    ]);

    setSchedule([
      { date: '2023-12-13', events: ['高等数学作业', '线性代数测验'] },
      { date: '2023-12-14', events: ['概率论课程'] },
      { date: '2023-12-15', events: ['高等数学课程'] },
    ]);
  }, []);

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayEvents = schedule.find(item => item.date === dateStr);
    return dayEvents ? dayEvents.events.map(event => ({ type: 'success', content: event })) : [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>学习概览</h2>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总课程数"
              value={learningStats.totalCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已完成课程"
              value={learningStats.completedCourses}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总学习时长(小时)"
              value={learningStats.totalLearningTime}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="最近学习" 
            extra={
              <Button 
                type="link" 
                onClick={() => navigate('/student/courses')}
                icon={<RightOutlined />}
              >
                查看全部课程
              </Button>
            }
            style={{ marginBottom: 24 }}
          >
            <List
              dataSource={recentCourses}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a onClick={() => navigate('/student/courses')}>{item.name}</a>
                    }
                    description={`上次学习: ${item.lastStudied}`}
                  />
                  <div>进度: {item.progress}%</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="学习日程">
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
