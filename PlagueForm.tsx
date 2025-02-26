import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form, Row, Col, Input, Select, Modal, InputNumber, Alert
} from 'antd';
import { IDataQuarterly } from '../../../../config/Interfaces/Traceability/Ornamental';
import { useLoading } from '../../../../hooks/Shared/Common';
import { formMultiRowLayout } from '../../../../config/Shared/Constants';
import { SelectOptions } from '../../../Shared';
import { IOptionTypeSelect } from '../../../../config/Interfaces';

interface IPlagueForm {
  visible: boolean,
  readonly: boolean,
  plaque: any,
  data: IDataQuarterly,
  handleCancel: () => void,
  handleSubmit: (values: any) => void,
  getPestsByGroup: (value: string) => any,
}

const OTHER = 'oth';
const ROYAL = '5';
const FUNGUS = '4';

const PlagueForm: FC<IPlagueForm> = ({
  visible, plaque, data, readonly,
  handleCancel, handleSubmit, getPestsByGroup
}) => {
  const [meta, setMeta] = useState<any>();
  const [other, setOther] = useState<boolean>(false);
  const { loading, onStart, onEnd } = useLoading({ defaultLoading: false });
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleMeta = (param: any) => setMeta((_meta: any) => ({ ..._meta, ...param }));

  const { groups = [], pestsTypes, species = [] } = data || {};
  const { id } = plaque || {};

  useEffect(() => {
    const { pest, specie } = plaque || {};
    const { groupPest } = pest || {};
    const { id: groupId } = groupPest || {};
    getPestsByGroup(groupPest?.id?.toString() || '');
    form.setFieldsValue({
      ...plaque,
      ...pest,
      type: pest?.id,
      group: groupId || (id ? OTHER : undefined),
      specieId: specie?.id?.toString()
    });
    setOther(id && !groupId);
    handleMeta({
      groupPest,
      pest,
      specie: {
        id: specie?.id,
        scientificName: specie?.scientificName?.name,
        commonName: specie?.commonName?.name,
      }
    });
  }, [visible]);

  const onOk = () => {
    form.validateFields().then((values) => {
      onStart();
      const {
        incidence,
        scaleDescription,
        scaleGrade,
        other: oth,
        observations,
      } = values || {};
      const current = {
        incidence,
        scaleDescription,
        scaleGrade,
        other: oth,
        observations,
      };
      const { groupPest, pest, specie } = meta || {};
      handleSubmit({
        ...current,
        pest: values.group !== OTHER ? { groupPest, ...pest } : undefined,
        specie: {
          ...specie,
          scientificName: {
            name: specie?.scientificName
          },
          commonName: {
            name: specie?.commonName
          }
        }
      });
    });
  };

  const handleChangeGroup = async (_: string, option: IOptionTypeSelect) => {
    setOther(option.value === OTHER);
    const init = {
      type: undefined, order: undefined, family: undefined, genresSpeciesInvolved: undefined
    };
    getPestsByGroup(option.value?.toString() || '');
    form.setFieldsValue({ ...init });
    handleMeta({ groupPest: { id: option.value, name: option.children } });
  };

  const handleChangeGroupType = (_: string, option: IOptionTypeSelect) => {
    const pestType = (pestsTypes || []).find(({ id: pestId }: any) => pestId === option.value);
    const { order, family, genresSpeciesInvolved } = pestType || {};
    handleMeta({
      pest: option.value !== OTHER ? {
        id: option.value, name: option.children, order, family, genresSpeciesInvolved
      } : undefined
    });
    form.setFieldsValue({ order, family, genresSpeciesInvolved });
  };

  const handleChangeSpecie = (value: string) => {
    const { commonName, scientificName } = (species || []).find(({ id: specieId }) => specieId === value) || {};
    handleMeta({ specie: { id: value, commonName, scientificName } });
  };

  const validRequiredSeverity = () => (meta?.groupPest && (meta?.groupPest?.id === ROYAL || meta?.groupPest?.id === FUNGUS));

  return (
    <Modal
      open={visible}
      title={readonly ? t('quarterlyReports.plague.view') : id ? t('quarterlyReports.plague.edit') : t('quarterlyReports.plague.add')}
      okText={t('common.ok')}
      cancelText={t('common.cancel')}
      onCancel={handleCancel}
      onOk={onOk}
      afterClose={() => {
        onEnd();
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
        {other && (
          <Alert
            description={t('quarterlyReports.plague.validOtherPlague')}
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.specie.scientificName')}
              name="specieId"
              rules={[{ required: true, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(value) => handleChangeSpecie(value)}
                disabled={readonly || id}
              >
                {SelectOptions({
                  data: species, list: '', value: 'id', name: 'scientificName'
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.plague.form.group')}
              name="group"
              rules={[{ required: true, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <Select
                showSearch
                optionFilterProp="children"
                disabled={readonly}
                onChange={handleChangeGroup}
              >
                {SelectOptions({
                  data: groups, list: '', value: 'id', name: 'name'
                })}
              </Select>
            </Form.Item>
          </Col>
          {other && (
            <Col span={12}>
              <Form.Item
                label={t('quarterlyReports.plague.form.other')}
                name="other"
                rules={[{ required: true, message: t('rules.fieldRequired') }]}
                {...formMultiRowLayout}
              >
                <Input disabled={readonly} maxLength={255} />
              </Form.Item>
            </Col>
          )}
          {!other && (
          <>
            <Col span={12}>
              <Form.Item
                label={t('quarterlyReports.plague.form.type')}
                name="type"
                rules={[{ required: true, message: t('rules.fieldRequired') }]}
                {...formMultiRowLayout}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  disabled={readonly}
                  onChange={handleChangeGroupType}
                >
                  {SelectOptions({
                    data: pestsTypes, list: '', value: 'id', name: 'name'
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('quarterlyReports.plague.form.order')}
                name="order"
                rules={[{ required: false, message: t('rules.fieldRequired') }]}
                {...formMultiRowLayout}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('quarterlyReports.plague.form.family')}
                name="family"
                rules={[{ required: false, message: t('rules.fieldRequired') }]}
                {...formMultiRowLayout}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('quarterlyReports.plague.form.gender')}
                name="genresSpeciesInvolved"
                rules={[{ required: false, message: t('rules.fieldRequired') }]}
                {...formMultiRowLayout}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </>
          )}
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.plague.form.incidence')}
              name="incidence"
              rules={[{ required: true, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <InputNumber
                min={0}
                precision={2}
                disabled={readonly}
                className="custom-full-width"
              />
            </Form.Item>
          </Col>
        </Row>
        <span><p>{t('quarterlyReports.plague.form.severity')}</p></span>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.plague.form.scaleDescription')}
              name="scaleDescription"
              rules={[{ required: validRequiredSeverity(), message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <Input disabled={readonly} maxLength={1000} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('quarterlyReports.plague.form.scaleDegree')}
              name="scaleGrade"
              rules={[{ required: validRequiredSeverity(), message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <InputNumber
                min={0}
                precision={0}
                disabled={readonly}
                className="custom-full-width"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('quarterlyReports.plague.form.observations')}
              name="observations"
              rules={[{ required: false, message: t('rules.fieldRequired') }]}
              {...formMultiRowLayout}
            >
              <Input.TextArea
                autoSize={{ minRows: 5, maxRows: 7 }}
                disabled={readonly}
                maxLength={1000}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PlagueForm;
