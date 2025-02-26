import React, { FC, useEffect } from 'react';
import {
  FormInstance, Row, Col, Form, Select, Input
} from 'antd';
import { useTranslation } from 'react-i18next';
import { SelectOptions, Title } from '../../../Shared';
import { formMultiRowLayout } from '../../../../config/Shared/Constants';
import { IDataQuarterly } from '../../../../config/Interfaces/Traceability/Ornamental';

interface ISpecie {
  form: FormInstance,
  readonly: boolean,
  data: IDataQuarterly,
  specie: any,
  species: any,
  handleMeta: (param: any) => void
}

const Specie: FC<ISpecie> = ({
  form, readonly, data, specie, handleMeta, species
}) => {
  const { t } = useTranslation();
  const { species: dataSpecies } = data || {};

  useEffect(() => {
    form.setFieldsValue({ specieId: specie?.id?.toString(), commonName: specie?.commonName });
  }, [specie]);

  const getSpecies = () => {
    if (species?.length > 0) {
      const speciesId = (species || []).map((item: any) => item?.id?.toString()).filter((item: any) => item !== specie?.id?.toString());
      return (dataSpecies || []).filter(({ id }) => !speciesId.includes(id))
        .map(({ id, scientificName }) => ({ id, scientificName }));
    }
    return dataSpecies;
  };

  const handleChangeSpecie = (value: string) => {
    const { commonName, scientificName } = (dataSpecies || []).find(({ id: specieId }) => specieId === value) || {};
    form.setFieldsValue({ commonName });
    handleMeta({ id: value, commonName, scientificName });
  };

  return (
    <div>
      <Title title={t('quarterlyReports.specie.title')} />
      <span><p>{t('quarterlyReports.specie.help')}</p></span>
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
              disabled={readonly || specie?.id}
            >
              {SelectOptions({
                data: getSpecies(), list: '', value: 'id', name: 'scientificName'
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('quarterlyReports.specie.commonName')}
            name="commonName"
            rules={[{ required: false, message: t('rules.fieldRequired') }]}
            {...formMultiRowLayout}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default Specie;
