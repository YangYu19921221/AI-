import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Empty,
  Typography,
  message,
  Modal,
  List,
  Tag,
  Progress,
  Spin,
  Card
} from 'antd';
import {
  FilterOutlined,
  SearchOutlined,
  BookOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from '../../utils/axios';
import './Courses.css';

const { Title, Text } = Typography;
const { Option } = Select;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  
  const getStatusTag = (progress) => {
    if (progress === 100) return <Tag color="success">已完成</Tag>;
    if (progress > 0) return <Tag color="processing">进行中</Tag>;
    return <Tag color="default">未开始</Tag>;
  };

  const handleClick = () => {
    navigate(`/student/courses/${course.id}`);
  };

  return (
    <Card 
      hoverable
      className="course-card"
      cover={
        <img
          alt={course.title}
          src={course.coverImage || 'https://via.placeholder.com/300x160?text=课程封面'}
          style={{ height: 160, objectFit: 'cover' }}
        />
      }
      onClick={handleClick}
    >
      <Card.Meta
        title={course.title}
        description={
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div className="course-info">
              <Space split="·">
                <span>
                  <UserOutlined style={{ marginRight: 4 }} />
                  {course.teacher?.name || '未知讲师'}
                </span>
                <span>
                  <BookOutlined style={{ marginRight: 4 }} />
                  {course.lessonCount || 0} 课时
                </span>
              </Space>
            </div>
            <div className="course-progress">
              <Space direction="vertical" style={{ width: '100%' }} size={4}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">学习进度</Text>
                  <Text type="secondary">{course.progress || 0}%</Text>
                </div>
                <Progress 
                  percent={course.progress || 0} 
                  size="small" 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {getStatusTag(course.progress || 0)}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {course.lastStudyTime || '尚未开始学习'}
              </Text>
            </div>
          </Space>
        }
      />
    </Card>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // 构建查询参数
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.level && filters.level !== 'all') {
        params.append('level', filters.level);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await axios.get(`/api/student/courses?${params.toString()}`);
      
      // response 现在直接是 data，因为在 axios 拦截器中处理过了
      if (response.success && Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        setCourses([]);
        message.warning('暂无课程数据');
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
      setCourses([]);
      // 错误消息已经在 axios 拦截器中处理过了
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const getFilteredCourses = () => {
    if (!Array.isArray(courses)) {
      return [];
    }
    
    return courses.filter(course => {
      // 搜索过滤
      if (filters.search && !course.title?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // 分类过滤
      if (filters.category !== 'all') {
        const progress = course.progress || 0;
        if (filters.category === 'completed' && progress !== 100) return false;
        if (filters.category === 'inProgress' && (progress === 0 || progress === 100)) return false;
        if (filters.category === 'notStarted' && progress !== 0) return false;
      }
      
      // 难度过滤
      if (filters.level !== 'all' && course.level !== filters.level) {
        return false;
      }
      
      return true;
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const filteredCourses = getFilteredCourses();

  return (
    <div className="courses-container">
      <div className="header-section" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 0 }}>我的课程</Title>
        <div className="filter-section">
          <Space size="middle">
            <Input.Search
              className="search-input"
              placeholder="搜索课程..."
              allowClear
              style={{ width: 250 }}
              onSearch={handleSearch}
            />
            <Select
              style={{ width: 120 }}
              placeholder="课程状态"
              value={filters.category}
              onChange={value => setFilters(prev => ({ ...prev, category: value }))}
            >
              <Option value="all">全部状态</Option>
              <Option value="inProgress">进行中</Option>
              <Option value="notStarted">未开始</Option>
              <Option value="completed">已完成</Option>
            </Select>
            <Select
              style={{ width: 120 }}
              placeholder="难度等级"
              value={filters.level}
              onChange={value => setFilters(prev => ({ ...prev, level: value }))}
            >
              <Option value="all">全部难度</Option>
              <Option value="beginner">初级</Option>
              <Option value="intermediate">中级</Option>
              <Option value="advanced">高级</Option>
            </Select>
          </Space>
        </div>
      </div>

      <div className="courses-grid">
        <Row gutter={[24, 24]}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
                <CourseCard course={course} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty
                description="暂无课程"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Courses;
