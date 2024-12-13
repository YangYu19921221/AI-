import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Form, Input, Button, Upload, message, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getAssignmentDetail, submitAssignment, saveDraft } from '../../services/assignmentService';

const { TextArea } = Input;

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAssignmentDetail();
  }, [id]);

  const fetchAssignmentDetail = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentDetail(id);
      setAssignment(response.data);
      
      // 如果有提交记录，填充表单
      if (response.data.Submissions?.[0]) {
        const submission = response.data.Submissions[0];
        form.setFieldsValue({
          content: submission.content,
          attachments: submission.attachments
        });
      }
    } catch (error) {
      message.error('获取作业详情失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await submitAssignment(id, values);
      message.success('作业提交成功');
      fetchAssignmentDetail(); // 刷新数据
    } catch (error) {
      message.error('提交作业失败');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      await saveDraft(id, values);
      message.success('草稿保存成功');
    } catch (error) {
      message.error('保存草稿失败');
      console.error(error);
    }
  };

  if (loading || !assignment) {
    return <div>加载中...</div>;
  }

  const isSubmitted = assignment.Submissions?.[0]?.status === 'submitted';
  const isGraded = assignment.Submissions?.[0]?.status === 'graded';

  return (
    <div className="assignment-detail-container">
      <Card title={assignment.title} className="assignment-info">
        <p><strong>截止日期：</strong>{new Date(assignment.deadline).toLocaleString()}</p>
        <p><strong>总分：</strong>{assignment.totalScore}</p>
        <p><strong>描述：</strong>{assignment.description}</p>
        {assignment.requirements && (
          <div>
            <strong>要求：</strong>
            <ul>
              {assignment.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {isGraded ? (
        <Card title="批改结果" className="submission-form">
          <p><strong>得分：</strong>{assignment.Submissions[0].score}</p>
          <p><strong>反馈：</strong>{assignment.Submissions[0].feedback}</p>
        </Card>
      ) : (
        <Card title="提交作业" className="submission-form">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            disabled={isSubmitted}
          >
            <Form.Item
              name="content"
              label="作业内容"
              rules={[{ required: true, message: '请输入作业内容' }]}
            >
              <TextArea rows={6} placeholder="请输入你的作业内容" />
            </Form.Item>

            <Form.Item
              name="attachments"
              label="附件"
            >
              <Upload>
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={isSubmitted}
                >
                  提交作业
                </Button>
                <Button
                  onClick={handleSaveDraft}
                  disabled={isSubmitted}
                >
                  保存草稿
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default AssignmentDetail;
