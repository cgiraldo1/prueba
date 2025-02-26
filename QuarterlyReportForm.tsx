import React, { FC, useEffect } from 'react';
import {
  Form, Select, Row, Col, FormInstance
} from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { formMultiRowLayout } from '../../../../config/Shared/Constants';
import { SelectOptions } from '../../../Shared';
import { IDataQuarterly } from '../../../../config/Interfaces/Traceability/Ornamental';
import { getDateQuarterly } from '../../../../utils/common';
// import Specie from './Specie';
// import SownArea from './SownArea';
import Plague from './Plague';
import ParentSpecie from './ParentSpecie';

interface IQuarterlyReportForm {
  readonly: boolean,
  data: IDataQuarterly,
  meta: any,
  handleMeta: (param: any) => void,
  form: FormInstance,
  getSpecieByPlaceProduction: (mainEstateId: string) => void,
  getPestsByGroup: (value: string) => any,
  existQuarterlyReport: Function
}

const QuarterlyReportForm: FC<IQuarterlyReportForm> = ({
  readonly, data, meta, handleMeta, form,
  getSpecieByPlaceProduction, getPestsByGroup, existQuarterlyReport
}) => {
  const { t } = useTranslation();

  const { quarterly, species = [], plant } = meta || {};
  const {
    id,
    year,
    quarter,
    report,
    plantId
  } = quarterly || {};

  const {
    quarterlies, years, units = []
  } = data || {};

  useEffect(() => {
    form.setFieldsValue({
      year: year || moment().year(),
      quarter,
      report,
      plantId: plantId?.toString()
    });
  }, [quarterly]);

  const handleSelectedQuarter = (value: string) => {
    const yearSelect = quarterlies?.find((item) => item.id === value)?.year || moment().year();
    form.setFieldsValue({
      year: yearSelect
    });
    handleMeta({ quarter: value, year: yearSelect });
    existQuarterlyReport({
      plantId: meta.plantId, year: meta.year, quarter: value, quarterlyReportId: id || null
    });
  };

  const handleSelectedPlant = (value: string) => {
    const yearCurrent = moment().year();
    getSpecieByPlaceProduction(value);
    handleMeta({ plantId: value, year: yearCurrent, quarter: undefined });
    existQuarterlyReport({
      plantId: value, year: meta.year, quarter: meta.quarter, quarterlyReportId: id || null
    });
    form.setFieldsValue({
      year: yearCurrent, quarter: undefined, specieId: undefined, commonName: undefined
    });
  };

  return (
    <>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            label={t('quarterlyReports.form.year')}
            name="year"
            rules={[{ required: true, message: t('rules.fieldRequired') }]}
            {...formMultiRowLayout}
          >
            <Select
              showSearch
              optionFilterProp="children"
              onChange={(value) => handleMeta({ year: value })}
              disabled
            >
              {SelectOptions({
                data: years, list: '', value: 'id', name: 'name'
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('quarterlyReports.form.quarterly')}
            name="quarter"
            rules={[{ required: true, message: t('rules.fieldRequired') }]}
            {...formMultiRowLayout}
          >
            <Select
              showSearch
              optionFilterProp="children"
              onChange={handleSelectedQuarter}
              disabled={readonly || species.length > 0 || id}
            >
              {SelectOptions({
                data: quarterlies, list: '', value: 'id', name: 'id'
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('quarterlyReports.form.unit')}
            name="plantId"
            rules={[{ required: true, message: t('rules.fieldRequired') }]}
            {...formMultiRowLayout}
          >
            <Select
              showSearch
              optionFilterProp="children"
              onChange={handleSelectedPlant}
              disabled={readonly || species.length > 0 || id}
            >
              {SelectOptions({
                data: units.length > 0 && readonly && plant ? units.concat(plant) : units, list: '', value: 'id', name: 'name'
              })}
            </Select>
          </Form.Item>
        </Col>
        {meta?.year && meta?.quarter && (
          <Col span={7} style={{ marginBottom: '16px', textAlign: 'right' }}>
            <span>
              <b>
                {getDateQuarterly(meta.year, meta.quarter)}
              </b>
            </span>
          </Col>
        )}
      </Row>
      <ParentSpecie readonly={readonly || meta.disabled} data={data} meta={meta} handleMeta={handleMeta} />
      <Plague readonly={readonly || meta.disabled} data={data} meta={meta} handleMeta={handleMeta} getPestsByGroup={getPestsByGroup} />
    </>
  );
};

export default QuarterlyReportForm;
