import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Card,
    Row,
    Col,
    Input,
    Select,
    Button,
    Tag,
    Empty,
    Skeleton,
    message,
    Pagination
} from 'antd';
import {
    SearchOutlined,
    BookOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import axios from '../../utils/axios';

const { Content } = Layout;
const { Option } = Select;

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 12,
        total: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: ''
    });

    // 获取课程列表
    const fetchCourses = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page,
                pageSize: pagination.pageSize,
                ...filters
            });

            const response = await axios.get(`/api/courses?${params.toString()}`);
            const { list, pagination: paginationData } = response.data.data;
            setCourses(list);
            setPagination(prev => ({
                ...prev,
                current: paginationData.current,
                total: paginationData.total
            }));
        } catch (error) {
            message.error('获取课程列表失败');
            console.error('获取课程列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    // 处理分页变化
    const handlePageChange = (page) => {
        fetchCourses(page);
    };

    // 处理筛选条件变化
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current: 1 })); // 重置页码
    };

    // 课程难度标签颜色映射
    const levelColors = {
        beginner: 'green',
        intermediate: 'blue',
        advanced: 'red'
    };

    // 课程难度中文映射
    const levelLabels = {
        beginner: '初级',
        intermediate: '中级',
        advanced: '高级'
    };

    // 渲染课程卡片
    const renderCourseCard = (course) => (
        <Card
            className="tech-card course-card"
            hoverable
            cover={
                <div className="course-cover">
                    <img
                        alt={course.title}
                        src={course.coverImage || 'https://via.placeholder.com/300x200'}
                    />
                    <div className="course-overlay">
                        <Button 
                            type="primary" 
                            onClick={() => navigate(`/courses/${course.id}`)}
                        >
                            查看详情
                        </Button>
                    </div>
                </div>
            }
            onClick={() => navigate(`/courses/${course.id}`)}
        >
            <Card.Meta
                title={course.title}
                description={
                    <div>
                        <p className="course-desc">{course.description}</p>
                        <div className="course-info">
                            <Tag color={levelColors[course.level]}>
                                {levelLabels[course.level]}
                            </Tag>
                            <span className="course-teacher">
                                <UserOutlined /> {course.teacher?.username}
                            </span>
                        </div>
                    </div>
                }
            />
        </Card>
    );

    return (
        <Layout className="tech-bg">
            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                {/* 搜索和筛选区域 */}
                <div className="tech-card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8} lg={10}>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="搜索课程"
                                className="tech-input"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={4}>
                            <Select
                                placeholder="课程分类"
                                className="tech-select"
                                style={{ width: '100%' }}
                                value={filters.category}
                                onChange={(value) => handleFilterChange('category', value)}
                                allowClear
                            >
                                <Option value="programming">编程</Option>
                                <Option value="math">数学</Option>
                                <Option value="language">语言</Option>
                                <Option value="science">科学</Option>
                            </Select>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={4}>
                            <Select
                                placeholder="难度等级"
                                className="tech-select"
                                style={{ width: '100%' }}
                                value={filters.level}
                                onChange={(value) => handleFilterChange('level', value)}
                                allowClear
                            >
                                <Option value="beginner">初级</Option>
                                <Option value="intermediate">中级</Option>
                                <Option value="advanced">高级</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                {/* 课程列表 */}
                <div className="fade-in">
                    {loading ? (
                        <Row gutter={[24, 24]}>
                            {[1, 2, 3, 4].map(key => (
                                <Col xs={24} sm={12} md={8} lg={6} key={key}>
                                    <Card className="tech-card">
                                        <Skeleton active />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : courses.length > 0 ? (
                        <>
                            <Row gutter={[24, 24]}>
                                {courses.map(course => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                                        {renderCourseCard(course)}
                                    </Col>
                                ))}
                            </Row>
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <Pagination
                                    current={pagination.current}
                                    total={pagination.total}
                                    pageSize={pagination.pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        </>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span style={{ color: 'var(--text-color)' }}>
                                    暂无课程
                                </span>
                            }
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default CourseList;
