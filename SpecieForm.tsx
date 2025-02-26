import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'antd';
import { IDataQuarterly } from '../../../../config/Interfaces/Traceability/Ornamental';
import { useLoading } from '../../../../hooks/Shared/Common';
import Specie from './Specie';
import SownArea from './SownArea';

interface ISpecieForm {
  visible: boolean,
  readonly: boolean,
  specie: any,
  data: IDataQuarterly,
  species: any,
  handleCancel: () => void,
  handleSubmit: (values: any) => void,
}

const SpecieForm: FC<ISpecieForm> = ({
  visible, specie, data, readonly,
  handleCancel, handleSubmit, species
}) => {
  const [meta, setMeta] = useState<any>();
  const { loading, onStart, onEnd } = useLoading({ defaultLoading: false });
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleMeta = (param: any) => setMeta((_meta: any) => ({ ..._meta, ...param }));

  const { id, sownArea } = specie || {};

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...specie,
      });
      handleMeta({ commonName: specie?.commonName, scientificName: specie?.scientificName, sownArea: { ...sownArea, totalArea: undefined, __typename: undefined } });
    }
  }, [visible]);

  const onOk = () => {
    form.validateFields().then((values) => {
      onStart();
      const { specieId, totalArea } = values || {};
      const { commonName, scientificName, sownArea: _sownArea } = meta || {};
      const current = {
        id: specieId,
        commonName,
        scientificName,
        sownArea: { ..._sownArea, totalArea }
      };
      handleSubmit({ ...current });
    });
  };

  return (
    <Modal
      open={visible}
      title={readonly ? t('quarterlyReports.specie.view') : id ? t('quarterlyReports.specie.edit') : t('quarterlyReports.specie.add')}
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
      <Form
        form={form}
        initialValues={{
          outdoor: 0, shadeNet: 0, greenhouse: 0, totalArea: 0
        }}
      >
        <Specie form={form} readonly={readonly} data={data} specie={specie} handleMeta={handleMeta} species={species} />
        <SownArea readonly={readonly} form={form} meta={meta} handleMeta={handleMeta} />
      </Form>
    </Modal>
  );
};

export default SpecieForm;
