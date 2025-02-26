import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormInstance, Row, Col, Form, Input
} from 'antd';
import { Title } from '../../../Shared';
import { formMultiRowLayout } from '../../../../config/Shared/Constants';

interface ISownArea {
  readonly: boolean,
  form: FormInstance,
  meta: any,
  handleMeta: (param: any) => void
}

const SownArea: FC<ISownArea> = ({
  readonly, form, meta, handleMeta
}) => {
  const { t } = useTranslation();

  const { sownArea = {} } = meta || {};

  const getTotal = (value: number, key: string) => {
    // @ts-ignore
    const currentTotal = Object.values({ ...sownArea, [key]: value }).filter((item) => item).reduce((prev: number, curr: number) => parseFloat(prev || '0') + parseFloat(curr || '0'), 0);
    form.setFieldsValue({ totalArea: currentTotal });
    handleMeta({ sownArea: { ...sownArea, [key]: value } });
  };

  useEffect(() => {
    // @ts-ignore
    const currentTotal = Object.values({ ...sownArea }).filter((item) => item).reduce((prev: number, curr: number) => parseFloat(prev || '0') + parseFloat(curr || '0'), 0);
    form.setFieldsValue({ ...sownArea, totalArea: currentTotal });
  }, [sownArea]);

  const validateDecimalNumber = (value: any) => {
    const regex = /^\d+(\.\d{1,4})?$/;
    return regex.test(value);
  };

  const validatorNumber = (_rule: any, value: any, callback: any) => {
    if (!validateDecimalNumber(value)) {
      callback('Ingrese un número válido con hasta 4 decimales');
    } else {
      callback();
    }
  };

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    if (validateDecimalNumber(value) || value === '' || value === undefined) {
      form.setFieldsValue({ tuCampo: value });
    }
  };

  return (
    <div>
      <Title title={t('quarterlyReports.sownArea.title')} />
      <span><p>{t('quarterlyReports.sownArea.help')}</p></span>
      <Row gutter={8}>
        <Col span={6}>
          <Form.Item
            label={t('quarterlyReports.sownArea.outdoor')}
            name="outdoor"
            rules={[{ required: false, message: t('rules.fieldRequired') },
              { validator: validatorNumber }]}
            {...formMultiRowLayout}
          >
            <Input
              addonAfter="ha"
              disabled={readonly}
              className="custom-full-width"
              onChange={handleInputChange}
              onBlur={(e) => getTotal(parseFloat(e.target.value) || 0, 'outdoor')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={t('quarterlyReports.sownArea.polyshadow')}
            name="shadeNet"
            rules={[{ required: false, message: t('rules.fieldRequired') },
              { validator: validatorNumber }]}
            {...formMultiRowLayout}
          >
            <Input
              addonAfter="ha"
              disabled={readonly}
              className="custom-full-width"
              onChange={handleInputChange}
              onBlur={(e) => getTotal(parseFloat(e.target.value) || 0, 'shadeNet')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={t('quarterlyReports.sownArea.greenhouse')}
            name="greenhouse"
            rules={[{ required: false, message: t('rules.fieldRequired') },
              { validator: validatorNumber }]}
            {...formMultiRowLayout}
          >
            <Input
              addonAfter="ha"
              disabled={readonly}
              className="custom-full-width"
              onChange={handleInputChange}
              onBlur={(e) => getTotal(parseFloat(e.target.value) || 0, 'greenhouse')}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={t('quarterlyReports.sownArea.total')}
            name="totalArea"
            tooltip={t('quarterlyReports.sownArea.totalHelp')}
            rules={[{ required: true, message: t('rules.fieldRequired') }, { type: 'number', min: 0.0001, message: t('quarterlyReports.sownArea.totalMin') }]}
            {...formMultiRowLayout}
          >
            <Input
              addonAfter="ha"
              disabled
              className="custom-full-width"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default SownArea;
