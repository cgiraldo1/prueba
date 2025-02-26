import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form, Row, Col, Select, DatePicker, Modal
} from 'antd';
import { formMultiRowLayout } from '../../../../config/Shared/Constants';
import { SelectOptions } from '../../../Shared';

interface IExport {
  data: any,
  visible: boolean,
  handleCancel: () => void,
  handleSubmit: (values: any) => void,
  loading: boolean
}

const Export: FC<IExport> = ({
  data, visible, handleSubmit, handleCancel, loading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { quarterlies, units } = data || {};

  const onOk = () => {
    form.validateFields().then((values) => {
      handleSubmit({ ...values, year: values.year.format('YYYY') });
    });
  };

  return (
    <Modal
      open={visible}
      title={t('quarterlyReports.export')}
      okText={t('common.ok')}
      cancelText={t('common.cancel')}
      onCancel={handleCancel}
      onOk={onOk}
      afterClose={() => {
        form.resetFields();
      }}
      closable={false}
      maskClosable={false}
      width="70%"
      forceRender
      centered
      okButtonProps={{ loading }}
    >
      <Form form={form}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.form.year')}
              name="year"
              rules={[{ required: true, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <DatePicker
                picker="year"
                placeholder={t('quarterlyReports.form.placeholderYear')}
                className="custom-full-width"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.form.quarterly')}
              name="quarterly"
              rules={[{ required: true, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <Select
                showSearch
                optionFilterProp="children"
              >
                {SelectOptions({
                  data: quarterlies, list: '', value: 'id', name: 'name'
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.form.unit')}
              name="unit"
              rules={[{ required: true, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <Select
                showSearch
                optionFilterProp="children"
              >
                {SelectOptions({
                  data: units || [], list: '', value: 'id', name: 'name'
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Export;
