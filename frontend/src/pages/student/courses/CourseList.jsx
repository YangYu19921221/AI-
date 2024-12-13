import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Input, 
    Select, 
    Space, 
    Progress, 
    Tag, 
    Empty,
    Spin,
    message
} from 'antd';
import { 
    SearchOutlined,
    BookOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import axios from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: ''
    });

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.level) params.append('level', filters.level);

            const response = await axios.get(`/api/student/courses?${params.toString()}`);
            setCourses(response.data);
        } catch (error) {
            message.error('获取课程列表失败');
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    const handleCategoryChange = (value) => {
        setFilters(prev => ({ ...prev, category: value }));
    };

    const handleLevelChange = (value) => {
        setFilters(prev => ({ ...prev, level: value }));
    };

    const handleCourseClick = (courseId) => {
        navigate(`/student/courses/${courseId}`);
    };

    const CourseCard = ({ course }) => (
        <Card 
            hoverable 
            className="course-card"
            onClick={() => handleCourseClick(course.id)}
        >
            <Row gutter={16}>
                <Col span={8}>
                    <img 
                        src={course.coverImage || '/default-course.jpg'} 
                        alt={course.title}
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                </Col>
                <Col span={16}>
                    <h3>{course.title}</h3>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                            <Tag color="blue">{course.category}</Tag>
                            <Tag color="green">{course.level}</Tag>
                        </Space>
                        <Progress 
                            percent={course.progress} 
                            size="small" 
                            status="active"
                            style={{ marginBottom: 0 }}
                        />
                        {course.lastStudyTime && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                <ClockCircleOutlined /> 上次学习: 
                                {new Date(course.lastStudyTime).toLocaleDateString()}
                            </div>
                        )}
                    </Space>
                </Col>
            </Row>
        </Card>
    );

    return (
        <div className="course-list-container" style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={[16, 16]} justify="space-between" align="middle">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="搜索课程..."
                            prefix={<SearchOutlined />}
                            onChange={e => handleSearch(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                        <Space>
                            <Select
                                style={{ width: 120 }}
                                placeholder="课程分类"
                                onChange={handleCategoryChange}
                                allowClear
                            >
                                <Option value="programming">编程</Option>
                                <Option value="math">数学</Option>
                                <Option value="language">语言</Option>
                            </Select>
                            <Select
                                style={{ width: 120 }}
                                placeholder="难度等级"
                                onChange={handleLevelChange}
                                allowClear
                            >
                                <Option value="beginner">入门</Option>
                                <Option value="intermediate">中级</Option>
                                <Option value="advanced">高级</Option>
                            </Select>
                        </Space>
                    </Col>
                </Row>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                    </div>
                ) : courses.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {courses.map(course => (
                            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                                <CourseCard course={course} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无课程"
                    />
                )}
            </Space>
        </div>
    );
};

export default CourseList;
