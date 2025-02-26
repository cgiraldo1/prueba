import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert, Button, Col, Row
} from 'antd';
import { IDataQuarterly } from '../../../../config/Interfaces/Traceability/Ornamental';
import { Title } from '../../../Shared';
import SpecieList from './SpecieList';
import SpecieForm from './SpecieForm';
import { notify } from '../../../../utils';

interface IParentSpecie {
  readonly: boolean,
  data: IDataQuarterly,
  meta: any,
  handleMeta: (param: any) => void,
}

const ParentSpecie: FC<IParentSpecie> = ({
  readonly, data, meta, handleMeta
}) => {
  const { t } = useTranslation();
  const [currentMeta, setCurrentMeta] = useState<any>({ visible: false, row: {} });

  const { species = [], plagues = [] } = meta || {};
  const { species: dataSpecies = [] } = data || {};

  const handleCurrentMeta = (param: any) => setCurrentMeta((_currentMeta: any) => ({ ..._currentMeta, ...param }));

  const handleCreate = (values: any) => {
    const newValues = { ...values };
    const input = species.length > 0 ? [...species].concat([newValues]) : [newValues];
    handleMeta({ species: input });
  };

  const handleDelete = (idDelete: string) => {
    const exist = plagues.some(({ specie: _specie }: any) => _specie?.id?.toString() === idDelete);
    if (exist) {
      notify({ type: 'warning', message: t('quarterlyReports.specie.errorDelete') });
      return;
    }
    const input = [...species].filter(({ id: row }) => row !== idDelete);
    handleMeta({ species: input });
  };

  const handleEdit = ({ id: idEdit, ...rest }: any) => {
    const input = [...species];
    const index = input.indexOf(input.find(({ id: row }) => row === idEdit));
    input[index] = { id: idEdit, ...rest };
    handleMeta({ species: input });
  };

  const handleForm = (row: any) => {
    handleCurrentMeta({ row, visible: true });
  };

  const handleSubmit = (values: any) => {
    if (!readonly) {
      if (currentMeta.row?.id) {
        handleEdit({ ...values, id: currentMeta.row.id });
      } else {
        handleCreate(values);
      }
    }
    handleCurrentMeta({ row: {}, visible: false });
  };

  return (
    <div>
      <Title title={t('quarterlyReports.specie.titleParent')} />
      {!readonly && (
        <>
          {(!meta.quarter || !meta.plantId) && (<Alert type="info" message={t('quarterlyReports.specie.hlpPrevious')} showIcon />)}
          <Row justify="end" style={{ marginBottom: 5, marginTop: 10 }}>
            <Col span={4}>
              <Button
                disabled={readonly || dataSpecies.length === 0 || !meta.quarter}
                type="primary"
                className="custom-full-width"
                onClick={() => {
                  handleForm({});
                }}
              >
                {t('quarterlyReports.specie.add')}
              </Button>
            </Col>
          </Row>
        </>
      )}
      <SpecieForm
        visible={currentMeta.visible}
        handleCancel={() => handleCurrentMeta({ visible: false })}
        specie={currentMeta.row}
        handleSubmit={handleSubmit}
        readonly={readonly}
        data={data}
        species={species}
      />
      <SpecieList
        readonly={readonly}
        handleDelete={handleDelete}
        species={species}
        handleEdit={handleForm}
      />
    </div>
  );
};

export default ParentSpecie;
